import View, { Handle, LineViewMap } from './view';

type Platform = 'mobile' | 'desktop';

interface PlatformDependetData<E extends Platform> {
  eventName: E extends 'mobile' ? 'ontouchstart' : 'onmousedown';
  getClientX: (event: E extends 'mobile' ? TouchEvent : MouseEvent) => number;
  move: {
    start: E extends 'mobile' ? 'touchmove' : 'mousemove';
    finish: E extends 'mobile' ? 'touchend' : 'mouseup';
  };
}

interface Env {
  mobile: PlatformDependetData<'mobile'>;
  desktop: PlatformDependetData<'desktop'>;
}

const environment: Env = {
  mobile: {
    eventName: 'ontouchstart',
    getClientX: (event) => event.touches[0].clientX,
    move: { start: 'touchmove', finish: 'touchend' },
  },
  desktop: {
    eventName: 'onmousedown',
    getClientX: (event) => event.clientX,
    move: { start: 'mousemove', finish: 'mouseup' },
  },
};

export class MakeHandleMoveable {
  constructor(view: View) {
    const platform: Platform =
      typeof window.orientation !== 'undefined' ? 'mobile' : 'desktop';

    this.enviroment = environment[platform];
    this.view = view;
  }

  public makeHandleMoveable(
    updateValues: (handle: HTMLElement, a: number, b: number) => void
  ): void {
    this.view.slider[this.enviroment.eventName] = (event) => {
      const isHtmlElement = event.target instanceof HTMLElement;
      const isHandle =
        isHtmlElement &&
        (event.target.closest('[data-handle]') as HTMLElement | undefined)
          ?.dataset?.handle === 'handle';

      if (!isHandle) {
        return;
      }

      let handle = event.target;

      const handleData = this.view.getHandleData(handle);

      const prevLineValue =
        handleData?.previousLineName &&
        this.view.lines[handleData?.previousLineName].line.dataset.value;
      const nextLineValue =
        handleData?.nextLineName &&
        this.view.lines[handleData?.nextLineName].line.dataset.value;

      if (prevLineValue === undefined || nextLineValue === undefined) {
        console.warn(
          'Percentage Slider: It looks like you are trying to move a handle that does not limit two lines'
        );
        return;
      }

      const isHandleLocked = prevLineValue === '0' && nextLineValue === '0';

      const params: Omit<ProccessMovementParams, 'handle'> = {
        event,
        updateValues,
        view: this.view,
        enviroment: this.enviroment,
      };

      if (isHandleLocked) {
        handle = findHandleThatCanBeMoved({
          handle: handle,
          handles: this.view.handles,
          lines: this.view.lines,
        });
        processMovement({ ...params, handle });
      } else {
        processMovement({ ...params, handle });
      }
    };
  }

  private view: View;

  private enviroment: Env[keyof Env];
}

interface ProccessMovementParams {
  event: TouchEvent | MouseEvent;
  handle: HTMLElement;
  view: View;
  enviroment: Env[keyof Env];
  updateValues: (handle: HTMLElement, a: number, b: number) => void;
}

function processMovement(params: ProccessMovementParams): void {
  const { event, view, enviroment, updateValues } = params;

  let handle = params.handle;

  if (event.cancelable) {
    event.preventDefault();
  }

  const sliderWidthStr = view.slider.firstChild
    ? getComputedStyle(view.slider.firstChild as Element).width
    : '0';
  const longestLineWidth = parseFloat(sliderWidthStr || '');
  const longestLinePercent = Math.round(
    view.convertToPercent(longestLineWidth)
  );

  const isPartialFilledSlider = longestLinePercent !== 100;
  const shiftX =
    enviroment.getClientX(event as TouchEvent & MouseEvent) -
    handle.getBoundingClientRect().left;

  const onMove = (event: TouchEvent | MouseEvent) => {
    let newLeft =
      enviroment.getClientX(event as TouchEvent & MouseEvent) -
      shiftX -
      view.slider.getBoundingClientRect().left;

    const considerLeftEdgeCase = () => {
      const previousName = view.getHandleData(handle).previousLineName;
      const prevHandleData = view.findHandleDataByToLineName(previousName);
      const isFirstHandle = prevHandleData === null;

      if (!isFirstHandle) {
        const prevHandle = prevHandleData && prevHandleData.handle;
        const prevHandleLeft =
          (prevHandle &&
            parseFloat(getComputedStyle(prevHandle).left || '0')) ||
          0;

        if (newLeft < prevHandleLeft) {
          newLeft = prevHandleLeft;
          handle = findHandleThatCanBeMovedToLeft({
            handle: handle,
            handles: view.handles,
            lines: view.lines,
          });
          return;
        }
      }

      if (newLeft < 0) {
        newLeft = 0;
      }
    };

    const considerRightEdgeCase = () => {
      let rightEdgeSource = view.slider.offsetWidth;
      let offset = view.slider.getBoundingClientRect().left;
      newLeft += offset;

      if (isPartialFilledSlider) {
        const longestLine = view.slider.firstChild;
        rightEdgeSource =
          (longestLine && (longestLine as HTMLElement).offsetWidth) ||
          rightEdgeSource;
        offset =
          (longestLine &&
            (longestLine as HTMLElement).getBoundingClientRect().left) ||
          offset;
      }

      const nextName = view.getHandleData(handle).nextLineName;
      const nextHandleData = view.findHandleDataByFromLineName(nextName);
      const isLastLine = nextHandleData === null;

      if (!isLastLine && nextHandleData) {
        const nextHandle = nextHandleData.handle;
        const nextHandleLeft = parseFloat(
          getComputedStyle(nextHandle).left || '0'
        );

        if (newLeft > nextHandleLeft + offset) {
          newLeft = nextHandleLeft;
          handle = findHandleThatCanBeMovedToRight({
            handle: handle,
            handles: view.handles,
            lines: view.lines,
          });
          return;
        }
      }

      newLeft -= offset;

      const rightEdge = rightEdgeSource;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }
    };

    considerLeftEdgeCase();
    considerRightEdgeCase();

    const currentLeft = parseFloat(getComputedStyle(handle).left || '0');
    const newLeftInPercent = Math.round(view.convertToPercent(newLeft));
    const oldLeftInPercent = Math.round(view.convertToPercent(currentLeft));

    handle.style.left = `${newLeftInPercent}%`;

    updateValues(handle, oldLeftInPercent, newLeftInPercent);
  };

  const onMoveEnd = () => {
    document.removeEventListener(enviroment.move.finish, onMoveEnd);
    document.removeEventListener(enviroment.move.start, onMove);
  };

  document.addEventListener(enviroment.move.start, onMove);
  document.addEventListener(enviroment.move.finish, onMoveEnd);
}

interface ParamsToFindNewHandle {
  handle: HTMLElement;
  handles: Map<HTMLElement, Handle>;
  lines: LineViewMap;
}

function findHandleThatCanBeMoved({
  handle,
  handles,
  lines,
}: ParamsToFindNewHandle): HTMLElement {
  const restHandles = Array.from(handles.entries()).filter(
    ([iteratedHandle, { previousLineName, nextLineName }]) => {
      const isNotCurrentHandle = iteratedHandle !== handle;

      const prevVal = lines[previousLineName].line.dataset.value;
      const nextVal = lines[nextLineName].line.dataset.value;

      const hasNonZeroLine = prevVal !== '0' || nextVal !== '0';

      return isNotCurrentHandle && hasNonZeroLine;
    }
  );

  return restHandles.length > 0 ? restHandles[0][0] : handle;
}

function findHandleThatCanBeMovedToRight({
  handle,
  handles,
  lines,
}: ParamsToFindNewHandle): HTMLElement {
  const handleData = handles.get(handle);

  const candidateLineName =
    handleData?.nextLineName && lines[handleData.nextLineName].name;

  const restHandles = Array.from(handles.entries()).filter(
    ([_, { nextLineName }]) => {
      return lines[nextLineName].previousLineView?.name === candidateLineName;
    }
  );

  return restHandles.length > 0 ? restHandles[0][0] : handle;
}

function findHandleThatCanBeMovedToLeft({
  handle,
  handles,
  lines,
}: ParamsToFindNewHandle): HTMLElement {
  const handleData = handles.get(handle);

  const candidateLineName =
    handleData?.previousLineName && lines[handleData.previousLineName].name;

  const restHandles = Array.from(handles.entries()).filter(
    ([_, { previousLineName }]) => {
      return lines[previousLineName].nextLineView?.name === candidateLineName;
    }
  );

  return restHandles.length > 0 ? restHandles[0][0] : handle;
}

export default MakeHandleMoveable;
