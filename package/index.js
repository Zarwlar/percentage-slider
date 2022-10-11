require("./index.css");

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $882b6d93070905b3$export$2e2bcd8739ae039);
class $cdf6ce26542b1dcf$export$2e2bcd8739ae039 {
    lines = {};
    static TOTAL = 100;
    // Gets the same cube of 100 by the given number of elements. For example
    // getEqualParts(2) -> [50, 50]
    // getEqualParts(3) -> [33, 33, 33]
    // getEqualParts(4) -> [25, 25, 25, 250
    // and so on..
    getEqualParts(n) {
        const values = [];
        let total = $cdf6ce26542b1dcf$export$2e2bcd8739ae039.TOTAL;
        while(total > 0 && n > 0){
            let a = total / n;
            if (a % 2 == 0) a = Math.floor(total / n);
            else a = Math.ceil(total / n);
            total -= a;
            n--;
            values.push(a);
        }
        return values;
    }
    getSumOfLines() {
        return Object.keys(this.lines).reduce((acc, line)=>{
            const currValue = this.lines[line].value;
            return isNaN(currValue) ? acc : acc + currValue;
        }, 0);
    }
    isValidValue(value) {
        var value = value && isNaN(value) ? 0 : value;
        return this.getSumOfLines() + (value || 0) <= $cdf6ce26542b1dcf$export$2e2bcd8739ae039.TOTAL;
    }
    hasNoLines() {
        return Object.keys(this.lines).length === 0;
    }
}



const $623ffb233022fee7$var$environment = {
    mobile: {
        eventName: "ontouchstart",
        getClientX: (event)=>event.touches[0].clientX,
        move: {
            start: "touchmove",
            finish: "touchend"
        }
    },
    desktop: {
        eventName: "onmousedown",
        getClientX: (event)=>event.clientX,
        move: {
            start: "mousemove",
            finish: "mouseup"
        }
    }
};
class $623ffb233022fee7$export$b711f72df9dca7ea {
    constructor(view){
        const platform = typeof window.orientation !== "undefined" ? "mobile" : "desktop";
        this.enviroment = $623ffb233022fee7$var$environment[platform];
        this.view = view;
    }
    makeHandleMoveable(updateValues) {
        this.view.slider[this.enviroment.eventName] = (event)=>{
            const isHtmlElement = event.target instanceof HTMLElement;
            const isHandle = isHtmlElement && event.target.closest("[data-handle]")?.dataset?.handle === "handle";
            if (!isHandle) return;
            let handle = event.target;
            const handleData = this.view.getHandleData(handle);
            const prevLineValue = handleData?.previousLineName && this.view.lines[handleData?.previousLineName].line.dataset.value;
            const nextLineValue = handleData?.nextLineName && this.view.lines[handleData?.nextLineName].line.dataset.value;
            if (prevLineValue === undefined || nextLineValue === undefined) {
                console.error("Trying to move a handle that is not bounded by two lines.");
                return;
            }
            const isHandleLocked = prevLineValue === "0" && nextLineValue === "0";
            const params = {
                event: event,
                updateValues: updateValues,
                view: this.view,
                enviroment: this.enviroment
            };
            if (isHandleLocked) {
                handle = $623ffb233022fee7$var$findHandleThatCanBeMoved({
                    handle: handle,
                    handles: this.view.handles,
                    lines: this.view.lines
                });
                $623ffb233022fee7$var$processMovement({
                    ...params,
                    handle: handle
                });
            } else $623ffb233022fee7$var$processMovement({
                ...params,
                handle: handle
            });
        };
    }
}
function $623ffb233022fee7$var$processMovement(params) {
    const { event: event , view: view , enviroment: enviroment , updateValues: updateValues  } = params;
    let handle = params.handle;
    if (event.cancelable) event.preventDefault();
    const sliderWidthStr = view.slider.firstChild ? getComputedStyle(view.slider.firstChild).width : "0";
    const longestLineWidth = parseFloat(sliderWidthStr || "");
    const longestLinePercent = Math.round(view.convertToPercent(longestLineWidth));
    const isPartialFilledSlider = longestLinePercent !== 100;
    const shiftX = enviroment.getClientX(event) - handle.getBoundingClientRect().left;
    const onMove = (event)=>{
        let newLeft = enviroment.getClientX(event) - shiftX - view.slider.getBoundingClientRect().left;
        const considerLeftEdgeCase = ()=>{
            const previousName = view.getHandleData(handle).previousLineName;
            const prevHandleData = view.findHandleDataByToLineName(previousName);
            const isFirstHandle = prevHandleData === null;
            if (!isFirstHandle) {
                const prevHandle = prevHandleData && prevHandleData.handle;
                const prevHandleLeft = prevHandle && parseFloat(getComputedStyle(prevHandle).left || "0") || 0;
                if (newLeft < prevHandleLeft) {
                    newLeft = prevHandleLeft;
                    handle = $623ffb233022fee7$var$findHandleThatCanBeMovedToLeft({
                        handle: handle,
                        handles: view.handles,
                        lines: view.lines
                    });
                    return;
                }
            }
            if (newLeft < 0) newLeft = 0;
        };
        const considerRightEdgeCase = ()=>{
            let rightEdgeSource = view.slider.offsetWidth;
            let offset = view.slider.getBoundingClientRect().left;
            newLeft += offset;
            if (isPartialFilledSlider) {
                const longestLine = view.slider.firstChild;
                rightEdgeSource = longestLine && longestLine.offsetWidth || rightEdgeSource;
                offset = longestLine && longestLine.getBoundingClientRect().left || offset;
            }
            const nextName = view.getHandleData(handle).nextLineName;
            const nextHandleData = view.findHandleDataByFromLineName(nextName);
            const isLastLine = nextHandleData === null;
            if (!isLastLine && nextHandleData) {
                const nextHandle = nextHandleData.handle;
                const nextHandleLeft = parseFloat(getComputedStyle(nextHandle).left || "0");
                if (newLeft > nextHandleLeft + offset) {
                    newLeft = nextHandleLeft;
                    handle = $623ffb233022fee7$var$findHandleThatCanBeMovedToRight({
                        handle: handle,
                        handles: view.handles,
                        lines: view.lines
                    });
                    return;
                }
            }
            newLeft -= offset;
            const rightEdge = rightEdgeSource;
            if (newLeft > rightEdge) newLeft = rightEdge;
        };
        considerLeftEdgeCase();
        considerRightEdgeCase();
        const currentLeft = parseFloat(getComputedStyle(handle).left || "0");
        const newLeftInPercent = Math.round(view.convertToPercent(newLeft));
        const oldLeftInPercent = Math.round(view.convertToPercent(currentLeft));
        handle.style.left = `${newLeftInPercent}%`;
        updateValues(handle, oldLeftInPercent, newLeftInPercent);
    };
    const onMoveEnd = ()=>{
        document.removeEventListener(enviroment.move.finish, onMoveEnd);
        document.removeEventListener(enviroment.move.start, onMove);
    };
    document.addEventListener(enviroment.move.start, onMove);
    document.addEventListener(enviroment.move.finish, onMoveEnd);
}
function $623ffb233022fee7$var$findHandleThatCanBeMoved({ handle: handle , handles: handles , lines: lines  }) {
    const restHandles = Array.from(handles.entries()).filter(([iteratedHandle, { previousLineName: previousLineName , nextLineName: nextLineName  }])=>{
        const isNotCurrentHandle = iteratedHandle !== handle;
        const prevVal = lines[previousLineName].line.dataset.value;
        const nextVal = lines[nextLineName].line.dataset.value;
        const hasNonZeroLine = prevVal !== "0" || nextVal !== "0";
        return isNotCurrentHandle && hasNonZeroLine;
    });
    return restHandles.length > 0 ? restHandles[0][0] : handle;
}
function $623ffb233022fee7$var$findHandleThatCanBeMovedToRight({ handle: handle , handles: handles , lines: lines  }) {
    const handleData = handles.get(handle);
    const candidateLineName = handleData?.nextLineName && lines[handleData.nextLineName].name;
    const restHandles = Array.from(handles.entries()).filter(([_, { nextLineName: nextLineName  }])=>{
        return lines[nextLineName].previousLineView?.name === candidateLineName;
    });
    return restHandles.length > 0 ? restHandles[0][0] : handle;
}
function $623ffb233022fee7$var$findHandleThatCanBeMovedToLeft({ handle: handle , handles: handles , lines: lines  }) {
    const handleData = handles.get(handle);
    const candidateLineName = handleData?.previousLineName && lines[handleData.previousLineName].name;
    const restHandles = Array.from(handles.entries()).filter(([_, { previousLineName: previousLineName  }])=>{
        return lines[previousLineName].nextLineView?.name === candidateLineName;
    });
    return restHandles.length > 0 ? restHandles[0][0] : handle;
}
var $623ffb233022fee7$export$2e2bcd8739ae039 = $623ffb233022fee7$export$b711f72df9dca7ea;



class $c613343a8bb502e2$export$2e2bcd8739ae039 {
    constructor(node){
        this.node = node;
        this.slider = this.createSlider();
        this.lines = {};
        this.handles = new Map();
        this.sliderMovement = new (0, $623ffb233022fee7$export$b711f72df9dca7ea)(this);
        this.node.appendChild(this.slider);
    }
    removePreviousHandles(handle) {
        this.handles.delete(handle);
    }
    createLine(name, color) {
        const line = document.createElement("div");
        line.setAttribute("name", name);
        line.classList.add("line");
        line.style.background = color;
        return line;
    }
    createHandle() {
        const handle = document.createElement("div");
        handle.classList.add("handle");
        handle.setAttribute("data-handle", "handle");
        return handle;
    }
    appendElement(el) {
        this.slider.insertBefore(el, this.slider.firstChild);
    }
    setLineWidth(name, value) {
        this.lines[name].line.style.width = `${value}%`;
        this.lines[name].line.setAttribute("data-value", String(value));
    }
    getLastLineName() {
        const namesPrev = Object.keys(this.lines).filter((lineView)=>this.lines[lineView].nextLineView === null, this);
        if (namesPrev.length !== 1) throw new Error("Error during try to find last line name");
        return namesPrev[0];
    }
    getHandleData(handle) {
        const handleData = this.handles.get(handle);
        if (!handleData) throw new Error("Error when trying to find handle");
        return handleData;
    }
    getLineWidthInPercent(name) {
        const particularLineWidth = this.lines[name].line.offsetWidth;
        return this.convertToPercent(particularLineWidth);
    }
    convertToPercent(value) {
        const totalPercent = this.slider.offsetWidth;
        return value * 100 / totalPercent;
    }
    findHandleDataByToLineName(name) {
        const r = Array.from(this.handles.values()).find((c)=>c.nextLineName === name);
        return r ? r : null;
    }
    findHandleDataByFromLineName(name) {
        const r = Array.from(this.handles.values()).find((c)=>c.previousLineName === name);
        return r ? r : null;
    }
    makeHandleMoveable(updateValues) {
        this.sliderMovement.makeHandleMoveable(updateValues);
    }
    createSlider() {
        var slider = document.createElement("div");
        slider.classList.add("slider");
        slider.setAttribute("name", "slider_" + $c613343a8bb502e2$export$2e2bcd8739ae039.sliderId);
        $c613343a8bb502e2$export$2e2bcd8739ae039.sliderId = $c613343a8bb502e2$export$2e2bcd8739ae039.sliderId++;
        return slider;
    }
    static sliderId = 0;
    static getRandomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for(var i = 0; i < 6; i++)color += letters[Math.floor(Math.random() * 16)];
        return color;
    }
    static removeElement(el) {
        if (!el.parentNode) return;
        el.parentNode.removeChild(el);
    }
}


class $504308b1bf9f3889$export$2e2bcd8739ae039 {
    constructor(model, view){
        this.model = model;
        this.view = view;
        this.model = model;
        this.view = view;
        this.activateDragHandleListener();
    }
    createSingleLine(params) {
        const { name: name , value: value , onChange: onChange , color: color  } = params;
        const line = this.view.createLine(name, color);
        const lineView = {
            name: name,
            line: line,
            onChange: onChange,
            nextLineView: null,
            previousLineView: null
        };
        const lineModel = {
            name: name,
            value: value
        };
        this.view.lines[name] = lineView;
        this.view.setLineWidth(name, value);
        this.model.lines[name] = lineModel;
        onChange(value, {
            auto: value === (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL
        });
        return {
            line: line,
            name: name,
            value: value
        };
    }
    createLineWithHandle(params) {
        const { name: name , value: value , onChange: onChange , color: color  } = params;
        const line = this.view.createLine(name, color);
        const namePrev = this.view.getLastLineName();
        this.model.lines[name] = {
            name: name,
            value: value
        };
        this.view.lines[name] = {
            name: name,
            line: line,
            onChange: onChange,
            previousLineView: this.view.lines[namePrev],
            nextLineView: null
        };
        this.view.lines[namePrev].nextLineView = this.view.lines[name];
        const handle = this.view.createHandle();
        this.view.handles.set(handle, {
            handle: handle,
            previousLineName: namePrev,
            nextLineName: name
        });
        return {
            name: name,
            line: line,
            handle: handle
        };
    }
    createLines(params) {
        const singleLine = this.createSingleLine(params[0]);
        const restLinesWithHandles = params.slice(1).map(this.createLineWithHandle, this);
        return [
            singleLine,
            ...restLinesWithHandles
        ];
    }
    divideSliderIntoEqualParts() {
        const names = Object.keys(this.model.lines);
        const amount = names.length;
        const diffs = this.model.getEqualParts(amount);
        names.forEach(function(name, index) {
            this.model.lines[name].value = diffs[index];
            const onChange = this.view.lines[name].onChange;
            onChange(diffs[index], {
                auto: true
            });
            const aggregate = diffs.slice(0, index + 1).reduce((acc, curr)=>acc + curr, 0);
            this.view.setLineWidth(name, aggregate);
        }, this);
        this.view.handles.forEach(function(handleData) {
            const partialHandleData = {
                handle: handleData.handle,
                name: handleData.nextLineName
            };
            this.updateHandlePosition(partialHandleData);
        }, this);
    }
    addLineWithHandleToSlider(value, lwh) {
        const aggregation = Object.keys(this.model.lines).reduce((acc, curr)=>{
            return acc + this.model.lines[curr].value;
        }, 0);
        this.view.setLineWidth(lwh.name, aggregation);
        this.view.appendElement(lwh.handle);
        this.updateHandlePosition(lwh);
        this.view.appendElement(lwh.line);
        this.view.lines[lwh.name].onChange(value);
    }
    addLinesToSlider(lines) {
        var singleLine = lines[0];
        this.view.appendElement(singleLine.line);
        lines.slice(1).forEach((lwh, index, arr)=>{
            const lineName = lwh.name;
            const value = this.model.lines[lineName].value;
            const prevName = arr[index - 1]?.name || singleLine.name;
            const prevLineWidth = this.view.getLineWidthInPercent(prevName);
            this.view.setLineWidth(lwh.name, value + prevLineWidth);
            this.view.appendElement(lwh.handle);
            this.updateHandlePosition(lwh);
            this.view.appendElement(lwh.line);
            this.view.lines[lineName].onChange(value);
        });
    }
    addLineWithHandleToSliderAuto(lwh) {
        this.divideSliderIntoEqualParts();
        this.view.appendElement(lwh.handle);
        this.view.appendElement(lwh.line);
    }
    addLineWithHandleToSliderGreedy(lwh) {
        const emptySpace = (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL - this.model.getSumOfLines();
        this.model.lines[lwh.name].value = emptySpace;
        this.view.setLineWidth(lwh.name, (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL);
        this.view.appendElement(lwh.handle);
        this.updateHandlePosition(lwh);
        this.view.appendElement(lwh.line);
        this.view.lines[lwh.name].onChange(emptySpace, {
            auto: true
        });
    }
    addLineWithHandleToSliderBySplitLastLine(lwh) {
        const prevLineView = this.view.lines[lwh.name].previousLineView;
        const prevLineValue = prevLineView && this.model.lines[prevLineView.name].value || 0;
        const prevDividedInto2 = prevLineValue / 2;
        const newPrevLineValue = Math.floor(prevDividedInto2);
        const newLineValue = Math.ceil(prevDividedInto2);
        if (prevLineView && prevLineView.line) prevLineView.line.style.width = parseInt(prevLineView.line.style.width || "0") - newLineValue + "%";
        this.model.lines[lwh.name].value = newLineValue;
        if (prevLineView) this.model.lines[prevLineView.name].value = newPrevLineValue;
        this.addLineWithHandleToSlider(newLineValue, lwh);
        this.view.lines[lwh.name].onChange(newLineValue);
        prevLineView && this.view.lines[prevLineView.name].onChange(newPrevLineValue);
    }
    activateDragHandleListener() {
        const updateValues = (handle, oldHandleLeft, newHandleLeft)=>{
            const handleData = this.view.getHandleData(handle);
            const previousName = handleData.previousLineName;
            const nextName = handleData.nextLineName;
            // view
            this.view.setLineWidth(previousName, newHandleLeft);
            // model
            const diff = oldHandleLeft - newHandleLeft;
            this.model.lines[previousName].value -= diff;
            this.model.lines[nextName].value += diff;
            const fromOnChange = this.view.lines[previousName].onChange;
            const toOnChange = this.view.lines[nextName].onChange;
            fromOnChange(this.model.lines[previousName].value);
            toOnChange(this.model.lines[nextName].value);
        };
        this.view.makeHandleMoveable(updateValues);
    }
    removeLine(name, onRemove) {
        const removingLineModel = this.model.lines[name];
        const removingLineView = this.view.lines[name];
        if (!removingLineModel || !removingLineView) {
            console.warn("Line " + name + " not found");
            return;
        }
        const isSingleLine = Object.keys(this.model.lines).length === 1;
        if (isSingleLine) {
            this.model.lines = {};
            this.view.lines = {};
            this.view.handles = new Map();
            (0, $c613343a8bb502e2$export$2e2bcd8739ae039).removeElement(removingLineView.line);
            onRemove();
            return;
        }
        const isLastLine = this.view.getLastLineName() === name;
        if (isLastLine) {
            const handleData = this.view.findHandleDataByToLineName(name);
            const line = removingLineView.line;
            const prevLineName = handleData && handleData.previousLineName;
            const valueTo = removingLineModel.value;
            if (!prevLineName) throw new Error("Unexpected behavior during remove last line");
            this.view.lines[prevLineName].nextLineView = null;
            this.model.lines[prevLineName].value += valueTo;
            this.view.setLineWidth(prevLineName, (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL);
            this.view.lines[prevLineName].onChange(this.model.lines[prevLineName].value, {
                auto: true
            });
            if (handleData) {
                (0, $c613343a8bb502e2$export$2e2bcd8739ae039).removeElement(handleData.handle);
                this.view.removePreviousHandles(handleData.handle);
            }
            (0, $c613343a8bb502e2$export$2e2bcd8739ae039).removeElement(line);
            delete this.model.lines[name];
            delete this.view.lines[name];
            onRemove();
            return;
        }
        // Generic case
        const handleData1 = this.view.findHandleDataByFromLineName(name);
        const nextLineName = handleData1 && handleData1.nextLineName;
        const removingLineValue = removingLineModel.value;
        const line1 = removingLineView.line;
        if (!nextLineName) throw new Error("Unexpected behavior during remove line");
        this.model.lines[nextLineName].value += removingLineValue;
        this.view.lines[nextLineName].previousLineView = removingLineView.previousLineView;
        const isFirstLine = removingLineView.previousLineView === null;
        if (!isFirstLine) {
            if (removingLineView.previousLineView) removingLineView.previousLineView.name = removingLineView.name;
        }
        const updateHandles = ()=>{
            if (isLastLine) return;
            const leftHandleData = this.view.findHandleDataByToLineName(name);
            const rightHandleData = this.view.findHandleDataByFromLineName(name);
            if (leftHandleData && rightHandleData) leftHandleData.nextLineName = rightHandleData.nextLineName;
        };
        updateHandles();
        this.view.lines[nextLineName].onChange(this.model.lines[nextLineName].value);
        if (handleData1) {
            this.view.removePreviousHandles(handleData1.handle);
            (0, $c613343a8bb502e2$export$2e2bcd8739ae039).removeElement(handleData1.handle);
        }
        (0, $c613343a8bb502e2$export$2e2bcd8739ae039).removeElement(line1);
        delete this.model.lines[name];
        delete this.view.lines[name];
        onRemove();
    }
    updateHandlePosition({ handle: handle , name: name  }) {
        const prevLineView = this.view.lines[name].previousLineView;
        handle.style.left = prevLineView && Math.round(this.view.getLineWidthInPercent(prevLineView.name)) + "%" || "1%";
    }
}



class $882b6d93070905b3$export$2e2bcd8739ae039 {
    constructor(node){
        if (!node) {
            console.warn("Node is empty!");
            return;
        }
        this.model = new (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039)();
        this.view = new (0, $c613343a8bb502e2$export$2e2bcd8739ae039)(node);
        this.controller = new (0, $504308b1bf9f3889$export$2e2bcd8739ae039)(this.model, this.view);
    }
    addLine({ value: value , onChange: onChange , name: name , color: color  }) {
        if (!this.model.isValidValue(value)) return {
            success: false,
            error: "Total can't be greater than " + (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL + "."
        };
        const hasNameAlreadyTaken = this.model.lines[name];
        if (!name || name.trim().length === 0) return {
            success: false,
            error: `The name can't be empty.`
        };
        if (hasNameAlreadyTaken) return {
            success: false,
            error: `The name '${name}' is already in use.`
        };
        if (this.model.hasNoLines()) try {
            const validValue = parseInt(`${value}`, 10) || (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL;
            const lineParams = {
                name: name,
                value: validValue,
                onChange: this.mkOnChange(onChange),
                color: color || (0, $c613343a8bb502e2$export$2e2bcd8739ae039).getRandomColor()
            };
            const lineData = this.controller.createSingleLine(lineParams);
            this.view.appendElement(lineData.line);
            if (value && !isNaN(value)) this._wasChanged = true;
            return {
                success: true
            };
        } catch (e) {
            return {
                success: false,
                error: e
            };
        }
        const lineParams1 = {
            name: name,
            value: value || 0,
            onChange: this.mkOnChange(onChange),
            color: color || (0, $c613343a8bb502e2$export$2e2bcd8739ae039).getRandomColor()
        };
        const lwh = this.controller.createLineWithHandle(lineParams1);
        if (value && !isNaN(value)) {
            this._wasChanged = true;
            this.controller.addLineWithHandleToSlider(value, lwh);
            return {
                success: true
            };
        }
        if (this._wasChanged) {
            const noSpaceLeft = this.model.getSumOfLines() === (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL;
            if (noSpaceLeft) this.controller.addLineWithHandleToSliderBySplitLastLine(lwh);
            else this.controller.addLineWithHandleToSliderGreedy(lwh);
            return {
                success: true
            };
        }
        this.controller.addLineWithHandleToSliderAuto(lwh);
        return {
            success: true
        };
    }
    addLines(lines) {
        const someLinesAlreadyAdded = Object.keys(this.model.lines).length !== 0;
        if (someLinesAlreadyAdded) return {
            success: false,
            error: "Lines can not be added to already initialized slider. Instead, you can add lines one at a time."
        };
        const linesDataSum = lines.reduce((acc, curr)=>acc + (curr.value || 0), 0);
        if (linesDataSum > (0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL) return {
            success: false,
            error: `Sum of lines can not be great than ${(0, $cdf6ce26542b1dcf$export$2e2bcd8739ae039).TOTAL}.`
        };
        if (lines.length === 0) return {
            success: false,
            error: "Cannot initialize strips with an empty array."
        };
        let internalLineInitParams = lines.map((line)=>{
            return {
                ...line,
                color: line.color || (0, $c613343a8bb502e2$export$2e2bcd8739ae039).getRandomColor(),
                value: line.value || 0,
                onChange: this.mkOnChange(line.onChange)
            };
        });
        var internalLines = this.controller.createLines(internalLineInitParams);
        this.controller.addLinesToSlider(internalLines);
        return {
            success: true
        };
    }
    removeLine(name, onRemove) {
        this.controller.removeLine(name, this.mkOnRemove(onRemove));
    }
    _wasChanged = false;
    mkOnChange(onChange) {
        return ((value, options)=>{
            var auto = options && options.auto;
            this._wasChanged = auto ? this._wasChanged : true;
            onChange && onChange(value);
        }).bind(this);
    }
    mkOnRemove(onRemove) {
        return (function() {
            onRemove && onRemove();
        }).bind(this);
    }
}
window.PercentageSlider = $882b6d93070905b3$export$2e2bcd8739ae039;


//# sourceMappingURL=index.js.map
