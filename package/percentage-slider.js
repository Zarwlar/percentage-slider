parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"CvJj":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.__extends=e,exports.__rest=n,exports.__decorate=o,exports.__param=a,exports.__metadata=u,exports.__awaiter=i,exports.__generator=c,exports.__exportStar=f,exports.__values=l,exports.__read=s,exports.__spread=p,exports.__spreadArrays=y,exports.__await=_,exports.__asyncGenerator=h,exports.__asyncDelegator=v,exports.__asyncValues=b,exports.__makeTemplateObject=d,exports.__importStar=x,exports.__importDefault=w,exports.__assign=void 0;var t=function(e,r){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(e,r)};function e(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}var r=function(){return exports.__assign=r=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},r.apply(this,arguments)};function n(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(t);o<n.length;o++)e.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(t,n[o])&&(r[n[o]]=t[n[o]])}return r}function o(t,e,r,n){var o,a=arguments.length,u=a<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(t,e,r,n);else for(var i=t.length-1;i>=0;i--)(o=t[i])&&(u=(a<3?o(u):a>3?o(e,r,u):o(e,r))||u);return a>3&&u&&Object.defineProperty(e,r,u),u}function a(t,e){return function(r,n){e(r,n,t)}}function u(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function i(t,e,r,n){return new(r||(r=Promise))(function(o,a){function u(t){try{c(n.next(t))}catch(e){a(e)}}function i(t){try{c(n.throw(t))}catch(e){a(e)}}function c(t){t.done?o(t.value):new r(function(e){e(t.value)}).then(u,i)}c((n=n.apply(t,e||[])).next())})}function c(t,e){var r,n,o,a,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return u.label++,{value:a[1],done:!1};case 5:u.label++,n=a[1],a=[0];continue;case 7:a=u.ops.pop(),u.trys.pop();continue;default:if(!(o=(o=u.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){u=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){u.label=a[1];break}if(6===a[0]&&u.label<o[1]){u.label=o[1],o=a;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(a);break}o[2]&&u.ops.pop(),u.trys.pop();continue}a=e.call(t,u)}catch(i){a=[6,i],n=0}finally{r=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}}function f(t,e){for(var r in t)e.hasOwnProperty(r)||(e[r]=t[r])}function l(t){var e="function"==typeof Symbol&&t[Symbol.iterator],r=0;return e?e.call(t):{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}}}function s(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,o,a=r.call(t),u=[];try{for(;(void 0===e||e-- >0)&&!(n=a.next()).done;)u.push(n.value)}catch(i){o={error:i}}finally{try{n&&!n.done&&(r=a.return)&&r.call(a)}finally{if(o)throw o.error}}return u}function p(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(s(arguments[e]));return t}function y(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<r;e++)for(var a=arguments[e],u=0,i=a.length;u<i;u++,o++)n[o]=a[u];return n}function _(t){return this instanceof _?(this.v=t,this):new _(t)}function h(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(t,e||[]),a=[];return n={},u("next"),u("throw"),u("return"),n[Symbol.asyncIterator]=function(){return this},n;function u(t){o[t]&&(n[t]=function(e){return new Promise(function(r,n){a.push([t,e,r,n])>1||i(t,e)})})}function i(t,e){try{(r=o[t](e)).value instanceof _?Promise.resolve(r.value.v).then(c,f):l(a[0][2],r)}catch(n){l(a[0][3],n)}var r}function c(t){i("next",t)}function f(t){i("throw",t)}function l(t,e){t(e),a.shift(),a.length&&i(a[0][0],a[0][1])}}function v(t){var e,r;return e={},n("next"),n("throw",function(t){throw t}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,o){e[n]=t[n]?function(e){return(r=!r)?{value:_(t[n](e)),done:"return"===n}:o?o(e):e}:o}}function b(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t="function"==typeof l?l(t):t[Symbol.iterator](),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise(function(n,o){(function(t,e,r,n){Promise.resolve(n).then(function(e){t({value:e,done:r})},e)})(n,o,(e=t[r](e)).done,e.value)})}}}function d(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function x(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function w(t){return t&&t.__esModule?t:{default:t}}exports.__assign=r;
},{}],"Es8J":[function(require,module,exports) {
!function(){var e=[window.Element,window.CharacterData,window.DocumentType],r=[];e.forEach(function(e){e&&r.push(e.prototype)}),r.forEach(function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){this.parentNode.removeChild(this)}})})}(),Array.prototype.findIndex||(Array.prototype.findIndex=function(e){if(null==this)throw new TypeError("Array.prototype.findIndex called on null or undefined");if("function"!=typeof e)throw new TypeError("predicate must be a function");for(var r,n=Object(this),t=n.length>>>0,o=arguments[1],i=0;i<t;i++)if(r=n[i],e.call(o,r,i,n))return i;return-1});
},{}],"bYio":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){function t(){this.items={},this.total=100}return t.prototype.getEqualParts=function(t){for(var e=[],r=this.total;r>0&&t>0;){var o=r/t;r-=o=o%2==0?Math.floor(r/t):Math.ceil(r/t),t--,e.push(o)}return e},t.prototype.getSumOfItems=function(){var t=this;return Object.keys(this.items).reduce(function(e,r){var o=t.items[r].value;return isNaN(o)?e:e+o},0)},t.prototype.isValidValue=function(t){t=t&&isNaN(t)?0:t;return this.getSumOfItems()+(t||0)<=this.total},t.prototype.hasNoItems=function(){return 0===Object.keys(this.items).length},t.prototype.makeSumEqualTotal=function(t,e){var r=this.total-e,o=t.length-1;t[o].value=(t[o].value||0)+r},t}();exports.default=t;
},{}],"NzUi":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(t,n){this.node=t,this.slider=e.createSlider(),this.items={},this.handles=[],this.makeHandleMoveableCls=n,this.node.appendChild(this.slider)}return e.createSlider=function(){var t=document.createElement("div");return t.classList.add("slider"),t.setAttribute("name","slider_"+ ++e.ids),t},e.getRandomColor=function(){for(var e="#",t=0;t<6;t++)e+="0123456789ABCDEF"[Math.floor(16*Math.random())];return e},e.removeElement=function(e){e.parentNode&&e.parentNode.removeChild(e)},e.prototype.removeFromHandles=function(e){this.handles=this.handles.filter(function(t){return t.handle!==e})},e.prototype.createLine=function(e,t){var n=document.createElement("div");return n.setAttribute("name",e),n.classList.add("line"),n.style.background=t,n},e.prototype.createHandle=function(){var e=document.createElement("div");return e.classList.add("handle"),e},e.prototype.appendItem=function(e){this.slider.insertBefore(e,this.slider.firstChild)},e.prototype.setLineWidth=function(e,t){this.items[e].line.style.width=t+"%"},e.prototype.getLastItemName=function(){var e=this,t=Object.keys(this.items).filter(function(t){return null===e.items[t]._next},this);if(1!==t.length)throw new Error("Error when trying to find last item");return t[0]},e.prototype.getHandleData=function(e){var t=this.handles.findIndex(function(t){return t.handle===e});if(-1===t)throw new Error("Error when trying to find handle");return this.handles[t]},e.prototype.getPercentOf=function(e){var t=this.items[e].line.offsetWidth;return this.convertToPercent(t)},e.prototype.convertToPercent=function(e){return 100*e/this.slider.offsetWidth},e.prototype.findHandleDataByToLineName=function(e){var t=this.handles.findIndex(function(t){return t.nameTo===e});return-1===t?null:this.handles[t]},e.prototype.findHandleDataByFromLineName=function(e){var t=this.handles.findIndex(function(t){return t.nameFrom===e});return-1===t?null:this.handles[t]},e.prototype.makeHandleMoveable=function(e,t){this.makeHandleMoveableCls.makeHandleMoveable(e,t)},e.prototype.calculateZIndexForExtraLeftCase=function(e){var t=this.handles.findIndex(function(t){return t.handle===e});e.style.zIndex=String(t)},e.ids=0,e}();exports.default=e;
},{}],"sLKb":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("tslib"),t=e.__importDefault(require("./View/view")),i=function(){function e(e,t){this.createItems=function(e){if(1===e.length)return this.createSingleItem(e[0].name,e[0].value,e[0].onChange,e[0].color);var t=e[0],i=this.createSingleItem(t.name,t.value,t.onChange,t.color),n=e.slice(1).map(function(e){return this.createItem(e.name,e.value,e.onChange,e.color)},this);return[i].concat(n)},this._model=e,this._view=t}return e.prototype.createSingleItem=function(e,t,i,n){if(!e||""===e.trim())throw new Error("Name must be provided!");var a=this._view.createLine(e,n),s={name:e,line:a,onChange:i,_next:null,_previous:null},m={name:e,value:t};return this._view.items[e]=s,this._view.setLineWidth(e,t),this._model.items[e]=m,i(t,{auto:t===this._model.total}),{line:a,name:e,value:t}},e.prototype.createItem=function(e,t,i,n){var a=this._view.createLine(e,n),s=this._view.getLastItemName();this._model.items[e]={name:e,value:t},this._view.items[e]={name:e,line:a,onChange:i,_previous:this._view.items[s],_next:null},this._view.items[s]._next=this._view.items[e];var m=this._view.createHandle();return this._view.handles.push({handle:m,nameFrom:s,nameTo:e}),{name:e,line:a,handle:m}},e.prototype.divideSliderIntoEqualParts=function(){var e=Object.keys(this._model.items),t=e.length,i=this._model.getEqualParts(t);e.forEach(function(e,t){this._model.items[e].value=i[t],(0,this._view.items[e].onChange)(i[t],{auto:!0});var n=i.slice(0,t+1).reduce(function(e,t){return e+t},0);this._view.setLineWidth(e,n)},this),this._view.handles.forEach(function(e){var t={handle:e.handle,name:e.nameTo};this.bindHandle(t)},this)},e.prototype.addItemToSlider=function(e,t){var i=this,n=Object.keys(this._model.items).reduce(function(e,t){return e+i._model.items[t].value},0);this._view.setLineWidth(t.name,n),this._view.appendItem(t.handle),this.bindHandle(t),this._view.appendItem(t.line),this._view.items[t.name].onChange(e)},e.prototype.addItemsToSlider=function(e){var t=this;if(Array.isArray(e)){var i=e[0];this._view.appendItem(i.line),e.forEach(function(e,i,n){if(!(0===i)){var a=e.name,s=t._model.items[a].value,m=n[i-1].name,o=t._view.getPercentOf(m);t._view.setLineWidth(e.name,s+o),t._view.appendItem(e.handle),t.bindHandle(e),t._view.appendItem(e.line),t._view.items[a].onChange(s)}})}else this._view.appendItem(e.line)},e.prototype.addItemToSliderAuto=function(e){this.divideSliderIntoEqualParts(),this._view.appendItem(e.handle),this._view.appendItem(e.line)},e.prototype.addItemToSliderGreedy=function(e){var t=this._model.total-this._model.getSumOfItems();this._model.items[e.name].value=t,this._view.setLineWidth(e.name,this._model.total),this._view.appendItem(e.handle),this.bindHandle(e),this._view.appendItem(e.line),this._view.items[e.name].onChange(t,{auto:!0})},e.prototype.addItemToSliderBySplitLastItem=function(e){var t=this._view.items[e.name]._previous,i=(t&&this._model.items[t.name].value||0)/2,n=Math.floor(i),a=Math.ceil(i);t&&t.line&&(t.line.style.width=parseInt(t.line.style.width||"0")-a+"%"),this._model.items[e.name].value=a,t&&(this._model.items[t.name].value=n),this.addItemToSlider(a,e),this._view.items[e.name].onChange(a),t&&this._view.items[t.name].onChange(n)},e.prototype.bindHandle=function(e){var t=this,i=e.handle,n=this._view.items[e.name]._previous;i.style.left=n&&Math.round(this._view.getPercentOf(n.name))+"%";this._view.makeHandleMoveable(i,function(e,n){var a=t._view.handles.findIndex(function(e){return e.handle===i});if(-1===a)throw new Error("Can't find handle");var s=t._view.handles[a],m=s.nameFrom,o=s.nameTo;t._view.setLineWidth(m,n);var l=e-n;t._model.items[m].value-=l,t._model.items[o].value+=l;var r=t._view.items[m].onChange,h=t._view.items[o].onChange;r(t._model.items[m].value),h(t._model.items[o].value)})},e.prototype.removeItem=function(e,i){var n=this,a=this._model.items[e],s=this._view.items[e];if(a&&s){if(1===Object.keys(this._model.items).length)return this._model.items={},this._view.items={},this._view.handles=[],t.default.removeElement(s.line),void i();var m=this._view.getLastItemName()===e;if(m){var o=this._view.findHandleDataByToLineName(e),l=s.line,r=o&&o.nameFrom,h=a.value;if(!r)throw new Error("Unexpected behavior during remove last item");return this._view.items[r]._next=null,this._model.items[r].value+=h,this._view.setLineWidth(r,this._model.total),this._view.items[r].onChange(this._model.items[r].value,{auto:!0}),o&&(t.default.removeElement(o.handle),this._view.removeFromHandles(o.handle)),t.default.removeElement(l),delete this._model.items[e],delete this._view.items[e],void i()}var d=this._view.findHandleDataByFromLineName(e),v=d&&d.nameTo,_=a.value,u=s.line;if(!v)throw new Error("Unexpected behavior during remove item");this._model.items[v].value+=_,this._view.items[v]._previous=s._previous,null===s._previous||s._previous&&(s._previous._next=s._next);!function(){if(!m){var t=n._view.findHandleDataByToLineName(e),i=n._view.findHandleDataByFromLineName(e);t&&i&&(t.nameTo=i.nameTo)}}(),this._view.items[v].onChange(this._model.items[v].value),d&&(this._view.removeFromHandles(d.handle),t.default.removeElement(d.handle)),t.default.removeElement(u),delete this._model.items[e],delete this._view.items[e],i()}else console.warn("Item "+e+" not found")},e}();exports.default=i;
},{"tslib":"CvJj","./View/view":"NzUi"}],"KxcX":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(){}return e.prototype.makeHandleMoveable=function(e,t){var n=this;if(!this.view)throw new Error("View field is not initialized");e.ontouchstart=function(i){i.cancelable&&i.preventDefault();var o=n.view.slider.firstChild?getComputedStyle(n.view.slider.firstChild).width:"0",r=parseFloat(o||""),a=100!==Math.round(n.view.convertToPercent(r)),l=i.touches[0].clientX-e.getBoundingClientRect().left,d=function(i){var o=i.touches[0].clientX-l-n.view.slider.getBoundingClientRect().left;!function(){var t=n.view.getHandleData(e).nameFrom,i=n.view.findHandleDataByToLineName(t);if(null!==i){var r=i&&i.handle,a=r&&parseFloat(getComputedStyle(r).left||"0")||0;if(o<a)return void(o=a)}o<0&&(o=0)}(),function(){var t=n.view.slider.offsetWidth,i=n.view.slider.getBoundingClientRect().left;if(o+=i,a){var r=n.view.slider.firstChild;t=r&&r.offsetWidth||t,i=r&&r.getBoundingClientRect().left||i}var l=n.view.getHandleData(e).nameTo,d=n.view.findHandleDataByFromLineName(l);if(null!==d&&d){var v=d.handle,u=parseFloat(getComputedStyle(v).left||"0");if(o>u+i)return void(o=u)}(o-=i)>t&&(o=t)}();var r=parseFloat(getComputedStyle(e).left||"0"),d=Math.round(n.view.convertToPercent(o)),v=Math.round(n.view.convertToPercent(r));e.style.left=d+"%",e.style.zIndex="1",0===d&&n.view.calculateZIndexForExtraLeftCase(e),t(v,d)};document.addEventListener("touchmove",d),document.addEventListener("touchend",function e(){document.removeEventListener("touchend",e),document.removeEventListener("touchmove",d)})},e.ondragstart=function(){return!1}},e}();exports.MakeHandleMoveableMobile=e;var t=function(){function e(){}return e.prototype.makeHandleMoveable=function(e,t){var n=this;if(!this.view)throw new Error("View field is not initialized");e.onmousedown=function(i){i.preventDefault();var o=n.view.slider.firstChild?getComputedStyle(n.view.slider.firstChild).width:"0",r=parseFloat(o||""),a=100!==Math.round(n.view.convertToPercent(r)),l=i.clientX-e.getBoundingClientRect().left,d=function(i){var o=i.clientX-l-n.view.slider.getBoundingClientRect().left;!function(){var t=n.view.getHandleData(e).nameFrom,i=n.view.findHandleDataByToLineName(t);if(null!==i){var r=i&&i.handle,a=r&&parseFloat(getComputedStyle(r).left||"0")||0;if(o<a)return void(o=a)}o<0&&(o=0)}(),function(){var t=n.view.slider.offsetWidth,i=n.view.slider.getBoundingClientRect().left;if(o+=i,a){var r=n.view.slider.firstChild;t=r&&r.offsetWidth||t,i=r&&r.getBoundingClientRect().left||i}var l=n.view.getHandleData(e).nameTo,d=n.view.findHandleDataByFromLineName(l);if(null!==d&&d){var v=d.handle,u=parseFloat(getComputedStyle(v).left||"0");if(o>u+i)return void(o=u)}(o-=i)>t&&(o=t)}();var r=parseFloat(getComputedStyle(e).left||"0"),d=Math.round(n.view.convertToPercent(o)),v=Math.round(n.view.convertToPercent(r));e.style.left=d+"%",e.style.zIndex="1",0===d&&n.view.calculateZIndexForExtraLeftCase(e),t(v,d)};document.addEventListener("mousemove",d),document.addEventListener("mouseup",function e(){document.removeEventListener("mouseup",e),document.removeEventListener("mousemove",d)})},e.ondragstart=function(){return!1}},e}();function n(){return void 0!==window.orientation?e:t}exports.MakeHandleMoveableDesktop=t;var i=n();exports.default=i;
},{}],"vfYE":[function(require,module,exports) {

},{}],"QCba":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("tslib");require("./polyfills");var t=e.__importDefault(require("./mvc/model")),r=e.__importDefault(require("./mvc/controller")),o=e.__importDefault(require("./mvc/View/view")),i=e.__importDefault(require("./mvc/View/makeMoveable"));require("./percentage-slider.css");var a=function(){function a(e){if(this._wasChanged=!1,!e)throw new Error("Node is empty!");this._model=new t.default,this._makeMoveable=new i.default,this._view=new o.default(e,this._makeMoveable),this._makeMoveable.view=this._view,this._controller=new r.default(this._model,this._view)}return a.prototype.mkOnChange=function(e){var t=this;return function(r,o){var i=o&&o.auto,a="number"==typeof r&&!isNaN(r);t._wasChanged=!i||t._wasChanged,e&&a&&e(r)}.bind(this)},a.prototype.mkOnRemove=function(e){return function(){e&&e()}.bind(this)},a.prototype.addItem=function(e){var t=e.value,r=e.onChange,i=e.name,a=e.color;if(!this._model.isValidValue(t))throw new Error("Total can't be greater than "+this._model.total);if(this._model.items[i])throw new Error("Name '"+i+"' has already taken");if(this._model.hasNoItems()){var n=parseInt(""+t,10)||this._model.total,l=this._controller.createSingleItem(i,n,this.mkOnChange(r),a||o.default.getRandomColor());return this._view.appendItem(l.line),void(t&&!isNaN(t)&&(this._wasChanged=!0))}var s=this._controller.createItem(i,t||0,this.mkOnChange(r),a||o.default.getRandomColor());if(t&&!isNaN(t))return this._wasChanged=!0,void this._controller.addItemToSlider(t,s);this._wasChanged?this._model.getSumOfItems()===this._model.total?this._controller.addItemToSliderBySplitLastItem(s):this._controller.addItemToSliderGreedy(s):this._controller.addItemToSliderAuto(s)},a.prototype.addItems=function(t,r){var o=this,i=r&&r.force;if(0!==Object.keys(this._model.items).length)throw new Error("Items can not be added to already initialized slider");var a=t.reduce(function(e,t){return e+(t.value||0)},0);if(a>this._model.total)throw new Error("Sum of items can not be great than "+this._model.total);if(0===t.length)throw new Error("Items length can not be equal 0");var n=t.map(function(t){return e.__assign(e.__assign({},t),{onChange:o.mkOnChange(t.onChange)})});i&&a!==this._model.total&&this._model.makeSumEqualTotal(n,a);var l=this._controller.createItems(n);this._controller.addItemsToSlider(l)},a.prototype.removeItem=function(e,t){this._controller.removeItem(e,this.mkOnRemove(t))},a}();exports.default=a,window.PercentageSlider=a;
},{"tslib":"CvJj","./polyfills":"Es8J","./mvc/model":"bYio","./mvc/controller":"sLKb","./mvc/View/view":"NzUi","./mvc/View/makeMoveable":"KxcX","./percentage-slider.css":"vfYE"}]},{},["QCba"], null)