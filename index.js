function Model() {
  this.items = {}
}

function Controller(model, view) {
  this._model = model;
  this._view = view;
}

function View(node) {
  this.node = node;
  this.slider = View.createSlider();
  this.lineIds = 0;
  this.node.appendChild(this.slider, this.node.nextSibling);
}

View.createSlider = function () {
  var slider = document.createElement('div');
  slider.classList.add('slider');
  slider.setAttribute('name', 'slider_' + ++Slider.ids);
  return slider;
}

function Slider(node) {
  if (!node) {
    throw new Error('Node is empty!');
  }

  this._model = new Model();
  this._view = new View(node);
  this._controller = new Controller(this._model, this._view);
}

Slider.ids = 0;
