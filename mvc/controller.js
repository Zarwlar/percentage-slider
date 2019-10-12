function Controller(model, view) {
  this._model = model;
  this._view = view;
}

Controller.prototype.createSingleItem = function (key, value, onChange) {
  if (!key || key.trim() === '') {
    throw new Error('Key must be provided!');
  }

  var line = this._view.createLine(key, value);
  this._view.items[key] = {
    name: key,
    line: line,
    onChange: onChange,
    _next: null,
    _previous: null,
  };

  this._view.setLineWidth(key, value);

  this._model.items[key] = {
    name: key,
    value: value,
  };

  return line;
}

Controller.prototype.createItem = function (key, value, onChange) {
  var line = this._view.createLine(key, value);

  var keysPrev = Object.keys(this._view.items).filter(function (item) {
    return this._view.items[item]._next === null;
  }, this);

  if (keysPrev.length !== 1) {
    throw new Error('Error when trying to find last item');
  }

  var keyPrev = keysPrev[0];

  this._model.items[key] = {
    name: key,
    value: value,
  };

  this._view.items[key] = {
    name: key,
    line: line,
    onChange: onChange,
    _previous: this._view[keyPrev],
    _next: null,
  };

  this._view.items[keyPrev]._next = this._view.items[key];

  var handle = this._view.createHandle();
  this._view.handles.push({ handle: handle, keyFrom: keyPrev, keyTo: key });

  return {
    key: key,
    line: line,
    handle: handle,
  }
}

Controller.prototype.divideSliderIntoEqualParts = function () {
  var keys = Object.keys(this._model.items);
  var amount = keys.length;
  var diffs = this._model.getEqualParts(amount);

  keys.forEach(function (key, index) {
    this._model.items[key].value = diffs[index];
    var aggregate = diffs
      .slice(0, index + 1)
      .reduce(function (acc, curr) { return acc + curr }, 0);
    this._view.setLineWidth(key, aggregate);
  }, this);
}

Controller.prototype.addItemToSlider = function (value, item) {
  var _this = this;
  var aggregation = Object.keys(this._model.items).reduce(function (acc, curr) {
    var current = _this._model.items[item.key] === curr;
    return current ? acc : acc + _this._model.items[curr].value;
  }, 0);

  this._view.setLineWidth(item.key, aggregation);
  this._view.appendItem(item.handle);
  this._view.appendItem(item.line);
}

Controller.prototype.addItemToSliderAuto = function (item) {
  this.divideSliderIntoEqualParts();
  this._view.appendItem(item.handle);
  this._view.appendItem(item.line);
}
