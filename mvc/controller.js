function Controller(model, view) {
  this._model = model;
  this._view = view;
}

Controller.prototype.createSingleItem = function (name, value, onChange) {
  if (!name || name.trim() === '') {
    throw new Error('Name must be provided!');
  }

  var line = this._view.createLine(name);
  this._view.items[name] = {
    name: name,
    line: line,
    onChange: onChange,
    _next: null,
    _previous: null,
  };

  this._view.setLineWidth(name, value);

  this._model.items[name] = {
    name: name,
    value: value,
  };

  var nValue = Number(value);
  onChange && !isNaN(nValue) && onChange(nValue);

  return line;
}

Controller.prototype.createItem = function (name, value, onChange) {
  var line = this._view.createLine(name);
  var namePrev = this._view.getLastItem();

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

  var nValue = Number(value);
  onChange && !isNaN(nValue) && onChange(nValue);

  return {
    name: name,
    line: line,
    handle: handle,
  }
}

Controller.prototype.divideSliderIntoEqualParts = function () {
  var names = Object.keys(this._model.items);
  var amount = names.length;
  var diffs = this._model.getEqualParts(amount);

  names.forEach(function (name, index) {
    this._model.items[name].value = diffs[index];
    var onChange = this._view.items[name].onChange;
    onChange && onChange(diffs[index]);

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

  var onChange = this._view.items[item.name].onChange;
  onChange(emptySpace);
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

  var onChange = this._view.items[item.name].onChange;
  onChange(newItemValue);
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

    fromOnChange && fromOnChange(this._model.items[nameFrom].value);
    toOnChange && toOnChange(this._model.items[nameTo].value);
  }
}
