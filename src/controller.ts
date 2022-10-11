import Model, { LineModel } from './model';
import View, { Handle, LineView } from './view/view';

interface LineWithHandle {
  name: string;
  line: HTMLElement;
  handle: HTMLElement;
}

interface SimpleLine {
  line: HTMLElement;
  name: string;
  value: number;
}

export interface LineInitParams {
  name: string;
  value: number;
  color: string;
  onChange: (value: number) => void;
}

type InternalOnChange = (ids: number, params: { auto: boolean }) => void;

type Lines = [SimpleLine, ...Array<LineWithHandle>];

export type InternalLineInitParams = Required<
  Omit<LineInitParams, 'onChange'>
> & { onChange: InternalOnChange };

export default class Controller {
  public constructor(private model: Model, private view: View) {
    this.model = model;
    this.view = view;
    this.activateDragHandleListener();
  }

  public createSingleLine(params: InternalLineInitParams): SimpleLine {
    const { name, value, onChange, color } = params;

    const line = this.view.createLine(name, color);
    const lineView: LineView = {
      name: name,
      line: line,
      onChange: onChange,
      nextLineView: null,
      previousLineView: null,
    };

    const lineModel: LineModel = {
      name: name,
      value: value,
    };

    this.view.lines[name] = lineView;
    this.view.setLineWidth(name, value);

    this.model.lines[name] = lineModel;

    onChange(value, { auto: value === Model.TOTAL });

    return {
      line,
      name: name,
      value: value,
    };
  }

  public createLineWithHandle(params: InternalLineInitParams): LineWithHandle {
    const { name, value, onChange, color } = params;
    const line = this.view.createLine(name, color);
    const namePrev = this.view.getLastLineName();

    this.model.lines[name] = {
      name: name,
      value: value,
    };

    this.view.lines[name] = {
      name: name,
      line: line,
      onChange: onChange,
      previousLineView: this.view.lines[namePrev],
      nextLineView: null,
    };

    this.view.lines[namePrev].nextLineView = this.view.lines[name];

    const handle = this.view.createHandle();
    this.view.handles.set(handle, {
      handle: handle,
      previousLineName: namePrev,
      nextLineName: name,
    });

    return { name, line, handle };
  }

  public createLines(params: InternalLineInitParams[]): Lines {
    const singleLine = this.createSingleLine(params[0]);
    const restLinesWithHandles = params
      .slice(1)
      .map(this.createLineWithHandle, this);

    return [singleLine, ...restLinesWithHandles];
  }

  public divideSliderIntoEqualParts(): void {
    const names = Object.keys(this.model.lines);
    const amount = names.length;
    const diffs = this.model.getEqualParts(amount);

    names.forEach(function (this: Controller, name, index) {
      this.model.lines[name].value = diffs[index];
      const onChange = this.view.lines[name].onChange;
      onChange(diffs[index], { auto: true });

      const aggregate = diffs
        .slice(0, index + 1)
        .reduce((acc, curr) => acc + curr, 0);
      this.view.setLineWidth(name, aggregate);
    }, this);

    this.view.handles.forEach(function (this: Controller, handleData: Handle) {
      const partialHandleData = {
        handle: handleData.handle,
        name: handleData.nextLineName,
      };

      this.updateHandlePosition(partialHandleData);
    }, this);
  }

  public addLineWithHandleToSlider(value: number, lwh: LineWithHandle): void {
    const aggregation = Object.keys(this.model.lines).reduce((acc, curr) => {
      return acc + this.model.lines[curr].value;
    }, 0);

    this.view.setLineWidth(lwh.name, aggregation);
    this.view.appendElement(lwh.handle);
    this.updateHandlePosition(lwh);
    this.view.appendElement(lwh.line);

    this.view.lines[lwh.name].onChange(value);
  }

  public addLinesToSlider(lines: Lines): void {
    var singleLine = lines[0];
    this.view.appendElement(singleLine.line);
    (lines.slice(1) as LineWithHandle[]).forEach((lwh, index, arr) => {
      const lineName = lwh.name;
      const value = this.model.lines[lineName].value;
      const prevName = arr[index - 1]?.name || singleLine.name;
      const prevLineWidth = this.view.getLineWidthInPercent(prevName);

      this.view.setLineWidth(lwh.name, value + prevLineWidth);
      this.view.appendElement(lwh.handle);
      this.updateHandlePosition(lwh);
      this.view.appendElement(lwh.line);

      this.view.lines[lineName].onChange(value);
    });
  }

  public addLineWithHandleToSliderAuto(lwh: LineWithHandle): void {
    this.divideSliderIntoEqualParts();
    this.view.appendElement(lwh.handle);
    this.view.appendElement(lwh.line);
  }

  public addLineWithHandleToSliderGreedy(lwh: LineWithHandle): void {
    const emptySpace = Model.TOTAL - this.model.getSumOfLines();
    this.model.lines[lwh.name].value = emptySpace;
    this.view.setLineWidth(lwh.name, Model.TOTAL);
    this.view.appendElement(lwh.handle);
    this.updateHandlePosition(lwh);
    this.view.appendElement(lwh.line);

    this.view.lines[lwh.name].onChange(emptySpace, { auto: true });
  }

  public addLineWithHandleToSliderBySplitLastLine(lwh: LineWithHandle): void {
    const prevLineView = this.view.lines[lwh.name].previousLineView;
    const prevLineValue =
      (prevLineView && this.model.lines[prevLineView.name].value) || 0;

    const prevDividedInto2 = prevLineValue / 2;
    const newPrevLineValue = Math.floor(prevDividedInto2);
    const newLineValue = Math.ceil(prevDividedInto2);

    if (prevLineView && prevLineView.line) {
      prevLineView.line.style.width =
        parseInt(prevLineView.line.style.width || '0') - newLineValue + '%';
    }

    this.model.lines[lwh.name].value = newLineValue;

    if (prevLineView) {
      this.model.lines[prevLineView.name].value = newPrevLineValue;
    }

    this.addLineWithHandleToSlider(newLineValue, lwh);

    this.view.lines[lwh.name].onChange(newLineValue);
    prevLineView &&
      this.view.lines[prevLineView.name].onChange(newPrevLineValue);
  }

  public activateDragHandleListener(): void {
    const updateValues = (
      handle: HTMLElement,
      oldHandleLeft: number,
      newHandleLeft: number
    ) => {
      const handleData = this.view.getHandleData(handle);

      const previousName = handleData.previousLineName;
      const nextName = handleData.nextLineName;

      // view
      this.view.setLineWidth(previousName, newHandleLeft);

      // model
      const diff = oldHandleLeft - newHandleLeft;
      this.model.lines[previousName].value -= diff;
      this.model.lines[nextName].value += diff;

      const fromOnChange = this.view.lines[previousName].onChange;
      const toOnChange = this.view.lines[nextName].onChange;

      fromOnChange(this.model.lines[previousName].value);
      toOnChange(this.model.lines[nextName].value);
    };

    this.view.makeHandleMoveable(updateValues);
  }

  public removeLine(name: string, onRemove: () => void): void {
    const removingLineModel = this.model.lines[name];
    const removingLineView = this.view.lines[name];

    if (!removingLineModel || !removingLineView) {
      console.warn('Line ' + name + ' not found');
      return;
    }

    const isSingleLine = Object.keys(this.model.lines).length === 1;

    if (isSingleLine) {
      this.model.lines = {};
      this.view.lines = {};
      this.view.handles = new Map();

      View.removeElement(removingLineView.line);

      onRemove();

      return;
    }

    const isLastLine = this.view.getLastLineName() === name;

    if (isLastLine) {
      const handleData = this.view.findHandleDataByToLineName(name);
      const line = removingLineView.line;
      const prevLineName = handleData && handleData.previousLineName;
      const valueTo = removingLineModel.value;

      if (!prevLineName) {
        throw new Error('Unexpected behavior during remove last line');
      }

      this.view.lines[prevLineName].nextLineView = null;
      this.model.lines[prevLineName].value += valueTo;

      this.view.setLineWidth(prevLineName, Model.TOTAL);
      this.view.lines[prevLineName].onChange(
        this.model.lines[prevLineName].value,
        { auto: true }
      );

      if (handleData) {
        View.removeElement(handleData.handle);
        this.view.removePreviousHandles(handleData.handle);
      }

      View.removeElement(line);

      delete this.model.lines[name];
      delete this.view.lines[name];

      onRemove();

      return;
    }

    // Generic case
    const handleData = this.view.findHandleDataByFromLineName(name);
    const nextLineName = handleData && handleData.nextLineName;
    const removingLineValue = removingLineModel.value;
    const line = removingLineView.line;

    if (!nextLineName) {
      throw new Error('Unexpected behavior during remove line');
    }

    this.model.lines[nextLineName].value += removingLineValue;
    this.view.lines[nextLineName].previousLineView =
      removingLineView.previousLineView;

    const isFirstLine = removingLineView.previousLineView === null;

    if (!isFirstLine && removingLineView.previousLineView) {
        removingLineView.previousLineView.name = removingLineView.name;
      }
    }

    const updateHandles = () => {
      if (isLastLine) {
        return;
      }

      const leftHandleData = this.view.findHandleDataByToLineName(name);
      const rightHandleData = this.view.findHandleDataByFromLineName(name);

      if (leftHandleData && rightHandleData) {
        leftHandleData.nextLineName = rightHandleData.nextLineName;
      }
    };

    updateHandles();

    this.view.lines[nextLineName].onChange(
      this.model.lines[nextLineName].value
    );

    if (handleData) {
      this.view.removePreviousHandles(handleData.handle);
      View.removeElement(handleData.handle);
    }
    View.removeElement(line);

    delete this.model.lines[name];
    delete this.view.lines[name];

    onRemove();
  }

  private updateHandlePosition({ handle, name }: Omit<LineWithHandle, 'line'>) {
    const prevLineView = this.view.lines[name].previousLineView;
    handle.style.left =
      (prevLineView &&
        Math.round(this.view.getLineWidthInPercent(prevLineView.name)) + '%') ||
      '1%';
  }
}
