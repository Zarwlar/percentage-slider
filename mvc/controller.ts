import Model, { IItemModel, IItemData } from './model';
import View, { IItemView } from './View/view';

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

type TOnChange = (ids: number, params: { auto: boolean }) => void;

export default class Controller {
  private _model: Model;
  private _view: View;

  public constructor(model: Model, view: View) {
    this._model = model;
    this._view = view;
  }

  public createSingleItem(name: string, value: number, onChange: TOnChange, color: string): ISingleItem {
    if (!name || name.trim() === '') {
      throw new Error('Name must be provided!');
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

    onChange(value, { auto: value === this._model.total });

    return {
      line,
      name: name,
      value: value,
    };
  }

  public createItem(name: string, value: number, onChange: TOnChange, color: string): IItem {
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
      nameFrom: namePrev,
      nameTo: name,
    });

    return { name, line, handle };
  }

  public createItems = function (items: IItemData[]): IItem | IItem[] {
    if (items.length === 1) {
      return this.createSingleItem(items[0].name, items[0].value, items[0].onChange, items[0].color);
    }

    const firstItemData = items[0];
    const singleLineItem = this.createSingleItem(firstItemData.name, firstItemData.value, firstItemData.onChange, firstItemData.color);
    const restItems = items.slice(1).map(function (itemData) {
      return this.createItem(itemData.name, itemData.value, itemData.onChange, itemData.color);
    }, this);

    return [singleLineItem].concat(restItems);
  }

  public divideSliderIntoEqualParts(): void {
    const names = Object.keys(this._model.items);
    const amount = names.length;
    const diffs = this._model.getEqualParts(amount);

    names.forEach(function (name, index) {
      this._model.items[name].value = diffs[index];
      const onChange = this._view.items[name].onChange;
      onChange(diffs[index], { auto: true });

      const aggregate = diffs
        .slice(0, index + 1)
        .reduce(function (acc, curr) { return acc + curr }, 0);
      this._view.setLineWidth(name, aggregate);

    }, this);

    this._view.handles.forEach(function (handleData) {
      const item = {
        handle: handleData.handle,
        name: handleData.nameTo,
      };

      this.bindHandle(item);
    }, this);

  }

  public addItemToSlider(value: number, item: IItem): void {
    const aggregation = Object.keys(this._model.items).reduce((acc, curr) => {
      return acc + this._model.items[curr].value;
    }, 0);

    this._view.setLineWidth(item.name, aggregation);
    this._view.appendItem(item.handle);
    this.bindHandle(item);
    this._view.appendItem(item.line);

    this._view.items[item.name].onChange(value);
  }

  public addItemsToSlider(items: IItem | IItem[]): void {

    if (!Array.isArray(items)) {
      this._view.appendItem(items.line);
      return;
    }

    var singleLine = items[0];
    this._view.appendItem(singleLine.line);

    items.forEach((item, index, arr) => {
      const isSingleLine = index === 0;
      if (isSingleLine) {
        return;
      }

      const itemName = item.name;
      const value = this._model.items[itemName].value;
      const prevName = arr[index - 1].name;
      const prevLineWidth = this._view.getPercentOf(prevName);

      this._view.setLineWidth(item.name, value + prevLineWidth);
      this._view.appendItem(item.handle);
      this.bindHandle(item);
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
    const emptySpace = this._model.total - this._model.getSumOfItems();
    this._model.items[item.name].value = emptySpace;
    this._view.setLineWidth(item.name, this._model.total);
    this._view.appendItem(item.handle);
    this.bindHandle(item);
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

  public bindHandle(item: IItem): void {
    const handle = item.handle;
    const prevItem = this._view.items[item.name]._previous;

    handle.style.left = prevItem && Math.round(this._view.getPercentOf(prevItem.name)) + '%' || '1%';

    const updateValues = (oldHandleLeft: number, newHandleLeft: number) => {
      const handleDataIndex = this._view.handles.findIndex(function (handleData) {
        return handleData.handle === handle;
      });

      if (handleDataIndex === -1) {
        throw new Error("Can't find handle");
      }

      const handleData = this._view.handles[handleDataIndex];

      const nameFrom = handleData.nameFrom;
      const nameTo = handleData.nameTo;

      // view
      this._view.setLineWidth(nameFrom, newHandleLeft);

      // model
      const diff = oldHandleLeft - newHandleLeft;
      this._model.items[nameFrom].value -= diff;
      this._model.items[nameTo].value += diff;

      const fromOnChange = this._view.items[nameFrom].onChange;
      const toOnChange = this._view.items[nameTo].onChange;

      fromOnChange(this._model.items[nameFrom].value);
      toOnChange(this._model.items[nameTo].value);
    }

    this._view.makeHandleMoveable(handle, updateValues);
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
      const prevItemName = handleData && handleData.nameFrom;
      const valueTo = removingItemModel.value;

      if (!prevItemName) {
        throw new Error('Unexpected behavior during remove last item');
      }

      this._view.items[prevItemName]._next = null;
      this._model.items[prevItemName].value += valueTo;

      this._view.setLineWidth(prevItemName, this._model.total);
      this._view.items[prevItemName].onChange(this._model.items[prevItemName].value, { auto: true });

      if (handleData) {
        View.removeElement(handleData.handle);
        this._view.removeFromHandles(handleData.handle);
      }

      View.removeElement(line);

      delete this._model.items[name];
      delete this._view.items[name];

      onRemove();

      return;
    }

    // Generic case
    const handleData = this._view.findHandleDataByFromLineName(name);
    const nextItemName = handleData && handleData.nameTo;
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
        leftHandleData.nameTo = rightHandleData.nameTo;
      }
    }

    updateHandles();

    this._view.items[nextItemName].onChange(this._model.items[nextItemName].value);

    if (handleData) {
      this._view.removeFromHandles(handleData.handle);
      View.removeElement(handleData.handle);
    }
    View.removeElement(line);

    delete this._model.items[name];
    delete this._view.items[name];

    onRemove();

  }
}
