import {fruitBowl} from './fruitBowl.js';

(function(d3) {
  'use strict';

  const svg = d3.select('svg');

  const makeFruit = type => ({
    type, id: Math.random(),
  });

  let fruits = d3.range(5).
      map(() => makeFruit('apple'));
  let selectedFruit = null;
  let hoverFruit = null;

  const onClick = id => {
    selectedFruit = id;
    render();
  };

  const onMouseOver = id => {
    hoverFruit = id;
    render();
  };

  const render = () => {
    fruitBowl(svg, {
      fruits,
      height: +svg.attr('height'),
      onClick,
      selectedFruit,
      onMouseOver,
      hoverFruit,
    });
  };

  render();

  // Eat an apple.
  setTimeout(() => {
    fruits.pop();
    render();
  }, 4000);

  // Replacing an apple with a lemon.
  setTimeout(() => {
    fruits[2].type = 'lemon';
    render();
  }, 8000);

  // Eat an apple.
  setTimeout(() => {
    fruits = fruits.filter((d, i) => i !== 1);
    render();
  }, 12000);

}(d3));
