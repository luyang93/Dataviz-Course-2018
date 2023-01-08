(function (d3) {
  'use strict'

  const sales = [
    { product: 'Hoodie', count: 12 },
    { product: 'Jacket', count: 7 },
    { product: 'Snuggie', count: 6 }]

  const pie = d3.pie().value(function (d) { return d.count })

  const slices = pie(sales)

  const arc = d3.arc().innerRadius(50).outerRadius(100)

  // helper that returns a color based on an ID
  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const svg = d3.select('svg')
  const g = svg.append('g').attr('transform', 'translate(200, 200)')

  g.selectAll('path.slice').
    data(slices).
    enter().
    append('path').
    attr('class', 'slice').
    attr('d', arc).
    attr('fill', function (d) {
      return color(d.data.product)
    })

  // building a legend is as simple as binding
  // more elements to the same data. in this case,
  // <text> tags
  svg.append('g').
    attr('class', 'legend').
    selectAll('text').
    data(slices).
    enter().
    append('text').
    text(function (d) {
      return '• ' + d.data.product
    }).
    attr('fill', function (d) {
      return color(d.data.product)
    }).
    attr('y', function (d, i) {
      return 20 * (i + 1)
    })
}(d3))
