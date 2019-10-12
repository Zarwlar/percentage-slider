function Controller(model, view) {
  this._model = model;
  this._view = view;
}

Controller.prototype.createSingleItem = function (key, value, onChange) {
  if (!key || key.trim() === '') {
    throw new Error('Key must be provided!');
  }

  var line = this._view.createLine(key, value);
  this._view.setLineWidth(line, value);
  this._view.items[key] = {
    name: key,
    line: line,
    onChange: onChange,
    _next: null,
    _previous: null,
  };

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
    line: line,
    handle: handle,
  }
}

Controller.prototype.recalculateItems = function (key) {

}
