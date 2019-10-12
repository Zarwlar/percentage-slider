function Slider(node) {
  if (!node) {
    throw new Error('Node is empty!');
  }

  this.wasEdited = false;
  this._model = new Model();
  this._view = new View(node);
  this._controller = new Controller(this._model, this._view);
}

Slider.prototype.addItem = function (key, value, onChange) {
  var isEmptySlider = Object.keys(this._model.items).length === 0;
  this.wasEdited = typeof value === 'number';

  if (isEmptySlider) {
    var SINGLE_ITEM_VALUE = 100;
    var item = this._controller.createSingleItem(key, SINGLE_ITEM_VALUE);
    this._view.appendItem(item);
  }

  if (!this.wasEdited) {
    var item = this._controller.createItem(key, value);
    this._controller.recalculateItems();
    this._view.appendItem(item)
  }
}
