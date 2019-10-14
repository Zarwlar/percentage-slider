interface IHandle {
  handle: HTMLElement;
  nameFrom: string;
  nameTo: string
}

export default class View {
  public static ids: number = 0;

  public static createSlider() {
    var slider = document.createElement('div');
    slider.classList.add('slider');
    slider.setAttribute('name', 'slider_' + ++View.ids);
    return slider;
  }

  public static removeElement(item: HTMLElement) {
    if (!item.parentNode) { return; }

    item.parentNode.removeChild(item);
  }

  public node: HTMLElement;
  public slider: HTMLElement;
  public lineIds: number;
  public items: any;
  public handles: IHandle[];

  public constructor(node: HTMLElement) {
    this.node = node;
    this.slider = View.createSlider();
    this.lineIds = 0;
    this.items = {};
    this.handles = [];

    this.node.appendChild(this.slider);
  }

  public removeFromHandles(handle: HTMLElement) {
    var handleIndex = this.handles.findIndex(handleData => handleData.handle === handle);

    this.handles.splice(handleIndex, 1);
  }

  public createLine(name: string) {
    var id = ++this.lineIds;
    var line = document.createElement('div');

    line.setAttribute('name', name);
    line.classList.add('line');
    line.classList.add('line_' + id);

    return line;
  }

  public createHandle() {
    var handle = document.createElement('div');

    handle.classList.add('handle');

    return handle;
  }

  public appendItem(item: HTMLElement) {
    this.slider.insertBefore(item, this.slider.firstChild);
  }

  public setLineWidth(name: string, value: number) {
    this.items[name].line.style.width = `${value}%`;
  }

  public getLastItemName() {
    const namesPrev = Object
      .keys(this.items)
      .filter(item => this.items[item]._next === null, this);

    if (namesPrev.length !== 1) {
      throw new Error('Error when trying to find last item');
    }

    return namesPrev[0];
  }

  public getHandleData(handle: HTMLElement) {
    const handleIndex = this.handles.findIndex(
      handleData => handleData.handle === handle
    );

    if (handleIndex === -1) {
      throw new Error('Error when trying to find handle');
    }

    return this.handles[handleIndex];
  }

  public getPercentOf(name: string) {
    const particularLineWidth = this.items[name].line.offsetWidth;
    return this.convertToPercent(particularLineWidth);
  }

  public convertToPercent(value: number) {
    const totalPercent = this.slider.offsetWidth;
    return (value * 100) / totalPercent;
  }

  public findHandleDataByToLineName(name: string) {
    const handleIndex = this.handles.findIndex(handle => {
      return handle.nameTo === name;
    });

    return handleIndex === -1 ? null : this.handles[handleIndex];
  }

  public findHandleDataByFromLineName(name: string) {
    const handleIndex = this.handles.findIndex(handle => {
      return handle.nameFrom === name;
    });

    return handleIndex === -1 ? null : this.handles[handleIndex];
  }

  public makeHandleMoveable(handle: HTMLElement, updateValues: (a: number, b: number) => void) {

    handle.onmousedown = (event) => {
      event.preventDefault();

      const sliderWidthStr = this.slider.firstChild ? getComputedStyle(this.slider.firstChild as Element).width : '0';
      const longestLineWidth = Number.parseFloat(sliderWidthStr || '');
      const longestLinePercent = Math.round(this.convertToPercent(longestLineWidth));

      const isPartialFilledSlider = longestLinePercent !== 100;
      const shiftX = event.clientX - handle.getBoundingClientRect().left;

      const onMouseMove = (event: MouseEvent) => {
        let newLeft = event.clientX - shiftX - this.slider.getBoundingClientRect().left;

        considerLeftEdgeCase.call(this);
        considerRightEdgeCase.call(this);

        const curLeft = Number.parseFloat(getComputedStyle(handle).left || '0');
        const newLeftInPercent = Math.round(this.convertToPercent(newLeft));
        const oldLeftInPercent = Math.round(this.convertToPercent(curLeft));

        handle.style.left = `${newLeftInPercent}%`;

        updateValues(oldLeftInPercent, newLeftInPercent);

        function considerLeftEdgeCase() {
          const nameFrom = this.getHandleData.call(this, handle).nameFrom;
          const prevHandleData = this.findHandleDataByToLineName.call(this, nameFrom);
          const isFirstHandle = prevHandleData === null;

          if (!isFirstHandle) {
            const prevHandle = prevHandleData.handle;
            const prevHandleLeft = Number.parseFloat(getComputedStyle(prevHandle).left || '0');

            if (newLeft < prevHandleLeft) {
              newLeft = prevHandleLeft;
              return;
            }
          }

          if (newLeft < 0) {
            newLeft = 0;
          }
        }

        function considerRightEdgeCase() {
          var rightEdgeSource = this.slider.offsetWidth;
          var offset = this.slider.getBoundingClientRect().left;
          newLeft += offset;

          if (isPartialFilledSlider) {
            var longestLine = this.slider.firstChild;
            rightEdgeSource = longestLine.offsetWidth;
            offset = longestLine.getBoundingClientRect().left;
          }

          var nameTo = this.getHandleData.call(this, handle).nameTo;
          var nextHandleData = this.findHandleDataByFromLineName.call(this, nameTo);
          var isLastLine = nextHandleData === null;

          if (!isLastLine) {
            var nextHandle = nextHandleData.handle;
            var nextHandleLeft = Number.parseFloat(getComputedStyle(nextHandle).left || '0');

            if (newLeft > nextHandleLeft) {
              newLeft = nextHandleLeft;
              return;
            }
          }

          newLeft -= offset;

          var rightEdge = rightEdgeSource;
          if (newLeft > rightEdge) {
            newLeft = rightEdge;
          }
        }
      }

      const onMouseUp = () => {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    handle.ondragstart = function () {
      return false;
    };
  }
}

