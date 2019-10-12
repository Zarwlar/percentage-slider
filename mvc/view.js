function View(node) {
  this.node = node;
  this.slider = View.createSlider();
  this.lineIds = 0;
  this.items = {};
  this.handles = [];
  this.node.appendChild(this.slider, this.node.nextSibling);
}

View.prototype.createLine = function (name, value, onChange) {
  var id = ++this.lineIds;
  var line = document.createElement('div');

  line.setAttribute('name', name);
  line.classList.add('line');
  line.classList.add('line_' + id);

  return line;
}

View.prototype.createHandle = function () {
  var handle = document.createElement('div');

  handle.classList.add('handle');

  return handle;
}

View.prototype.fromPercentToPixels = function (percent) {
  var pixelPerPercent = this.slider.offsetWidth / 100;
  return pixelPerPercent * percent;
}

View.prototype.getLastItem = function () {
  var namesPrev = Object.keys(this.items).filter(function (item) {
    return this.items[item]._next === null;
  }, this);

  if (namesPrev.length !== 1) {
    throw new Error('Error when trying to find last item');
  }

  return namesPrev[0];
}

View.prototype.appendItem = function (item) {
  this.slider.insertBefore(item, this.slider.firstChild);
}

View.prototype.setLineWidth = function (name, value) {
  this.items[name].line.style.width = value + '%';
}

View.ids = 0;
View.createSlider = function () {
  var slider = document.createElement('div');
  slider.classList.add('slider');
  slider.setAttribute('name', 'slider_' + ++View.ids);
  return slider;
}
