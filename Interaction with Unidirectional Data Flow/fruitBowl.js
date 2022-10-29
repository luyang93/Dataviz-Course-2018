const colorScale = d3.scaleOrdinal().
    domain(['apple', 'lemon']).
    range(['#c11d1d', '#eae600']);

const radiusScale = d3.scaleOrdinal().
    domain(['apple', 'lemon']).
    range([80, 50]);

export const fruitBowl = (selection, props) => {
  const {
    fruits, height, onClick, selectedFruit, onMouseOver, hoverFruit,
  } = props;

  const bowl = selection.selectAll('rect').
      data([null]).
      enter().
      append('rect').
      attr('width', 920).
      attr('height', height / 2).
      attr('rx', height / 4).
      attr('transform', `translate(0, ${height / 4})`);

  const groupTransform = (d, i) => `translate(${i * 180 + 100}, ${height / 2})`;

  const groups = selection.selectAll('g').
      data(fruits, d => d.id);
  const groupsEnter = groups.enter().
      append('g').
      attr('transform', groupTransform);

  groupsEnter.merge(groups).
      transition().duration(2000).
      attr('transform', groupTransform);
  groups.exit().
      transition().duration(2000).
      remove();

  groupsEnter.append('circle').
      attr('r', 0).
      merge(groups.select('circle')).
      attr('stroke', d => d.id === hoverFruit || d.id === selectedFruit
          ? 'black'
          : 'none').
      attr('stroke-width', d => d.id === selectedFruit ? 20 : 5).
      on('click', d => onClick(d.id)).
      on('mouseover', d => onMouseOver(d.id)).
      on('mouseout', () => onMouseOver(null)).
      transition().duration(2000).
      attr('fill', d => colorScale(d.type)).
      attr('r', d => radiusScale(d.type));
  groups.exit().
      select('circle').
      transition().duration(2000).
      attr('r', 0);

  groupsEnter.append('text').
      style('font-size', '0em').
      merge(groups.select('text')).
      transition().duration(2000).
      attr('y', 120).
      style('font-size', '2em').
      text(d => d.type);
  groups.exit().
      select('text').
      transition().duration(2000).
      style('font-size', '0em');

};