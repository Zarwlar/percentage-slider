function Controller(model, view) {
  this._model = model;
  this._view = view;
}

Controller.prototype.createSingleItem = function (name, value, onChange) {
  if (!name || name.trim() === '') {
    throw new Error('Name must be provided!');
  }

  var line = this._view.createLine(name, value);
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

  return line;
}

Controller.prototype.createItem = function (name, value, onChange) {
  var line = this._view.createLine(name, value);
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
}

Controller.prototype.addItemToSliderBySplitLastItem = function (item) {
  var prevItem = this._view.items[item.name]._previous;
  var prevItemValue = this._model.items[prevItem.name].value;

  var newPrevItemValue = Math.floor(prevItemValue / 2);
  var newItemValue = Math.ceil(prevItemValue / 2);

  prevItem.line.style.width = Number.parseInt(prevItem.line.style.width) - newItemValue + '%';

  this._model.items[item.name].value = newItemValue;
  this._model.items[prevItem.name].value = newPrevItemValue;
  this.addItemToSlider(newItemValue, item);
}

Controller.prototype.bindHandle = function (item) {
  var handle = item.handle;
  var prevItem = this._view.items[item.name]._previous;

  handle.style.left = Math.round(this._view.getPercentOf(prevItem.name)) + '%';
  this._view.makeHandleMoveable(handle);
}
