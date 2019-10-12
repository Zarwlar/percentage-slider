function Model() {
  this.items = {}
}

function Controller(model, view) {
  this._model = model;
  this._view = view;
}

Controller.prototype.addSingleItem = function (key, value, onChange) {
  var line = this._view.createLine(key, value);
  this._view.appendItem(line);
  this._view.setLineWidth(line, value);
  this._model.items[key] = {
    value: value,
    line: line,
    onChange: onChange,
    next: null,
    previous: null,
  };
}

function View(node) {
  this.node = node;
  this.slider = View.createSlider();
  this.lineIds = 0;
  this.node.appendChild(this.slider, this.node.nextSibling);
}

View.prototype.createLine = function (key, value, onChange) {
  var id = ++this.lineIds;
  var line = document.createElement('div');

  line.setAttribute('name', key);
  line.classList.add('line');
  line.classList.add('line_' + id);

  return line;
}

View.prototype.appendItem = function (item) {
  this.slider.appendChild(item);
}

View.prototype.setLineWidth = function (line, value) {
  line.style.width = value + '%';
}


View.ids = 0;
View.createSlider = function () {
  var slider = document.createElement('div');
  slider.classList.add('slider');
  slider.setAttribute('name', 'slider_' + ++View.ids);
  return slider;
}

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
    this._controller.addSingleItem(key, SINGLE_ITEM_VALUE);
  }

  if (!this.wasEdited) {
    // Создаём новый итем
    // Пересчитываем значения с учётом, что появляеться новый
    // Добавляем в слайдер
  }
}

// Slider.prototype.addItem = function (key, value, onChange, next, previous) {

// }
