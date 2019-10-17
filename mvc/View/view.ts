import { IMakeHandleMovable } from './makeMoveable';

interface IHandle {
  handle: HTMLElement;
  nameFrom: string;
  nameTo: string;
}

export default class View {
  public static ids: number = 0;

  public static createSlider(): HTMLElement {
    var slider = document.createElement('div');
    slider.classList.add('slider');
    slider.setAttribute('name', 'slider_' + ++View.ids);
    return slider;
  }

  public static getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public static removeElement(item: HTMLElement): void {
    if (!item.parentNode) { return; }

    item.parentNode.removeChild(item);
  }

  public makeHandleMoveableCls: IMakeHandleMovable;
  public node: HTMLElement;
  public slider: HTMLElement;
  public items: any;
  public handles: IHandle[];

  public constructor(node: HTMLElement, makeHandleMoveable: IMakeHandleMovable) {
    this.node = node;
    this.slider = View.createSlider();
    this.items = {};
    this.handles = [];
    this.makeHandleMoveableCls = makeHandleMoveable;

    this.node.appendChild(this.slider);
  }

  public removeFromHandles(handle: HTMLElement): void {
    this.handles = this.handles.filter((handleData) => handleData.handle !== handle);
  }

  public createLine(name: string, color: string): HTMLElement {
    const line = document.createElement('div');

    line.setAttribute('name', name);
    line.classList.add('line');
    line.style.background = color;

    return line;
  }

  public createHandle(): HTMLElement {
    const handle = document.createElement('div');

    handle.classList.add('handle');

    return handle;
  }

  public appendItem(item: HTMLElement): void {
    this.slider.insertBefore(item, this.slider.firstChild);
  }

  public setLineWidth(name: string, value: number): void {
    this.items[name].line.style.width = `${value}%`;
  }

  public getLastItemName(): string {
    const namesPrev = Object
      .keys(this.items)
      .filter(item => this.items[item]._next === null, this);

    if (namesPrev.length !== 1) {
      throw new Error('Error when trying to find last item');
    }

    return namesPrev[0];
  }

  public getHandleData(handle: HTMLElement): IHandle {
    const handleIndex = this.handles.findIndex(
      handleData => handleData.handle === handle
    );

    if (handleIndex === -1) {
      throw new Error('Error when trying to find handle');
    }

    return this.handles[handleIndex];
  }

  public getPercentOf(name: string): number {
    const particularLineWidth = this.items[name].line.offsetWidth;
    return this.convertToPercent(particularLineWidth);
  }

  public convertToPercent(value: number): number {
    const totalPercent = this.slider.offsetWidth;
    return (value * 100) / totalPercent;
  }

  public findHandleDataByToLineName(name: string): null | IHandle {
    const handleIndex = this.handles.findIndex(handle => {
      return handle.nameTo === name;
    });

    return handleIndex === -1 ? null : this.handles[handleIndex];
  }

  public findHandleDataByFromLineName(name: string): null | IHandle {
    const handleIndex = this.handles.findIndex(handle => {
      return handle.nameFrom === name;
    });

    return handleIndex === -1 ? null : this.handles[handleIndex];
  }

  public makeHandleMoveable(handle: HTMLElement, updateValues: (a: number, b: number) => void): void {
    this.makeHandleMoveableCls.makeHandleMoveable(handle, updateValues);
  }

  public calculateZIndexForExtraLeftCase(handle: HTMLElement): void {
    const index = this.handles.findIndex((handleData) => handleData.handle === handle);

    handle.style.zIndex = String(index);
  }
}
