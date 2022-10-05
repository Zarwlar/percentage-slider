import PercentageSlider from '../../index';
import './client.css';

const node = document.getElementById('slider-root')!;
const addSliderButton = document.getElementById('add-slider-button')!;
const addSetOfSlidersButton = document.getElementById('add-set-of-sliders')!;
const sliderNameInput = document.getElementById('slider-name-input')! as HTMLInputElement;
const sliderValueInput = document.getElementById('slider-value-input')! as HTMLInputElement;
const listOfValueView = document.getElementById('list-of-value-value')!;

const slider = new PercentageSlider(node);

addSliderButton.addEventListener('click', function () {
  const name = sliderNameInput.value;
  const value = parseInt(sliderValueInput.value, 10);
  const color = getRandomColor();

  const valueView = createSegmentValueView({ name, value, color });
  const valueFragment = valueView.querySelector('.item-value')!;
  const onChange = (value: number) => {
    valueFragment.textContent = value + '%';
  };

  const itemData = { name, value, color, onChange };
  const result = slider.addItem(itemData);

  if (!result.success) {
    alert(result.error)
  } else {
    listOfValueView.appendChild(valueView);
    document.querySelector('.quick-demo')?.remove();
    sliderNameInput.value = '';
    sliderValueInput.value = '';
  }
});

addSetOfSlidersButton.addEventListener('click', function () {
  addSetOfSlidersButton.remove();

  const demoData = [
    { name: 'Apples', value: 0, onChange: undefined, color: '#e0aaff' },
    { name: 'Bananas', value: 0, onChange: undefined, color: '#c77dff' },
    { name: 'Oranges', value: 0, onChange: undefined, color: '#9d4edd' },
    { name: 'Avocados', value: 100, onChange: undefined, color: '#7b2cbf' },
  ];

  const demoViewData = demoData.map(createSegmentValueView);

  demoViewData.forEach(fragment => listOfValueView.appendChild(fragment));


  const valueFragments = demoViewData.map(fragment => {
    return fragment.querySelector('.item-value')!;
  });

  const onChanges = valueFragments.map(valueFragment => {
    return (value: number) => {
      valueFragment.textContent = value + '%';
    }
  });

  const withOnChangedemoData = demoData.map((item, index) => {
    return {
      ...item,
      onChange: onChanges[index],
    };
  });

  slider.addItems(withOnChangedemoData);

  document.querySelector('.manually-demo')?.remove();
});

function createSegmentValueView(params: { name: string, value: number, color: string }) {
  const { name, value, color } = params;
  const fragment = document.createElement('div');
  fragment.classList.add('item-view');
  fragment.style.backgroundColor = color;

  const dataContainer = document.createElement('div');
  dataContainer.classList.add('data-container');

  const removeItemContainer = document.createElement('div');
  removeItemContainer.classList.add('remove-item-container');

  const removeButton = document.createElement('button');
  removeButton.textContent = `Remove item`;
  removeButton.classList.add('btn');
  removeButton.classList.add('btn_remove');

  removeButton.addEventListener('click', function () {
    slider.removeItem(name, () => {
      fragment.remove();
    });
  });

  removeItemContainer.appendChild(removeButton);

  const nameFragment = document.createElement('span');
  nameFragment.classList.add('item-name');
  nameFragment.textContent = name;

  const valueFragment = document.createElement('span');
  valueFragment.classList.add('item-value');
  valueFragment.textContent = String(value);

  dataContainer.appendChild(nameFragment);
  dataContainer.appendChild(valueFragment);

  fragment.appendChild(dataContainer);
  fragment.appendChild(removeItemContainer);

  return fragment;
}

function getRandomColor(): string {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
