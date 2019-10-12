function Slider(node) {
  if (!node) {
    throw new Error('Node is empty!');
  }

  this._wasChanged = false;
  this._model = new Model();
  this._view = new View(node);
  this._controller = new Controller(this._model, this._view);
}

Slider.prototype.addItem = function (name, value, onChange) {
  if (!this._model.isValidValue(value)) {
    throw new Error("Total can't be greater than " + this._model.total);
  }

  var isEmptySlider = Object.keys(this._model.items).length === 0;
  if (isEmptySlider) {
    var _value = Number.parseInt(value, 10) || this._model.total;
    var item = this._controller.createSingleItem(name, _value, onChange);
    this._view.appendItem(item);
    return;
  }

  var item = this._controller.createItem(name, value);

  if (!isNaN(value)) {
    this._wasChanged = true;
    this._controller.addItemToSlider(value, item);
    return;
  }

  if (this._wasChanged) {
    var isNoSpaceLeft = this._model.getSumOfItems() === this._model.total;
    if (isNoSpaceLeft) {
      this._controller.addItemToSliderBySplitLastItem(item);
    } else {
      this._controller.addItemToSliderGreedy(item);
    }
    return;
  }

  this._controller.addItemToSliderAuto(item);
  return;

}
