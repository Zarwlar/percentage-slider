It's JavaScript percentage slider with the possible of adding and removing handles. (Works in IE11+)<br>
[Demo](https://zarwlar.github.io/percentage-slider/)

Preview
-------------
![](./preview.gif)

Install
-------------

NPM
```
npm install percentage-slider --save
```

Usage
-------------

```javascript
import PercentageSlider from 'percentage-slider';
import 'percentage-slider/package/percentage-slider.css';

const rootElem = document.getElementById('root');
const slider = new PercentageSlider(rootElem);
const SLIDER_NAME = 'SLIDER_1';

const itemData = {
  name: SLIDER_NAME,
  value: 0,
  onChange: (value) => console.log(value),
  color: '#a3d70b'
};

slider.addItem(itemData);

/* Some work ... */

slider.removeItem(SLIDER_NAME);
```

API
-------------
### PercentageSlider Constructor
- **rootElem** — DOM element inside which will be inserted slider
### PercentageSlider Instance
#### addItem
- **options** —
```typescript
Item: {
  name: String // Name of adding item
  value?: Number // Initial value for handle (from 0 to 100)
  color?: String // Color of line. If isn't provided, then line will be had random color. Can take the same values as in the css property background-color
  onChange?: (value: Number) => void // Callback with a new value as an argument
}
```
#### addItems
- **items** — Array of `Item`'s
#### removeItem
- **name** — Name of removing item
- **onRemove** — Callback performed after deleting an element
