import Model from './model';
import Controller, { CreatedItemParams, LineInitParams } from './controller';
import View from './view/view';

export type SuccessResult<T> =
  { success: true,
    payload?: T
  }

export type ErrorResult =
  { success: false;
    error: string;
  }

export type Result<T> = SuccessResult<T> | ErrorResult;

export default class PercentageSlider {
  public constructor(node: HTMLElement | null) {
    if (!node) {
      console.warn('Node is empty!');
      return;
    }

    this._model = new Model();
    this._view = new View(node);
    this._controller = new Controller(this._model, this._view);
  }

  public addItem(itemData: LineInitParams): Result<void> {
    const { value, onChange, name, color } = itemData;

    if (!this._model.isValidValue(value)) {
      return { success: false, error: 'Total can\'t be greater than ' + Model.TOTAL};
    }

    const hasNameAlreadyTaken = this._model.items[name];

    if (hasNameAlreadyTaken) {
      return { success: false, error: `The name '${name}' is already in use`};
    }

    if (this._model.hasNoItems()) {
      try {
        const validValue = parseInt(`${value}`, 10) || Model.TOTAL;
        const itemData = {
          name: name,
          value: validValue,
          onChange: this.mkOnChange(onChange),
          color: color || View.getRandomColor()
        }

        const item = this._controller.createSingleItem(itemData);

        this._view.appendItem(item.line);

        if (value && !isNaN(value)) {
          this._wasChanged = true;
        }
        return { success: true };
      } catch (e) {
        return { success: false, error: e }
      }
    }

    const itemParams = {
      name,
      value: (value || 0),
      onChange: this.mkOnChange(onChange),
      color: color || View.getRandomColor(),
    };

    const item = this._controller.createItem(itemParams);

    if (value && !isNaN(value)) {
      this._wasChanged = true;
      this._controller.addItemToSlider(value, item);
      return { success: true };
    }

    if (this._wasChanged) {
      const noSpaceLeft = this._model.getSumOfItems() === Model.TOTAL;
      if (noSpaceLeft) {
        this._controller.addItemToSliderBySplitLastItem(item);
      } else {
        this._controller.addItemToSliderGreedy(item);
      }

      return { success: true };
    }

    this._controller.addItemToSliderAuto(item);

    return { success: true };
  }

  public addItems(itemsData: LineInitParams[]): Result<void> {

    const someItemsAlreadyAdded = Object.keys(this._model.items).length !== 0;

    if (someItemsAlreadyAdded) {
      return { success: false,
               error: 'Items can not be added to already initialized slider'
             };
    }

    const itemsDataSum = itemsData.reduce((acc, curr) => acc + (curr.value || 0), 0);

    if (itemsDataSum > Model.TOTAL) {
      return { success: false,
               error: `Sum of items can not be great than ${Model.TOTAL}`
             };
    }

    if (itemsData.length === 0) {
      return { success: false, error: 'Items length can not be equal 0' };
    }

    let convertedItems: Array<CreatedItemParams> = itemsData.map((itemData: LineInitParams) => {
      return {
        ...itemData,
        color: itemData.color || View.getRandomColor(),
        value: (itemData.value || 0),
        onChange: this.mkOnChange(itemData.onChange),
      };
    });

    var items = this._controller.createItems(convertedItems);

    this._controller.addItemsToSlider(items);

    return { success: true };
  }

  public removeItem(name: string, onRemove?: () => void): void {
    this._controller.removeItem(name, this.mkOnRemove(onRemove));
  }

  private _model: Model;
  private _view: View;
  private _controller: Controller;
  private _wasChanged = false;

  private mkOnChange(onChange?: (value: number) => void): ((value: number, options: { auto: boolean } ) => void) {
    return ((value: number, options: { auto: boolean }) => {
      var auto = options && options.auto;

      this._wasChanged = auto ? this._wasChanged : true;

      onChange && onChange(value);

    }).bind(this);
  }

  private mkOnRemove(onRemove?: () => void): () => void {
    return (function () {
      onRemove && onRemove();
    }).bind(this);
  }
}

(window as any).PercentageSlider = PercentageSlider;
