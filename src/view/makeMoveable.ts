import View from './view';

type Platform = 'mobile' | 'desktop'

interface PlatformDependetData<E extends Platform> {
  eventName: E extends 'mobile' ? 'ontouchstart' : 'onmousedown'
  getClientX: (event: E extends 'mobile' ? TouchEvent : MouseEvent) => number
  move:
    { start: E extends 'mobile' ? 'touchmove' : 'mousemove'
    , finish: E extends 'mobile' ? 'touchend' : 'mouseup'
    }
}

interface Env {
  mobile: PlatformDependetData<'mobile'>
  desktop: PlatformDependetData<'desktop'>
}

const environment: Env = {
  mobile:
    { eventName: 'ontouchstart'
    , getClientX: (event) => event.touches[0].clientX
    , move: { start: 'touchmove', finish: 'touchend' }
    },
  desktop:
    { eventName: 'onmousedown'
    , getClientX: (event) => event.clientX
    , move: { start: 'mousemove', finish: 'mouseup' }
    }
};


export class MakeHandleMoveable {

  constructor(view: View) {
    const platform: Platform = typeof window.orientation !== 'undefined' ? 'mobile' : 'desktop';

    this.enviroment = environment[platform];
    this.view = view;
  }

  private view: View;

  private enviroment: Env[keyof Env];

  public makeHandleMoveable(handle: HTMLElement, updateValues: (a: number, b: number) => void): void {

    handle[this.enviroment.eventName] = (event) => {

      if (event.cancelable) {
        event.preventDefault();
      }

      const sliderWidthStr = this.view.slider.firstChild ? getComputedStyle(this.view.slider.firstChild as Element).width : '0';
      const longestLineWidth = parseFloat(sliderWidthStr || '');
      const longestLinePercent = Math.round(this.view.convertToPercent(longestLineWidth));

      const isPartialFilledSlider = longestLinePercent !== 100;
      const shiftX = this.enviroment.getClientX(event as TouchEvent & MouseEvent) - handle.getBoundingClientRect().left;


      const onMove = (event: TouchEvent) => {
        let newLeft = this.enviroment.getClientX(event as TouchEvent & MouseEvent) - shiftX - this.view.slider.getBoundingClientRect().left;

        const considerLeftEdgeCase = () => {
          const previousName = this.view.getHandleData(handle).previousName;
          const prevHandleData = this.view.findHandleDataByToLineName(previousName);
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

          const nextName = this.view.getHandleData(handle).nextName;
          const nextHandleData = this.view.findHandleDataByFromLineName(nextName);
          const isLastLine = nextHandleData === null;

          if (!isLastLine && nextHandleData) {
            const nextHandle = nextHandleData.handle;
            const nextHandleLeft = parseFloat(getComputedStyle(nextHandle).left || '0');

            if (newLeft > nextHandleLeft + offset) {
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

        const currentLeft = parseFloat(getComputedStyle(handle).left || '0');
        const newLeftInPercent = Math.round(this.view.convertToPercent(newLeft));
        const oldLeftInPercent = Math.round(this.view.convertToPercent(currentLeft));

        handle.style.left = `${newLeftInPercent}%`;

        updateValues(oldLeftInPercent, newLeftInPercent);

      }

      const onMoveEnd = () => {
        document.removeEventListener(this.enviroment.move.finish, onMoveEnd);
        document.removeEventListener(this.enviroment.move.start, onMove);
      }

      document.addEventListener(this.enviroment.move.start, onMove);
      document.addEventListener(this.enviroment.move.finish, onMoveEnd);
    };

    handle.ondragstart = function () {
      return false;
    };
  }
}

export default MakeHandleMoveable;
