const colorScale = d3.scaleOrdinal().
    domain(['apple', 'lemon']).
    range(['#c11d1d', '#eae600']);

const radiusScale = d3.scaleOrdinal().
    domain(['apple', 'lemon']).
    range([50, 30]);

const xPosition = (d, i) => i * 180 + 100;

export const fruitBowl = (selection, props) => {
  const {fruits, height} = props;

  const circlesG = selection.selectAll('circle').
      data(fruits, d => d.id);

  circlesG.enter().
      append('circle').
      attr('cx', xPosition).
      attr('cy', height / 2).
      attr('r', 0).
      merge(circlesG).
      transition().duration(1000).
      attr('fill', d => colorScale(d.type)).
      attr('cx', xPosition).
      attr('r', d => radiusScale(d.type));

  circlesG.exit().
      transition().duration(1000).
      attr('r', 0).
      remove();

  const text = selection.selectAll('text').
      data(fruits, d => d.id);

  text.enter().
      append('text').
      attr('x', xPosition).
      style('font-size', '0em').
      merge(text).
      transition().duration(1000).
      attr('y', height / 2 + 120).
      attr('x', xPosition).
      style('font-size', '3em').
      text(d => d.type);

  text.exit().
      transition().duration(1000).
      style('font-size', '0em').
      remove();
};