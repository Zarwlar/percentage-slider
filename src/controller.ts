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

type Lines = [SimpleLine, ...Array<LineWithHandle>]

export type InternalLineInitParams
  = Required<Omit<LineInitParams, 'onChange'>> & { onChange: InternalOnChange }

export default class Controller {
  private _model: Model;
  private _view: View;

  public constructor(model: Model, view: View) {
    this._model = model;
    this._view = view;
    this.activateDragHandleListener();
  }

  public createSingleLine(params: InternalLineInitParams): SimpleLine {
    const { name, value, onChange, color } = params;
    if (!name || name.trim() === '') {
      throw new Error('Name must be provided.');
    }

    const line = this._view.createLine(name, color);
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

    this._view.lines[name] = lineView;
    this._view.setLineWidth(name, value);

    this._model.lines[name] = lineModel;

    onChange(value, { auto: value === Model.TOTAL });

    return {
      line,
      name: name,
      value: value,
    };
  }

  public createLineWithHandle(params: InternalLineInitParams): LineWithHandle {
    const { name, value, onChange, color } = params;
    const line = this._view.createLine(name, color);
    const namePrev = this._view.getLastLineName();

    this._model.lines[name] = {
      name: name,
      value: value,
    };

    this._view.lines[name] = {
      name: name,
      line: line,
      onChange: onChange,
      previousLineView: this._view.lines[namePrev],
      nextLineView: null,
    };

    this._view.lines[namePrev].nextLineView = this._view.lines[name];

    const handle = this._view.createHandle();
    this._view.handles.set(handle, {
      handle: handle,
      previousLineName: namePrev,
      nextLineName: name,
    });

    return { name, line, handle };
  }

  public createLines(params: InternalLineInitParams[]): Lines {
    const singleLine = this.createSingleLine(params[0]);
    const restLinesWithHandles = params.slice(1).map(data => this.createLineWithHandle(data)); //TODO: Refactor

    return [singleLine, ...restLinesWithHandles];
  }

  public divideSliderIntoEqualParts(): void {
    const names = Object.keys(this._model.lines);
    const amount = names.length;
    const diffs = this._model.getEqualParts(amount);

    names.forEach(function (this: Controller, name, index) {
      this._model.lines[name].value = diffs[index];
      const onChange = this._view.lines[name].onChange;
      onChange(diffs[index], { auto: true });

      const aggregate = diffs
        .slice(0, index + 1)
        .reduce(function (acc, curr) { return acc + curr }, 0);
      this._view.setLineWidth(name, aggregate);

    }, this);

    this._view.handles.forEach(function (this: Controller, handleData: Handle) {
      const partialHandleData = {
        handle: handleData.handle,
        name: handleData.nextLineName,
      };

      this.updateHandlePosition(partialHandleData);
    }, this);

  }

  public addLineWithHandleToSlider(value: number, lwh: LineWithHandle): void {
    const aggregation = Object.keys(this._model.lines).reduce((acc, curr) => {
      return acc + this._model.lines[curr].value;
    }, 0);

    this._view.setLineWidth(lwh.name, aggregation);
    this._view.appendElement(lwh.handle);
    this.updateHandlePosition(lwh);
    this._view.appendElement(lwh.line);

    this._view.lines[lwh.name].onChange(value);
  }

  public addLinesToSlider(lines: Lines): void {

    var singleLine = lines[0];
    this._view.appendElement(singleLine.line);

    (lines.slice(1) as LineWithHandle[]).forEach((lwh, index, arr) => {
      const lineName = lwh.name;
      const value = this._model.lines[lineName].value;
      const prevName = arr[index - 1]?.name || singleLine.name;
      const prevLineWidth = this._view.getPercentOf(prevName);

      this._view.setLineWidth(lwh.name, value + prevLineWidth);
      this._view.appendElement(lwh.handle);
      this.updateHandlePosition(lwh);
      this._view.appendElement(lwh.line);

      this._view.lines[lineName].onChange(value);
    });
  }

  public addLineWithHandleToSliderAuto(lwh: LineWithHandle): void {
    this.divideSliderIntoEqualParts();
    this._view.appendElement(lwh.handle);
    this._view.appendElement(lwh.line);
  }

  public addLineWithHandleToSliderGreedy(lwh: LineWithHandle): void {
    const emptySpace = Model.TOTAL - this._model.getSumOfLines();
    this._model.lines[lwh.name].value = emptySpace;
    this._view.setLineWidth(lwh.name, Model.TOTAL);
    this._view.appendElement(lwh.handle);
    this.updateHandlePosition(lwh);
    this._view.appendElement(lwh.line);

    this._view.lines[lwh.name].onChange(emptySpace, { auto: true });
  }

  public addLineWithHandleToSliderBySplitLastLine(lwh: LineWithHandle): void {
    const prevLineView = this._view.lines[lwh.name].previousLineView;
    const prevLineValue = prevLineView && this._model.lines[prevLineView.name].value || 0;

    const prevDividedInto2 = prevLineValue / 2;
    const newPrevLineValue = Math.floor(prevDividedInto2);
    const newLineValue = Math.ceil(prevDividedInto2);

    if (prevLineView && prevLineView.line) {
      prevLineView.line.style.width = parseInt(prevLineView.line.style.width || '0') - newLineValue + '%';
    }

    this._model.lines[lwh.name].value = newLineValue;

    if (prevLineView) {
      this._model.lines[prevLineView.name].value = newPrevLineValue;
    }

    this.addLineWithHandleToSlider(newLineValue, lwh);

    this._view.lines[lwh.name].onChange(newLineValue);
    prevLineView && this._view.lines[prevLineView.name].onChange(newPrevLineValue);
  }

  public activateDragHandleListener(): void {
    const updateValues = (handle: HTMLElement, oldHandleLeft: number, newHandleLeft: number) => {
      const handleData = this._view.getHandleData(handle);

      const previousName = handleData.previousLineName;
      const nextName = handleData.nextLineName;

      // view
      this._view.setLineWidth(previousName, newHandleLeft);

      // model
      const diff = oldHandleLeft - newHandleLeft;
      this._model.lines[previousName].value -= diff;
      this._model.lines[nextName].value += diff;

      const fromOnChange = this._view.lines[previousName].onChange;
      const toOnChange = this._view.lines[nextName].onChange;

      fromOnChange(this._model.lines[previousName].value);
      toOnChange(this._model.lines[nextName].value);
    }

    this._view.makeHandleMoveable(updateValues);
  }

  public removeLine(name: string, onRemove: () => void): void {
    const removingLineModel = this._model.lines[name];
    const removingLineView = this._view.lines[name];

    if (!removingLineModel || !removingLineView) {
      console.warn('Line ' + name + ' not found');
      return;
    }

    const isSingleLine = Object.keys(this._model.lines).length === 1;

    if (isSingleLine) {
      this._model.lines = {};
      this._view.lines = {};
      this._view.handles = new Map();

      View.removeElement(removingLineView.line);

      onRemove();

      return;
    }

    const isLastLine = this._view.getLastLineName() === name;

    if (isLastLine) {
      const handleData = this._view.findHandleDataByToLineName(name);
      const line = removingLineView.line;
      const prevLineName = handleData && handleData.previousLineName;
      const valueTo = removingLineModel.value;

      if (!prevLineName) {
        throw new Error('Unexpected behavior during remove last line');
      }

      this._view.lines[prevLineName].nextLineView = null;
      this._model.lines[prevLineName].value += valueTo;

      this._view.setLineWidth(prevLineName, Model.TOTAL);
      this._view.lines[prevLineName].onChange(this._model.lines[prevLineName].value, { auto: true });

      if (handleData) {
        View.removeElement(handleData.handle);
        this._view.removePreviousHandles(handleData.handle);
      }

      View.removeElement(line);

      delete this._model.lines[name];
      delete this._view.lines[name];

      onRemove();

      return;
    }

    // Generic case
    const handleData = this._view.findHandleDataByFromLineName(name);
    const nextLineName = handleData && handleData.nextLineName;
    const removingLineValue = removingLineModel.value;
    const line = removingLineView.line;

    if (!nextLineName) {
      throw new Error('Unexpected behavior during remove line');
    }

    this._model.lines[nextLineName].value += removingLineValue;
    this._view.lines[nextLineName].previousLineView = removingLineView.previousLineView;

    const isFirstLine = removingLineView.previousLineView === null;

    if (!isFirstLine) {
      if (removingLineView.previousLineView) {
        removingLineView.previousLineView.name = removingLineView.name;
      }
    }

    const updateHandles = () => {
      if (isLastLine) {
        return;
      }

      const leftHandleData = this._view.findHandleDataByToLineName(name);
      const rightHandleData = this._view.findHandleDataByFromLineName(name);

      if (leftHandleData && rightHandleData) {
        leftHandleData.nextLineName = rightHandleData.nextLineName;
      }
    }

    updateHandles();

    this._view.lines[nextLineName].onChange(this._model.lines[nextLineName].value);

    if (handleData) {
      this._view.removePreviousHandles(handleData.handle);
      View.removeElement(handleData.handle);
    }
    View.removeElement(line);

    delete this._model.lines[name];
    delete this._view.lines[name];

    onRemove();
  }

  private updateHandlePosition({ handle, name }: Omit<LineWithHandle, 'line'>) {
    const prevLineView = this._view.lines[name].previousLineView;
    handle.style.left = prevLineView && Math.round(this._view.getPercentOf(prevLineView.name)) + '%' || '1%';
  }
}
