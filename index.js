function Slider(node) {
  if (!node) {
    throw new Error('Node is empty!');
  }

  this._wasChanged = false;
  this._model = new Model();
  this._view = new View(node);
  this._controller = new Controller(this._model, this._view);
}

Slider.prototype.mkOnChange = function (onChange) {
  return (function (value) {
    this._wasChanged = true;
    onChange && onChange(value);
  }).bind(this);
}

Slider.prototype.addItem = function (name, value, onChange) {
  if (!this._model.isValidValue(value)) {
    throw new Error("Total can't be greater than " + this._model.total);
  }

  if (this._model.hasNoItems()) {
    var validValue = Number.parseInt(value, 10) || this._model.total;
    var item = this._controller.createSingleItem(name, validValue, this.mkOnChange(onChange));
    this._view.appendItem(item);

    if (!isNaN(value)) {
      this._wasChanged = true;
    }

    return;
  }

  var item = this._controller.createItem(name, value, this.mkOnChange(onChange));

  if (!isNaN(value)) {
    this._wasChanged = true;

    this._controller.addItemToSlider(value, item);
    return;
  }

  if (this._wasChanged) {
    var noSpaceLeft = this._model.getSumOfItems() === this._model.total;
    if (noSpaceLeft) {
      this._controller.addItemToSliderBySplitLastItem(item);
    } else {
      this._controller.addItemToSliderGreedy(item);
    }
    return;
  }

  this._controller.addItemToSliderAuto(item);
  return;

}
