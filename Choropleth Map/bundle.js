import { loadAndProcessData } from './loadAndProcessData.js'
import { colorLegend } from './colorLegend.js'

(function (d3, topojson) {
  'use strict'

  const svg = d3.select('svg')

  const projection = d3.geoNaturalEarth1()
  const pathGenerator = d3.geoPath().projection(projection)

  const g = svg.
    append('g')

  const colorLegendG = svg.
    append('g').
    attr('transform', `translate(30,300)`)

  g.
    append('path').
    attr('class', 'sphere').
    attr('d', pathGenerator({ type: 'Sphere' }))

  svg.
    call(d3.zoom().on('zoom', function (event, d) {
      g.attr('transform', event.transform)
    }))

  const colorScale = d3.scaleOrdinal()
  const colorValue = d => d.properties.economy

  loadAndProcessData().then(countries => {

    colorScale.
      domain(countries.features.map(colorValue)).
      domain(colorScale.domain().sort().reverse()).
      range(d3.schemeSpectral[colorScale.domain().length])

    colorLegendG.
      call(colorLegend, {
        colorScale,
        circleRadius: 8,
        spacing: 20,
        textOffset: 12,
        backgroundRectWidth: 235,
      })

    g.
      selectAll('path').
      data(countries.features).
      enter().
      append('path').
      attr('class', 'country').
      attr('d', pathGenerator).
      attr('fill', d => colorScale(colorValue(d))).
      append('title').
      text(d => d.properties.name + ': ' + colorValue(d))
  })
}(d3, topojson))
