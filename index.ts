import Model, { IItemData } from './mvc/model';
import View from './mvc/view';
import Controller from './mvc/controller';

interface IAddItemsOptions {
  force?: boolean;
}

export default class Slider {
  private _model: Model;
  private _view: View;
  private _controller: Controller;
  private _wasChanged = false;

  public constructor(node: HTMLElement | null) {
    if (!node) {
      throw new Error('Node is empty!');
    }

    this._model = new Model();
    this._view = new View(node);
    this._controller = new Controller(this._model, this._view);
  }

  public mkOnChange(onChange?: (value: number) => void): () => void {
    return ((value: number, options: { auto: boolean }) => {
      var auto = options && options.auto;
      var isNumber = typeof value === 'number' && !isNaN(value);

      this._wasChanged = auto ? this._wasChanged : true;

      onChange && isNumber && onChange(value);
    }).bind(this);
  }

  public mkOnRemove(onRemove: () => void): () => void {
    return (function () {
      onRemove && onRemove();
    }).bind(this);
  }

  public addItem(name: string, value: number, onChange: (value: number) => void): void {
    if (!this._model.isValidValue(value)) {
      throw new Error("Total can't be greater than " + this._model.total);
    }

    if (this._model.hasNoItems()) {
      const validValue = Number.parseInt(`${value}`, 10) || this._model.total;
      const item = this._controller.createSingleItem(name, validValue, this.mkOnChange(onChange));
      this._view.appendItem(item.line);

      if (!isNaN(value)) {
        this._wasChanged = true;
      }
      return;
    }

    const item = this._controller.createItem(name, value, this.mkOnChange(onChange));

    if (!isNaN(value)) {
      this._wasChanged = true;
      this._controller.addItemToSlider(value, item);
      return;
    }

    if (this._wasChanged) {
      const noSpaceLeft = this._model.getSumOfItems() === this._model.total;
      if (noSpaceLeft) {
        this._controller.addItemToSliderBySplitLastItem(item);
      } else {
        this._controller.addItemToSliderGreedy(item);
      }
      return;
    }

    this._controller.addItemToSliderAuto(item);
    return;
  }

  public addItems(itemsData: IItemData[], options?: IAddItemsOptions): void {

    const force = options && options.force;

    const someItemsAlreadyAdded = Object.keys(this._model.items).length !== 0;

    if (someItemsAlreadyAdded) {
      throw new Error("Items can not be added to already initialized slider");
    }

    const itemsDataSum = itemsData.reduce((acc, curr) => acc + (curr.value || 0), 0);

    if (itemsDataSum > this._model.total) {
      throw new Error(`Sum of items can not be great than ${this._model.total}`);
    }

    if (itemsData.length === 0) {
      throw new Error("Items length can not be equal 0");
    }

    let convertedItems = itemsData.map((itemData: IItemData) => {
      return {
        name: itemData.name,
        value: itemData.value,
        onChange: this.mkOnChange(itemData.onChange),
      };
    });

    if (force && itemsDataSum !== this._model.total) {
      this._model.makeSumEqualTotal(convertedItems, itemsDataSum);
    }

    var items = this._controller.createItems(convertedItems);

    this._controller.addItemsToSlider(items);
  }

  public removeItem(name: string, onRemove: () => void): void {
    this._controller.removeItem(name, this.mkOnRemove(onRemove));
  }
}
