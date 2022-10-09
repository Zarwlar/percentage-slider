import { MakeHandleMoveable } from './makeMoveable';
import './styles.scss';

export interface Handle {
  handle: HTMLElement;
  previousLineName: string;
  nextLineName: string;
}

export interface LineView {
  name: string;
  line: HTMLElement;
  onChange: OnChange;
  nextLineView: null | LineView;
  previousLineView: null | LineView;
}

export type LineViewMap = {
  [name: string]: LineView;
}

export type OnChange = (ids: number, params?: { auto: boolean }) => void;


export default class View {
  public constructor(node: HTMLElement) {
    this.node = node;
    this.slider = this.createSlider();
    this.lines = {};
    this.handles = new Map();
    this.sliderMovement = new MakeHandleMoveable(this);

    this.node.appendChild(this.slider);
  }

  public sliderMovement: MakeHandleMoveable;
  public node: HTMLElement;
  public slider: HTMLElement;
  public lines: LineViewMap;
  public handles: Map<HTMLElement, Handle>

  public removePreviousHandles(handle: HTMLElement): void {
    this.handles.delete(handle);
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
    handle.setAttribute('data-handle', 'handle');

    return handle;
  }

  public appendElement(el: HTMLElement): void {
    this.slider.insertBefore(el, this.slider.firstChild);
  }

  public setLineWidth(name: string, value: number): void {
    this.lines[name].line.style.width = `${value}%`;
    this.lines[name].line.setAttribute('data-value', String(value));
  }

  public getLastLineName(): string {
    const namesPrev = Object
      .keys(this.lines)
      .filter(lineView => this.lines[lineView].nextLineView === null, this);

    if (namesPrev.length !== 1) {
      throw new Error('Error during try to find last line name');
    }

    return namesPrev[0];
  }

  public getHandleData(handle: HTMLElement): Handle {
    const handleData = this.handles.get(handle);

    if (!handleData) {
      throw new Error('Error when trying to find handle');
    }

    return handleData;
  }

  public getPercentOf(name: string): number {
    const particularLineWidth = this.lines[name].line.offsetWidth;
    return this.convertToPercent(particularLineWidth);
  }

  public convertToPercent(value: number): number {
    const totalPercent = this.slider.offsetWidth;
    return (value * 100) / totalPercent;
  }

  public findHandleDataByToLineName(name: string): null | Handle {
    const r = Array.from(this.handles.values()).find(c => c.nextLineName === name);

    return r ? r : null;
  }

  public findHandleDataByFromLineName(name: string): null | Handle {
    const r = Array.from(this.handles.values()).find(c => c.previousLineName === name);

    return r ? r : null;
  }

  public makeHandleMoveable(updateValues: (handle: HTMLElement, a: number, b: number) => void): void {
    this.sliderMovement.makeHandleMoveable(updateValues);
  }

  private createSlider(): HTMLElement {
    var slider = document.createElement('div');
    slider.classList.add('slider');
    slider.setAttribute('name', 'slider_' + View.ids);
    View.ids = View.ids++;
    return slider;
  }

  public static ids: number = 0;

  public static getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public static removeElement(el: HTMLElement): void {
    if (!el.parentNode) { return; }

    el.parentNode.removeChild(el);
  }
}
