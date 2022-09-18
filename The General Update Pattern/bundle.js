(function(d3) {
  'use strict';

  const colorScale = d3.scaleOrdinal().
      domain(['apple', 'lemon']).
      range(['#c11d1d', '#eae600']);

  const radiusScale = d3.scaleOrdinal().
      domain(['apple', 'lemon']).
      range([50, 30]);

  const xPosition = (d, i) => i * 120 + 60;

  const fruitBowl = (selection, props) => {
    const {fruits, height} = props;

    const circles = selection.selectAll('circle').data(fruits, d => d.id);

    circles.enter().
        append('circle').
        attr('cx', xPosition).
        attr('cy', height / 2).
        attr('r', 0).
        merge(circles).
        transition().duration(1000).
        attr('fill', d => colorScale(d.type)).
        attr('cx', xPosition).
        attr('r', d => radiusScale(d.type));

    circles.exit().
        transition().duration(1000).
        attr('r', 0).
        remove();
  };

  const svg = d3.select('svg');

  const makeFruit = type => ({
    type, id: Math.random(),
  });
  let fruits = d3.range(5).map(() => makeFruit('apple'));

  const render = () => {
    fruitBowl(svg, {
      fruits, height: +svg.attr('height'),
    });
  };

  render();

  // Eat an apple.
  setTimeout(() => {
    fruits.pop();
    render();
  }, 1500);

  // Replacing an apple with a lemon.
  setTimeout(() => {
    fruits[2].type = 'lemon';
    render();
  }, 3000);

  // Eat an apple.
  setTimeout(() => {
    fruits = fruits.filter((d, i) => i !== 1);
    render();
  }, 4500);

}(d3));
