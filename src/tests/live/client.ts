import PercentageSlider from '../../index';
import './client.css';

const node = document.getElementById('slider-root')!;
const addSliderButton = document.getElementById('add-slider-button')!;
const addSetOfSlidersButton = document.getElementById('add-set-of-sliders')!;
const sliderNameInput = document.getElementById(
  'slider-name-input'
)! as HTMLInputElement;
const sliderValueInput = document.getElementById(
  'slider-value-input'
)! as HTMLInputElement;
const listOfValueView = document.getElementById('list-of-value-value')!;

const slider = new PercentageSlider(node);

addSliderButton.addEventListener('click', function () {
  const name = sliderNameInput.value;
  const value = parseInt(sliderValueInput.value, 10);
  const color = getRandomColor();

  const valueView = createSegmentValueView({ name, value, color });
  const valueFragment = valueView.querySelector('.line-value')!;
  const onChange = (value: number) => {
    valueFragment.textContent = value + '%';
  };

  const line = { name, value, color, onChange };
  const result = slider.addLine(line);

  if (!result.success) {
    alert(result.error);
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
    { name: 'Apples', value: 25, onChange: undefined, color: '#dad7cd' },
    { name: 'Bananas', value: 25, onChange: undefined, color: '#a3b18a' },
    { name: 'Oranges', value: 25, onChange: undefined, color: '#588157' },
    { name: 'Avocados', value: 25, onChange: undefined, color: '#3a5a40' },
  ];

  const demoViewData = demoData.map(createSegmentValueView);

  demoViewData.forEach((fragment) => listOfValueView.appendChild(fragment));

  const valueFragments = demoViewData.map((fragment) => {
    return fragment.querySelector('.line-value')!;
  });

  const onChanges = valueFragments.map((valueFragment) => {
    return (value: number) => {
      valueFragment.textContent = value + '%';
    };
  });

  const withOnChangedemoData = demoData.map((line, index) => {
    return {
      ...line,
      onChange: onChanges[index],
    };
  });

  slider.addLines(withOnChangedemoData);
});

function createSegmentValueView(params: {
  name: string;
  value: number;
  color: string;
}) {
  const { name, value, color } = params;
  const fragment = document.createElement('div');
  fragment.classList.add('line-view');
  fragment.style.backgroundColor = color;

  const dataContainer = document.createElement('div');
  dataContainer.classList.add('data-container');

  const removeLineContainer = document.createElement('div');
  removeLineContainer.classList.add('remove-line-container');

  const removeButton = document.createElement('button');
  removeButton.textContent = `Remove line`;
  removeButton.classList.add('btn');
  removeButton.classList.add('btn_remove');

  removeButton.addEventListener('click', function () {
    slider.removeLine(name, () => {
      fragment.remove();
    });
  });

  removeLineContainer.appendChild(removeButton);

  const nameFragment = document.createElement('span');
  nameFragment.classList.add('line-name');
  nameFragment.textContent = name;

  const valueFragment = document.createElement('span');
  valueFragment.classList.add('line-value');
  valueFragment.textContent = String(value);

  dataContainer.appendChild(nameFragment);
  dataContainer.appendChild(valueFragment);

  fragment.appendChild(dataContainer);
  fragment.appendChild(removeLineContainer);

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
