function View(node) {
  this.node = node;
  this.slider = View.createSlider();
  this.lineIds = 0;
  this.items = {};
  this.handles = [];
  this.node.appendChild(this.slider, this.node.nextSibling);
}

View.prototype.createLine = function (name) {
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

View.prototype.getPercentOf = function (name) {
  var particularLineWidth = this.items[name].line.offsetWidth;
  return this.convertToPercent(particularLineWidth);
}

View.prototype.convertToPercent = function (value) {
  var totalPercent = this.slider.offsetWidth;
  return (value * 100) / totalPercent;
}

View.prototype.makeHandleMoveable = function (handle, updateValues) {
  var _this = this;

  handle.onmousedown = function (event) {
    event.preventDefault();

    var longestLineWidth = getComputedStyle(_this.slider.firstChild).width;
    var longestLinePercent = Math.round(_this.convertToPercent(Number.parseFloat(longestLineWidth)));

    isPartialFilledSlider = longestLinePercent !== 100;

    var shiftX = event.clientX - handle.getBoundingClientRect().left;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
      var newLeft = event.clientX - shiftX - _this.slider.getBoundingClientRect().left;

      considerLeftEdgeCase.call(_this);
      considerRightEdgeCase.call(_this);

      var newLeftInPercent = Math.round(_this.convertToPercent(newLeft));
      var oldLeftInPercent = Math.round(_this.convertToPercent(Number.parseFloat(getComputedStyle(handle).left)));

      handle.style.left = newLeftInPercent + '%';

      updateValues(oldLeftInPercent, newLeftInPercent);

      function considerLeftEdgeCase() {
        if (newLeft < 0) {
          newLeft = 0;
        }
      }

      function considerRightEdgeCase() {
        var rightEdgeSource = this.slider.offsetWidth;
        var offset = this.slider.getBoundingClientRect().left;
        newLeft += offset;

        if (isPartialFilledSlider) {
          var longestLine = this.slider.firstChild;
          rightEdgeSource = longestLine.offsetWidth;
          offset = longestLine.getBoundingClientRect().left;
        }

        newLeft -= offset;

        var rightEdge = rightEdgeSource;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
      }
    }

    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

  };

  handle.ondragstart = function () {
    return false;
  };
}
