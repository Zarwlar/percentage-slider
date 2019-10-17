import Model, { IItemData } from './mvc/model';
import View from './mvc/View/view';
import Controller from './mvc/controller';
import MakeMoveable, { IMakeHandleMovable } from './mvc/View/makeMoveable';
import './percentage-slider.css';

interface IAddItemsOptions {
  force?: boolean;
}

export type TOnChange = (ids: number, params?: { auto: boolean }) => void;

export default class PercentageSlider {
  private _model: Model;
  private _view: View;
  private _controller: Controller;
  private _makeMoveable: IMakeHandleMovable;
  private _wasChanged = false;

  public constructor(node: HTMLElement | null) {
    if (!node) {
      throw new Error('Node is empty!');
    }

    this._model = new Model();
    this._makeMoveable = new MakeMoveable();
    this._view = new View(node, this._makeMoveable);
    this._makeMoveable.view = this._view;
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

  public mkOnRemove(onRemove?: () => void): () => void {
    return (function () {
      onRemove && onRemove();
    }).bind(this);
  }

  public addItem(itemData: IItemData): void {
    const { value, onChange, name, color } = itemData;

    if (!this._model.isValidValue(value)) {
      throw new Error("Total can't be greater than " + this._model.total);
    }

    const hasNameAlreadyTaken = this._model.items[name];

    if (hasNameAlreadyTaken) {
      throw new Error(`Name '${name}' has already taken`);
    }

    if (this._model.hasNoItems()) {
      const validValue = parseInt(`${value}`, 10) || this._model.total;
      const item = this._controller.createSingleItem(name, validValue, this.mkOnChange(onChange), color || View.getRandomColor());
      this._view.appendItem(item.line);

      if (value && !isNaN(value)) {
        this._wasChanged = true;
      }
      return;
    }

    const item = this._controller.createItem(name, (value || 0), this.mkOnChange(onChange), color || View.getRandomColor());

    if (value && !isNaN(value)) {
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
        ...itemData,
        onChange: this.mkOnChange(itemData.onChange),
      };
    });

    if (force && itemsDataSum !== this._model.total) {
      this._model.makeSumEqualTotal(convertedItems, itemsDataSum);
    }

    var items = this._controller.createItems(convertedItems);

    this._controller.addItemsToSlider(items);
  }

  public removeItem(name: string, onRemove?: () => void): void {
    this._controller.removeItem(name, this.mkOnRemove(onRemove));
  }
}

(window as any).PercentageSlider = PercentageSlider;
