function View(node) {
  this.node = node;
  this.slider = View.createSlider();
  this.lineIds = 0;
  this.items = {};
  this.handles = [];
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

View.prototype.createHandle = function () {
  var handle = document.createElement('div');

  handle.classList.add('handle');

  return handle;
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
