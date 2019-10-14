import Model from './mvc/model';
import View from './mvc/view';
import Controller from './mvc/controller';

export default class Slider {
  private _model: Model;
  private _view: View;
  private _controller: Controller;
  private _wasChanged = false;

  public constructor(node: HTMLElement | null) {
    if (!node) {
      throw new Error('Node is empty!');
    }

    this._model = new Model();
    this._view = new View(node);
    this._controller = new Controller(this._model, this._view);
  }

  public mkOnChange(onChange) {
    return (function (value, options) {
      var auto = options && options.auto;
      var isNumber = typeof value === 'number' && !isNaN(value);
  
      this._wasChanged = auto ? this._wasChanged : true;
  
      onChange && isNumber && onChange(value);
    }).bind(this);
  }
  
  public mkOnRemove(onRemove: () => void) {
    return (function () {
      onRemove && onRemove();
    }).bind(this);
  }
  
  public addItem(name, value, onChange) {
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

  public removeItem(name, onRemove) {
    this._controller.removeItem(name, this.mkOnRemove(onRemove));
  }
}

