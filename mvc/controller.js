function Controller(model, view) {
  this._model = model;
  this._view = view;
}

Controller.prototype.createSingleItem = function (name, value, onChange) {
  if (!name || name.trim() === '') {
    throw new Error('Name must be provided!');
  }

  var line = this._view.createLine(name);
  var nValue = Number(value);

  this._view.items[name] = {
    name: name,
    line: line,
    onChange: onChange,
    _next: null,
    _previous: null,
  };

  this._view.setLineWidth(name, nValue);

  this._model.items[name] = {
    name: name,
    value: nValue,
  };

  onChange(nValue, { auto: nValue === this._model.total });

  return {
    line,
    name: name,
    value: nValue,
  };
}

Controller.prototype.createItem = function (name, value, onChange) {
  var line = this._view.createLine(name);
  var namePrev = this._view.getLastItemName();

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

  var handle = this._view.createHandle();
  this._view.handles.push({ handle: handle, nameFrom: namePrev, nameTo: name });

  return {
    name: name,
    line: line,
    handle: handle,
  }
}

Controller.prototype.createItems = function (items) {
  if (items.length === 1) {
    return this.createSingleItem(items[0]);
  }

  var firstItemData = items[0];
  var singleLineItem = this.createSingleItem(firstItemData.name, firstItemData.value, firstItemData.onChange);
  var restItems = items.slice(1).map(function (itemData) {
    return this.createItem(itemData.name, itemData.value, itemData.onChange);
  }, this);

  return [singleLineItem].concat(restItems);
}

Controller.prototype.divideSliderIntoEqualParts = function () {
  var names = Object.keys(this._model.items);
  var amount = names.length;
  var diffs = this._model.getEqualParts(amount);

  names.forEach(function (name, index) {
    this._model.items[name].value = diffs[index];
    var onChange = this._view.items[name].onChange;
    onChange(diffs[index], { auto: true });

    var aggregate = diffs
      .slice(0, index + 1)
      .reduce(function (acc, curr) { return acc + curr }, 0);
    this._view.setLineWidth(name, aggregate);

  }, this);

  this._view.handles.forEach(function (handleData) {
    var item = {
      handle: handleData.handle,
      name: handleData.nameTo,
    };

    this.bindHandle(item);
  }, this);

}

Controller.prototype.addItemToSlider = function (value, item) {
  var _this = this;
  var aggregation = Object.keys(this._model.items).reduce(function (acc, curr) {
    return acc + _this._model.items[curr].value;
  }, 0);

  this._view.setLineWidth(item.name, aggregation);
  this._view.appendItem(item.handle);
  this.bindHandle(item);
  this._view.appendItem(item.line);

  this._view.items[item.name].onChange(value);
}

Controller.prototype.addItemToSliderAuto = function (item) {
  this.divideSliderIntoEqualParts();
  this._view.appendItem(item.handle);
  this._view.appendItem(item.line);
}

Controller.prototype.addItemToSliderGreedy = function (item) {
  var emptySpace = this._model.total - this._model.getSumOfItems();
  this._model.items[item.name].value = emptySpace;
  this._view.setLineWidth(item.name, this._model.total);
  this._view.appendItem(item.handle);
  this.bindHandle(item);
  this._view.appendItem(item.line);

  this._view.items[item.name].onChange(emptySpace, { auto: true });
}

Controller.prototype.addItemToSliderBySplitLastItem = function (item) {
  var prevItem = this._view.items[item.name]._previous;
  var prevItemValue = this._model.items[prevItem.name].value;

  var prevDividedInto2 = prevItemValue / 2;
  var newPrevItemValue = Math.floor(prevDividedInto2);
  var newItemValue = Math.ceil(prevDividedInto2);

  prevItem.line.style.width = Number.parseInt(prevItem.line.style.width) - newItemValue + '%';

  this._model.items[item.name].value = newItemValue;
  this._model.items[prevItem.name].value = newPrevItemValue;
  this.addItemToSlider(newItemValue, item);

  this._view.items[item.name].onChange(newItemValue);
  this._view.items[prevItem.name].onChange(newPrevItemValue);
}

Controller.prototype.bindHandle = function (item) {
  var handle = item.handle;
  var prevItem = this._view.items[item.name]._previous;

  handle.style.left = Math.round(this._view.getPercentOf(prevItem.name)) + '%';
  this._view.makeHandleMoveable(handle, updateValues.bind(this));

  function updateValues(oldHandleLeft, newHandleLeft) {
    var handleDataIndex = this._view.handles.findIndex(function (handleData) {
      return handleData.handle === handle;
    });

    if (handleDataIndex === -1) {
      throw new Error("Can't find handle");
    }

    var handleData = this._view.handles[handleDataIndex];

    var nameFrom = handleData.nameFrom;
    var nameTo = handleData.nameTo;

    // view
    this._view.setLineWidth(nameFrom, newHandleLeft);

    // model
    diff = oldHandleLeft - newHandleLeft;
    this._model.items[nameFrom].value -= diff;
    this._model.items[nameTo].value += diff;

    var fromOnChange = this._view.items[nameFrom].onChange;
    var toOnChange = this._view.items[nameTo].onChange;

    fromOnChange(this._model.items[nameFrom].value);
    toOnChange(this._model.items[nameTo].value);
  }
}

Controller.prototype.removeItem = function (name, onRemove) {
  var removingItemModel = this._model.items[name];
  var removingItemView = this._view.items[name];

  if (!removingItemModel || !removingItemView) {
    console.warn('Item ' + name + ' not found');
    return;
  }

  var isSingleItem = Object.keys(this._model.items).length === 1;

  if (isSingleItem) {

    this._model.items = {};
    var line = removingItemView.line;
    View.removeElement(line);

    onRemove();

    return;
  }

  var isLastItem = this._view.getLastItemName() === name;

  if (isLastItem) {
    var handleData = this._view.findHandleDataByToLineName(name);
    var line = removingItemView.line;
    var prevItemName = handleData.nameFrom;
    var valueTo = removingItemModel.value;

    this._view.items[prevItemName]._next = null;
    this._model.items[prevItemName].value += valueTo;

    this._view.setLineWidth(prevItemName, this._model.total);
    this._view.items[prevItemName].onChange(this._model.items[prevItemName].value);
    View.removeElement(handleData.handle);
    View.removeElement(line);

    this._view.removeFromHandles(handleData);

    delete this._model.items[name];
    delete this._view.items[name];

    onRemove();

    return;
  }

  // Generic case
  var handleData = this._view.findHandleDataByFromLineName(name);
  var nextItemName = handleData.nameTo;
  var removingItemValue = removingItemModel.value;
  var line = removingItemView.line;

  this._model.items[nextItemName].value += removingItemValue;

  this._view.items[nextItemName]._previous = removingItemView._previous;

  var isFirstItem = removingItemView._previous === null;

  if (!isFirstItem) {
    removingItemView._previous._next = removingItemView._next;
  }

  updateHandles.call(this);

  this._view.items[nextItemName].onChange(this._model.items[nextItemName].value);
  this._view.removeFromHandles(handleData);

  View.removeElement(handleData.handle);
  View.removeElement(line);

  delete this._model.items[name];
  delete this._view.items[name];

  onRemove();

  function updateHandles() {
    var isLastItem = this._view.getLastItemName() === name;
    if (isLastItem) {
      return;
    }

    var leftHandleData = this._view.findHandleDataByToLineName(name);
    var rightHandleData = this._view.findHandleDataByFromLineName(name);

    if (leftHandleData) {
      leftHandleData.nameTo = rightHandleData.nameTo;
    }
  }
}

Controller.prototype.addItemsToSlider = function (items) {
  var singleLine = items[0];
  this._view.appendItem(singleLine.line);

  items.slice(1).forEach(function (item) {
    var itemName = item.name;
    debugger;
    this.addItemToSlider(this._model.items[itemName].value, item);
  }, this)
}
