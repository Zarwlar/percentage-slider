function Controller(model, view) {
  this._model = model;
  this._view = view;
}

Controller.prototype.createSingleItem = function (key, value, onChange) {
  var line = this._view.createLine(key, value);
  this._view.setLineWidth(line, value);
  this._model.items[key] = {
    value: value,
    line: line,
    onChange: onChange,
    next: null,
    previous: null,
  };
  return line;
}
