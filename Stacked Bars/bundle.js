(function (d3) {
  'use strict'

  const sales = [
    { date: '2014-01-01', hoodies: 6, jackets: 2, snuggies: 3 },
    { date: '2014-01-02', hoodies: 7, jackets: 5, snuggies: 2 },
    { date: '2014-01-03', hoodies: 8, jackets: 7, snuggies: 3 }]

  const stack = d3.
    stack().
    keys(['hoodies', 'jackets', 'snuggies'])

  const stacked = stack(sales)

  const svg = d3.select('svg')
  const width = 600
  const height = 400

  // we need to calculate the maximum y-value
  // across all our layers, so we find the biggest
  // end value
  const maxY = d3.max(stacked, function (d) {
    return d3.max(d, function (d) {
      return d[1]
    })
  })

  const y = d3.
    scaleLinear().
    range([height, 0]).
    domain([0, maxY])

  const x = d3.
    scaleTime().
    range([0, width]).
    domain(d3.extent(sales, function (d) {
      return new Date(Date.parse(d.date))
    })).
    nice(4)

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  // bind a <g> tag for each layer
  const layers = svg.
    selectAll('g.layer').
    data(stacked, function (d) {
      return d.key
    }).
    enter().
    append('g').
    attr('class', 'layer').
    attr('fill', function (d) {
      return color(d.key)
    })

  // bind a <rect> to each value inside the layer
  layers.
    selectAll('rect').
    data(function (d) {
      return d
    }).
    enter().
    append('rect').
    attr('x', function (d) {
      return x(new Date(Date.parse(d.data.date)))
    }).
    attr('width', width / 3).
    attr('y', function (d) {
      // remember that SVG is y-down while our graph is y-up!
      // here, we set the top-left of this bar segment to the
      // larger value of the pair
      return y(d[1])
    }).
    attr('height', function (d) {
      // since we are drawing our bar from the top downwards,
      // the length of the bar is the distance between our points
      return y(d[0]) - y(d[1])
    })
}(d3))
