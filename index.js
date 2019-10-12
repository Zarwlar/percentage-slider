function Slider(node) {
  if (!node) {
    throw new Error('Node is empty!');
  }

  this.wasChanged = false;
  this._model = new Model();
  this._view = new View(node);
  this._controller = new Controller(this._model, this._view);
}

Slider.prototype.addItem = function (key, value, onChange) {
  ;
  var isEmptySlider = Object.keys(this._model.items).length === 0;

  if (onChange) {
    onChange.wasChanged = this.wasChanged;
  }

  if (isEmptySlider) {
    var SINGLE_ITEM_VALUE = 100;
    var _value = Number.parseInt(value, 10) || SINGLE_ITEM_VALUE;
    var item = this._controller.createSingleItem(key, _value, onChange);
    this._view.appendItem(item);
    return;
  }

  if (!this.wasChanged) {
    var item = this._controller.createItem(key, value);
    this._controller.recalculateItems();
    // this.bindHandleWithLines();
    this._view.appendItem(item.handle);
    this._view.appendItem(item.line);
  }
}
