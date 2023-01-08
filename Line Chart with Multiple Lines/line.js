import { colorLegend } from './colorLegend.js'

(function (d3) {
  'use strict'
  const svg = d3.select('#line')

  const width = +svg.attr('width')
  const height = +svg.attr('height')
  const render = data => {
    const title = 'A Week of Temperature Aroud the World'

    const xValue = d => d.timestamp
    const xAxisLabel = 'Time'

    const yValue = d => d.temperature
    const yAxisLabel = 'Temperature'

    const margin = { top: 60, right: 160, bottom: 88, left: 105 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xScale = d3.scaleTime().
      domain(d3.extent(data, xValue)).
      range([0, innerWidth]).
      nice()

    const yScale = d3.scaleLinear().
      domain(d3.extent(data, yValue)).
      range([innerHeight, 0]).
      nice()

    const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10)

    const g = svg.append('g').
      attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xAxis = d3.axisBottom(xScale).
      tickSize(-innerHeight).
      tickPadding(15)

    const yAxis = d3.axisLeft(yScale).
      tickSize(-innerWidth).
      tickPadding(10)

    const yAxisG = g.append('g').call(yAxis)

    yAxisG.selectAll('.domain').remove()
    yAxisG.append('text').
      attr('class', 'axis-label').
      attr('y', -60).
      attr('x', -innerHeight / 2).
      attr('fill', 'black').
      attr('transform', `rotate(-90)`).
      style('text-anchor', 'middle').
      text(yAxisLabel)

    const xAxisG = g.append('g').call(xAxis).
      attr('transform', `translate(0, ${innerHeight})`)

    xAxisG.selectAll('.domain').remove()

    xAxisG.append('text').
      attr('class', 'axis-label').
      attr('y', 80).
      attr('x', innerWidth / 2).
      attr('fill', 'black').
      text(xAxisLabel)

    const lineGenerator = d3.line().
      x(d => xScale(xValue(d))).
      y(d => yScale(yValue(d))).
      curve(d3.curveBasis)

    const lastYValue = d => yValue(d[d.length - 1])

    const nested = d3.
      groups(data, d => d.city).
      sort((a, b) => d3.descending(lastYValue(a[1]), lastYValue(b[1])))

    colorScale.domain(nested.map(x => x[0]))

    g.selectAll('.line-path').
      data(nested).
      enter().
      append('path').
      attr('class', 'line-path').
      attr('d', d => lineGenerator(d[1])).
      attr('stroke', d => colorScale(d[0]))

    svg.append('text').
      attr('class', 'title').
      attr('x', width / 2).
      attr('y', 45).
      text(title)

    svg.append('g').
      attr('transform', `translate(790,121)`).
      call(colorLegend, {
        colorScale, circleRadius: 13, spacing: 30, textOffset: 15,
      })
  }

  d3.csv('data-canvas-sense-your-city-one-week.csv').then(data => {
    data.forEach(d => {
      d.temperature = +d.temperature
      d.timestamp = new Date(d.timestamp)
    })

    render(data)
  })
}(d3))