import View from './view';

export interface IMakeHandleMovable {
  makeHandleMoveable: (handle: HTMLElement, updateValues: (a: number, b: number) => void) => void;
  view: View;
}

export class MakeHandleMoveableMobile implements IMakeHandleMovable {

  public view: View;

  public makeHandleMoveable(handle: HTMLElement, updateValues: (a: number, b: number) => void): void {

    if (!this.view) {
      throw new Error('View field is not initialized');
    }

    handle.ontouchstart = (event) => {

      if (event.cancelable) {
        event.preventDefault();
      }

      // const getSumOfParentsMarginLeft = () => {
      //   let el = this.view.slider.parentElement;
      //   let sum = 0;
      //   while (el) {
      //     const marginLeft = getComputedStyle(el).marginLeft;
      //     const marginLeftInt = parseInt(marginLeft || '0', 10);
      //     sum += marginLeftInt;
      //     el = el.parentElement;
      //   }
      //   return sum;
      // }

      // const sumMarginLeftInt = getSumOfParentsMarginLeft();

      const sliderWidthStr = this.view.slider.firstChild ? getComputedStyle(this.view.slider.firstChild as Element).width : '0';
      const longestLineWidth = parseFloat(sliderWidthStr || '');
      const longestLinePercent = Math.round(this.view.convertToPercent(longestLineWidth));

      const isPartialFilledSlider = longestLinePercent !== 100;
      const shiftX = event.touches[0].clientX - handle.getBoundingClientRect().left;

      const onTouchMove = (event: TouchEvent) => {
        let newLeft = event.touches[0].clientX - shiftX - this.view.slider.getBoundingClientRect().left;

        const considerLeftEdgeCase = () => {
          const nameFrom = this.view.getHandleData(handle).nameFrom;
          const prevHandleData = this.view.findHandleDataByToLineName(nameFrom);
          const isFirstHandle = prevHandleData === null;

          if (!isFirstHandle) {
            const prevHandle = prevHandleData && prevHandleData.handle;
            const prevHandleLeft = prevHandle && parseFloat(getComputedStyle(prevHandle).left || '0') || 0;

            if (newLeft < prevHandleLeft) {
              newLeft = prevHandleLeft;
              return;
            }
          }

          if (newLeft < 0) {
            newLeft = 0;
          }
        }

        const considerRightEdgeCase = () => {
          let rightEdgeSource = this.view.slider.offsetWidth;
          let offset = this.view.slider.getBoundingClientRect().left;
          newLeft += offset;

          if (isPartialFilledSlider) {
            const longestLine = this.view.slider.firstChild;
            rightEdgeSource = longestLine && (longestLine as HTMLElement).offsetWidth || rightEdgeSource;
            offset = longestLine && (longestLine as HTMLElement).getBoundingClientRect().left || offset;
          }

          const nameTo = this.view.getHandleData(handle).nameTo;
          const nextHandleData = this.view.findHandleDataByFromLineName(nameTo);
          const isLastLine = nextHandleData === null;

          if (!isLastLine && nextHandleData) {
            const nextHandle = nextHandleData.handle;
            const nextHandleLeft = parseFloat(getComputedStyle(nextHandle).left || '0');

            if (newLeft > nextHandleLeft) {
              newLeft = nextHandleLeft;
              return;
            }
          }

          newLeft -= offset;

          const rightEdge = rightEdgeSource;
          if (newLeft > rightEdge) {
            newLeft = rightEdge;
          }
        }

        considerLeftEdgeCase();
        considerRightEdgeCase();

        const curLeft = parseFloat(getComputedStyle(handle).left || '0');
        const newLeftInPercent = Math.round(this.view.convertToPercent(newLeft));
        const oldLeftInPercent = Math.round(this.view.convertToPercent(curLeft));

        handle.style.left = `${newLeftInPercent}%`;
        handle.style.zIndex = '1';

        if (newLeftInPercent === 0) {
          this.view.calculateZIndexForExtraLeftCase(handle);
        }

        updateValues(oldLeftInPercent, newLeftInPercent);

      }

      const onTouchEnd = () => {
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchmove', onTouchMove);
      }

      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    };

    handle.ondragstart = function () {
      return false;
    };
  }
}

export class MakeHandleMoveableDesktop implements IMakeHandleMovable {

  public view: View;

  public makeHandleMoveable(handle: HTMLElement, updateValues: (a: number, b: number) => void): void {

    if (!this.view) {
      throw new Error('View field is not initialized');
    }

    handle.onmousedown = (event) => {

      event.preventDefault();

      const getSumOfParentsMarginLeft = () => {
        let el = this.view.slider.parentElement;
        let sum = 0;
        while (el) {
          const marginLeft = getComputedStyle(el).marginLeft;
          const marginLeftInt = parseInt(marginLeft || '0', 10);
          sum += marginLeftInt;
          el = el.parentElement;
        }
        return sum;
      }

      const sumMarginLeftInt = getSumOfParentsMarginLeft();

      const sliderWidthStr = this.view.slider.firstChild ? getComputedStyle(this.view.slider.firstChild as Element).width : '0';
      const longestLineWidth = parseFloat(sliderWidthStr || '');
      const longestLinePercent = Math.round(this.view.convertToPercent(longestLineWidth));

      const isPartialFilledSlider = longestLinePercent !== 100;
      const shiftX = event.clientX - handle.getBoundingClientRect().left;

      const onMouseMove = (event: MouseEvent) => {
        let newLeft = event.clientX - shiftX - this.view.slider.getBoundingClientRect().left;

        const considerLeftEdgeCase = () => {
          const nameFrom = this.view.getHandleData(handle).nameFrom;
          const prevHandleData = this.view.findHandleDataByToLineName(nameFrom);
          const isFirstHandle = prevHandleData === null;

          if (!isFirstHandle) {
            const prevHandle = prevHandleData && prevHandleData.handle;
            const prevHandleLeft = prevHandle && parseFloat(getComputedStyle(prevHandle).left || '0') || 0;

            if (newLeft < prevHandleLeft) {
              newLeft = prevHandleLeft;
              return;
            }
          }

          if (newLeft < 0) {
            newLeft = 0;
          }
        }

        const considerRightEdgeCase = () => {
          let rightEdgeSource = this.view.slider.offsetWidth;
          let offset = this.view.slider.getBoundingClientRect().left;
          newLeft += offset;

          if (isPartialFilledSlider) {
            const longestLine = this.view.slider.firstChild;
            rightEdgeSource = longestLine && (longestLine as HTMLElement).offsetWidth || rightEdgeSource;
            offset = longestLine && (longestLine as HTMLElement).getBoundingClientRect().left || offset;
          }

          const nameTo = this.view.getHandleData(handle).nameTo;
          const nextHandleData = this.view.findHandleDataByFromLineName(nameTo);
          const isLastLine = nextHandleData === null;

          if (!isLastLine && nextHandleData) {
            const nextHandle = nextHandleData.handle;
            const nextHandleLeft = parseFloat(getComputedStyle(nextHandle).left || '0') + sumMarginLeftInt;

            if (newLeft > nextHandleLeft) {
              newLeft = (nextHandleLeft - sumMarginLeftInt);
              return;
            }
          }

          newLeft -= offset;

          const rightEdge = rightEdgeSource;
          if (newLeft > rightEdge) {
            newLeft = rightEdge;
          }
        }

        considerLeftEdgeCase();
        considerRightEdgeCase();

        const curLeft = parseFloat(getComputedStyle(handle).left || '0');
        const newLeftInPercent = Math.round(this.view.convertToPercent(newLeft));
        const oldLeftInPercent = Math.round(this.view.convertToPercent(curLeft));

        handle.style.left = `${newLeftInPercent}%`;
        handle.style.zIndex = '1';

        if (newLeftInPercent === 0) {
          this.view.calculateZIndexForExtraLeftCase(handle);
        }

        updateValues(oldLeftInPercent, newLeftInPercent);

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

export type TMakeHandleMoveable =
  typeof MakeHandleMoveableDesktop |
  typeof MakeHandleMoveableMobile;

function getMakeHandleMoveableCls(): TMakeHandleMoveable {
  const isMobileDevice = typeof window.orientation !== 'undefined';
  return isMobileDevice ? MakeHandleMoveableMobile : MakeHandleMoveableDesktop;
}

const MakeMoveable = getMakeHandleMoveableCls();

export default MakeMoveable;
