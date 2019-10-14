function View(node) {
  this.node = node;
  this.slider = View.createSlider();
  this.lineIds = 0;
  this.items = {};
  this.handles = [];
  this.node.appendChild(this.slider, this.node.nextSibling);
}

View.ids = 0;
View.createSlider = function () {
  var slider = document.createElement('div');
  slider.classList.add('slider');
  slider.setAttribute('name', 'slider_' + ++View.ids);
  return slider;
}

View.removeElement = function (item) {
  item.parentNode.removeChild(item);
}

View.prototype.removeFromHandles = function (handleData) {
  this.handles = this.handles.filter(function (_handleData) {
    return _handleData !== handleData;
  });
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

View.prototype.appendItem = function (item) {
  this.slider.insertBefore(item, this.slider.firstChild);
}

View.prototype.setLineWidth = function (name, value) {
  this.items[name].line.style.width = value + '%';
}

View.prototype.getLastItemName = function () {
  var namesPrev = Object.keys(this.items).filter(function (item) {
    return this.items[item]._next === null;
  }, this);

  if (namesPrev.length !== 1) {
    throw new Error('Error when trying to find last item');
  }

  return namesPrev[0];
}

View.prototype.getHandleData = function (handle) {
  var handleIndex = this.handles.findIndex(function (handleData) {
    return handleData.handle === handle;
  });

  if (handleIndex === -1) {
    throw new Error('Error when trying to find handle');
  }

  return this.handles[handleIndex];
}

View.prototype.getPercentOf = function (name) {
  var particularLineWidth = this.items[name].line.offsetWidth;
  return this.convertToPercent(particularLineWidth);
}

View.prototype.convertToPercent = function (value) {
  var totalPercent = this.slider.offsetWidth;
  return (value * 100) / totalPercent;
}

View.prototype.findHandleDataByToLineName = function (name) {
  var handleIndex = this.handles.findIndex(function (handle) {
    return handle.nameTo === name;
  });

  return handleIndex === -1 ? null : this.handles[handleIndex];
}

View.prototype.findHandleDataByFromLineName = function (name) {
  var handleIndex = this.handles.findIndex(function (handle) {
    return handle.nameFrom === name;
  });

  return handleIndex === -1 ? null : this.handles[handleIndex];
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
        var nameFrom = this.getHandleData.call(this, handle).nameFrom;
        var prevHandleData = this.findHandleDataByToLineName.call(this, nameFrom);
        var isFirstHandle = prevHandleData === null;

        if (!isFirstHandle) {
          var prevHandle = prevHandleData.handle;
          var prevHandleLeft = Number.parseFloat(getComputedStyle(prevHandle).left);

          if (newLeft < prevHandleLeft) {
            newLeft = prevHandleLeft;
            return;
          }
        }

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

        var nameTo = this.getHandleData.call(this, handle).nameTo;
        var nextHandleData = this.findHandleDataByFromLineName.call(this, nameTo);
        var isLastLine = nextHandleData === null;

        if (!isLastLine) {
          var nextHandle = nextHandleData.handle;
          var nextHandleLeft = Number.parseFloat(getComputedStyle(nextHandle).left);

          if (newLeft > nextHandleLeft) {
            newLeft = nextHandleLeft;
            return;
          }
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
