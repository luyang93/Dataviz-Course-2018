(function (d3) {
  'use strict'
  const svg = d3.select('#population')

  const width = +svg.attr('width')
  const height = +svg.attr('height')

  const render = data => {
    const title = 'World Population'

    const xValue = d => d.year
    const xAxisLabel = 'Time'

    const yValue = d => d.population
    const yAxisLabel = 'Population'

    const margin = { top: 60, right: 40, bottom: 88, left: 105 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xScale = d3.scaleTime().
      domain(d3.extent(data, xValue)).
      range([0, innerWidth]).
      nice()

    const yScale = d3.scaleLinear().
      domain([0, d3.max(data, yValue)]).
      range([innerHeight, 0]).
      nice()

    const g = svg.append('g').
      attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xAxis = d3.axisBottom(xScale).
      ticks(6).
      tickSize(-innerHeight).
      tickPadding(15)

    const yAixTickFormat = number => d3.format('.1s')(number).
      replace('G', 'B')

    const yAxis = d3.axisLeft(yScale).
      tickSize(-innerWidth).
      tickPadding(10).
      tickFormat(yAixTickFormat)

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

    const areaGenerator = d3.area().
      x(d => xScale(xValue(d))).
      y0(innerHeight).
      y1(d => yScale(yValue(d))).
      curve(d3.curveBasis)

    g.append('path').
      attr('class', 'area-path').
      attr('d', areaGenerator(data))

    svg.append('text').
      attr('class', 'title').
      attr('x', width / 2).
      attr('y', 45).
      text(title)
  }

  d3.csv('world-population-by-year-2015.csv').then(data => {
    data.forEach(d => {
      d.population = +d.population
      d.year = new Date(d.year)
    })

    render(data)
  })
}(d3))