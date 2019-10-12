function Slider(node) {
  if (!node) {
    throw new Error('Node is empty!');
  }

  this._model = new Model();
  this._view = new View(node);
  this._controller = new Controller(this._model, this._view);
}

Slider.prototype.addItem = function (key, value, onChange) {
  var isEmptySlider = Object.keys(this._model.items).length === 0;

  if (isEmptySlider) {
    var _value = Number.parseInt(value, 10) || this._model.total;
    var item = this._controller.createSingleItem(key, _value, onChange);
    this._view.appendItem(item);
    return;
  }

  var item = this._controller.createItem(key, value);
  this._controller.divideIntoEqualParts();
  this._view.appendItem(item.handle);
  this._view.appendItem(item.line);
}
