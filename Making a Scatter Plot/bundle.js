(function(d3) {
  'use strict';
  const svg = d3.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const render = data => {
    const title = 'Cars: Horsepower vs. Weight';

    const xValue = d => d.horsepower;
    const xAxisLabel = 'Horsepower';

    const yValue = d => d.weight;
    const yAxisLabel = 'Weight';

    const circleRadius = 10;
    const margin = {top: 60, right: 40, bottom: 88, left: 180};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().
        domain(d3.extent(data, xValue)).
        range([0, innerWidth]).
        nice();

    const yScale = d3.scaleLinear().
        domain(d3.extent(data, yValue)).
        range([0, innerHeight]).
        nice();

    const g = svg.append('g').
        attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAixTickFormat = number => d3.format('.3s')(number).
        replace('G', 'B');

    const xAxis = d3.axisBottom(xScale).
        tickFormat(xAixTickFormat).
        tickSize(-innerHeight).
        tickPadding(15);

    const yAxis = d3.axisLeft(yScale).
        tickSize(-innerWidth).
        tickPadding(10);

    const yAxisG = g.append('g').call(yAxis);

    yAxisG.selectAll('.domain').remove();
    yAxisG.append('text').
        attr('class', 'axis-label').
        attr('y', -93).
        attr('x', -innerHeight / 2).
        attr('fill', 'black').
        attr('transform', `rotate(-90)`).
        style('text-anchor', 'middle').
        text(yAxisLabel);

    const xAxisG = g.append('g').call(xAxis).
        attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.selectAll('.domain').remove();

    xAxisG.append('text').
        attr('class', 'axis-label').
        attr('y', 75).
        attr('x', innerWidth / 2).
        attr('fill', 'black').
        text(xAxisLabel);

    g.selectAll('circle').data(data).
        enter().append('circle').
        attr('cy', d => yScale(yValue(d))).
        attr('cx', d => xScale(xValue(d))).
        attr('r', circleRadius);

    g.append('text').
        attr('class', 'title').
        attr('y', -10).
        text(title);
  };

  d3.csv('auto-mpg.csv').then(data => {
    data.forEach(d => {
      d.mpg = +d.mpg;
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight;
      d.acceleration = +d.acceleration;
      d.year = +d.year;
    });

    render(data);
  });
}(d3));