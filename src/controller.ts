import Model, { IItemModel, IItemData } from './model';
import View, { IHandle, IItemView } from './view/view';

interface IItem {
  name: string;
  line: HTMLElement;
  handle: HTMLElement;
}

interface ISingleItem {
  line: HTMLElement;
  name: string;
  value: number;
}

type InternalOnChange = (ids: number, params: { auto: boolean }) => void;

type CreateItemsOutput = [ISingleItem, ...Array<IItem>]

export type CreatedItemParams = Required<Omit<IItemData, 'onChange'>> & { onChange: InternalOnChange }

export default class Controller {
  private _model: Model;
  private _view: View;

  public constructor(model: Model, view: View) {
    this._model = model;
    this._view = view;
    this.activateDragHandleListener();
  }

  public createSingleItem(params: CreatedItemParams): ISingleItem {
    const { name, value, onChange, color } = params;
    if (!name || name.trim() === '') {
      throw new Error('Name must be provided.');
    }

    const line = this._view.createLine(name, color);
    const itemView: IItemView = {
      name: name,
      line: line,
      onChange: onChange,
      _next: null,
      _previous: null,
    };

    const itemModel: IItemModel = {
      name: name,
      value: value,
    };

    this._view.items[name] = itemView;
    this._view.setLineWidth(name, value);

    this._model.items[name] = itemModel;

    onChange(value, { auto: value === Model.TOTAL });

    return {
      line,
      name: name,
      value: value,
    };
  }

  public createItem(params: CreatedItemParams): IItem {
    const { name, value, onChange, color } = params;
    const line = this._view.createLine(name, color);
    const namePrev = this._view.getLastItemName();

    this._model.items[name] = {
      name: name,
      value: value,
    };

    this._view.items[name] = {
      name: name,
      line: line,
      onChange: onChange,
      _previous: this._view.items[namePrev],
      _next: null,
    };

    this._view.items[namePrev]._next = this._view.items[name];

    const handle = this._view.createHandle();
    this._view.handles.push({
      handle: handle,
      previousName: namePrev,
      nextName: name,
    });

    return { name, line, handle };
  }

  public createItems(items: CreatedItemParams[]): CreateItemsOutput {
    const singleLineItem = this.createSingleItem(items[0]);
    const restItems = items.slice(1).map(item => this.createItem(item));

    return [singleLineItem, ...restItems];
  }

  public divideSliderIntoEqualParts(): void {
    const names = Object.keys(this._model.items);
    const amount = names.length;
    const diffs = this._model.getEqualParts(amount);

    names.forEach(function (this: Controller, name, index) {
      this._model.items[name].value = diffs[index];
      const onChange = this._view.items[name].onChange;
      onChange(diffs[index], { auto: true });

      const aggregate = diffs
        .slice(0, index + 1)
        .reduce(function (acc, curr) { return acc + curr }, 0);
      this._view.setLineWidth(name, aggregate);

    }, this);

    this._view.handles.forEach(function (this: Controller, handleData: IHandle) {
      const item = {
        handle: handleData.handle,
        name: handleData.nextName,
      };

      this.updateHandlePosition(item);
    }, this);

  }

  public addItemToSlider(value: number, item: IItem): void {
    const aggregation = Object.keys(this._model.items).reduce((acc, curr) => {
      return acc + this._model.items[curr].value;
    }, 0);

    this._view.setLineWidth(item.name, aggregation);
    this._view.appendItem(item.handle);
    this.updateHandlePosition(item);
    this._view.appendItem(item.line);

    this._view.items[item.name].onChange(value);
  }

  public addItemsToSlider(items: CreateItemsOutput): void {

    var singleLine = items[0];
    this._view.appendItem(singleLine.line);

    (items.slice(1) as IItem[]).forEach((item, index, arr) => {
      const itemName = item.name;
      const value = this._model.items[itemName].value;
      const prevName = arr[index - 1]?.name || singleLine.name;
      const prevLineWidth = this._view.getPercentOf(prevName);

      this._view.setLineWidth(item.name, value + prevLineWidth);
      this._view.appendItem(item.handle);
      this.updateHandlePosition(item);
      this._view.appendItem(item.line);

      this._view.items[itemName].onChange(value);
    });
  }

  public addItemToSliderAuto(item: IItem): void {
    this.divideSliderIntoEqualParts();
    this._view.appendItem(item.handle);
    this._view.appendItem(item.line);
  }

  public addItemToSliderGreedy(item: IItem): void {
    const emptySpace = Model.TOTAL - this._model.getSumOfItems();
    this._model.items[item.name].value = emptySpace;
    this._view.setLineWidth(item.name, Model.TOTAL);
    this._view.appendItem(item.handle);
    this.updateHandlePosition(item);
    this._view.appendItem(item.line);

    this._view.items[item.name].onChange(emptySpace, { auto: true });
  }

  public addItemToSliderBySplitLastItem(item: IItem): void {
    const prevItem = this._view.items[item.name]._previous;
    const prevItemValue = prevItem && this._model.items[prevItem.name].value || 0;

    const prevDividedInto2 = prevItemValue / 2;
    const newPrevItemValue = Math.floor(prevDividedInto2);
    const newItemValue = Math.ceil(prevDividedInto2);

    if (prevItem && prevItem.line) {
      prevItem.line.style.width = parseInt(prevItem.line.style.width || '0') - newItemValue + '%';
    }

    this._model.items[item.name].value = newItemValue;

    if (prevItem) {
      this._model.items[prevItem.name].value = newPrevItemValue;
    }

    this.addItemToSlider(newItemValue, item);

    this._view.items[item.name].onChange(newItemValue);
    prevItem && this._view.items[prevItem.name].onChange(newPrevItemValue);
  }

  public activateDragHandleListener(): void {
    const updateValues = (handle: HTMLElement, oldHandleLeft: number, newHandleLeft: number) => {
      const handleData = this._view.getHandleData(handle);

      const previousName = handleData.previousName;
      const nextName = handleData.nextName;

      // view
      this._view.setLineWidth(previousName, newHandleLeft);

      // model
      const diff = oldHandleLeft - newHandleLeft;
      this._model.items[previousName].value -= diff;
      this._model.items[nextName].value += diff;

      const fromOnChange = this._view.items[previousName].onChange;
      const toOnChange = this._view.items[nextName].onChange;

      fromOnChange(this._model.items[previousName].value);
      toOnChange(this._model.items[nextName].value);
    }

    this._view.makeHandleMoveable(updateValues);
  }

  public removeItem(name: string, onRemove: () => void): void {
    const removingItemModel = this._model.items[name];
    const removingItemView = this._view.items[name];

    if (!removingItemModel || !removingItemView) {
      console.warn('Item ' + name + ' not found');
      return;
    }

    const isSingleItem = Object.keys(this._model.items).length === 1;

    if (isSingleItem) {
      this._model.items = {};
      this._view.items = {};
      this._view.handles = [];

      View.removeElement(removingItemView.line);

      onRemove();

      return;
    }

    const isLastItem = this._view.getLastItemName() === name;

    if (isLastItem) {
      const handleData = this._view.findHandleDataByToLineName(name);
      const line = removingItemView.line;
      const prevItemName = handleData && handleData.previousName;
      const valueTo = removingItemModel.value;

      if (!prevItemName) {
        throw new Error('Unexpected behavior during remove last item');
      }

      this._view.items[prevItemName]._next = null;
      this._model.items[prevItemName].value += valueTo;

      this._view.setLineWidth(prevItemName, Model.TOTAL);
      this._view.items[prevItemName].onChange(this._model.items[prevItemName].value, { auto: true });

      if (handleData) {
        View.removeElement(handleData.handle);
        this._view.removePreviousHandles(handleData.handle);
      }

      View.removeElement(line);

      delete this._model.items[name];
      delete this._view.items[name];

      onRemove();

      return;
    }

    // Generic case
    const handleData = this._view.findHandleDataByFromLineName(name);
    const nextItemName = handleData && handleData.nextName;
    const removingItemValue = removingItemModel.value;
    const line = removingItemView.line;

    if (!nextItemName) {
      throw new Error('Unexpected behavior during remove item');
    }

    this._model.items[nextItemName].value += removingItemValue;
    this._view.items[nextItemName]._previous = removingItemView._previous;

    const isFirstItem = removingItemView._previous === null;

    if (!isFirstItem) {
      if (removingItemView._previous) {
        removingItemView._previous._next = removingItemView._next;
      }
    }

    const updateHandles = () => {
      if (isLastItem) {
        return;
      }

      const leftHandleData = this._view.findHandleDataByToLineName(name);
      const rightHandleData = this._view.findHandleDataByFromLineName(name);

      if (leftHandleData && rightHandleData) {
        leftHandleData.nextName = rightHandleData.nextName;
      }
    }

    updateHandles();

    this._view.items[nextItemName].onChange(this._model.items[nextItemName].value);

    if (handleData) {
      this._view.removePreviousHandles(handleData.handle);
      View.removeElement(handleData.handle);
    }
    View.removeElement(line);

    delete this._model.items[name];
    delete this._view.items[name];

    onRemove();
  }

  private updateHandlePosition(item: Omit<IItem, 'line'>) {
    const { handle } = item;
    const prevItem = this._view.items[item.name]._previous;

    handle.style.left = prevItem && Math.round(this._view.getPercentOf(prevItem.name)) + '%' || '1%';
  }
}
