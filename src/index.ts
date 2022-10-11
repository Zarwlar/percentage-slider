import Model from './model';
import Controller, {
  InternalLineInitParams,
  LineInitParams,
} from './controller';
import View from './view/view';

export type SuccessResult<T> = { success: true; payload?: T };

export type ErrorResult = { success: false; error: string };

export type Result<T> = SuccessResult<T> | ErrorResult;

export default class PercentageSlider {
  public constructor(node: HTMLElement | null) {
    if (!node) {
      console.warn('Node is empty!');
      return;
    }

    this.model = new Model();
    this.view = new View(node);
    this.controller = new Controller(this.model, this.view);
  }

  public addLine({
    value,
    onChange,
    name,
    color,
  }: LineInitParams): Result<void> {
    if (!this.model.isValidValue(value)) {
      return {
        success: false,
        error: "Total can't be greater than " + Model.TOTAL + '.',
      };
    }

    const hasNameAlreadyTaken = this.model.lines[name];

    if (!name || name.trim().length === 0) {
      return { success: false, error: `The name can't be empty.` };
    }

    if (hasNameAlreadyTaken) {
      return { success: false, error: `The name '${name}' is already in use.` };
    }

    if (this.model.hasNoLines()) {
      try {
        const validValue = parseInt(`${value}`, 10) || Model.TOTAL;
        const lineParams = {
          name: name,
          value: validValue,
          onChange: this.mkOnChange(onChange),
          color: color || View.getRandomColor(),
        };

        const lineData = this.controller.createSingleLine(lineParams);

        this.view.appendElement(lineData.line);

        if (value && !isNaN(value)) {
          this._wasChanged = true;
        }
        return { success: true };
      } catch (e) {
        return { success: false, error: e };
      }
    }

    const lineParams = {
      name,
      value: value || 0,
      onChange: this.mkOnChange(onChange),
      color: color || View.getRandomColor(),
    };

    const lwh = this.controller.createLineWithHandle(lineParams);

    if (value && !isNaN(value)) {
      this._wasChanged = true;
      this.controller.addLineWithHandleToSlider(value, lwh);
      return { success: true };
    }

    if (this._wasChanged) {
      const noSpaceLeft = this.model.getSumOfLines() === Model.TOTAL;
      if (noSpaceLeft) {
        this.controller.addLineWithHandleToSliderBySplitLastLine(lwh);
      } else {
        this.controller.addLineWithHandleToSliderGreedy(lwh);
      }

      return { success: true };
    }

    this.controller.addLineWithHandleToSliderAuto(lwh);

    return { success: true };
  }

  public addLines(lines: LineInitParams[]): Result<void> {
    const someLinesAlreadyAdded = Object.keys(this.model.lines).length !== 0;

    if (someLinesAlreadyAdded) {
      return {
        success: false,
        error:
          'Lines can not be added to already initialized slider. Instead, you can add lines one at a time.',
      };
    }

    const linesDataSum = lines.reduce(
      (acc, curr) => acc + (curr.value || 0),
      0
    );

    if (linesDataSum > Model.TOTAL) {
      return {
        success: false,
        error: `Sum of lines can not be greater than ${Model.TOTAL}.`,
      };
    }

    if (lines.length === 0) {
      return {
        success: false,
        error: 'Cannot initialize strips with an empty array.',
      };
    }

    let internalLineInitParams: Array<InternalLineInitParams> = lines.map(
      (line: LineInitParams) => {
        return {
          ...line,
          color: line.color || View.getRandomColor(),
          value: line.value || 0,
          onChange: this.mkOnChange(line.onChange),
        };
      }
    );

    var internalLines = this.controller.createLines(internalLineInitParams);

    this.controller.addLinesToSlider(internalLines);

    return { success: true };
  }

  public removeLine(name: string, onRemove?: () => void): void {
    this.controller.removeLine(name, this.mkOnRemove(onRemove));
  }

  private model: Model;
  private view: View;
  private controller: Controller;
  private _wasChanged = false;

  private mkOnChange(
    onChange?: (value: number) => void
  ): (value: number, options: { auto: boolean }) => void {
    return ((value: number, options: { auto: boolean }) => {
      var auto = options && options.auto;

      this._wasChanged = auto ? this._wasChanged : true;

      onChange && onChange(value);
    }).bind(this);
  }

  private mkOnRemove(onRemove?: () => void): () => void {
    return function () {
      onRemove && onRemove();
    }.bind(this);
  }
}

declare global {
  interface Window {
    PercentageSlider: ThisType<PercentageSlider>;
  }
}

window.PercentageSlider = PercentageSlider;
