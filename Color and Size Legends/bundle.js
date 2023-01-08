import { colorLegend } from './colorLegend.js'
import { sizeLegend } from './sizeLegend.js'

(function (d3) {
  'use strict'

  const svg = d3.select('svg')
  const height = +svg.attr('height')

  const colorScale = d3.scaleOrdinal().
    domain(['apple', 'lemon', 'lime', 'orange']).
    range(['#c11d1d', '#eae600', 'green', 'orange'])

  svg.append('g').
    attr('transform', `translate(100,150)`).
    call(colorLegend, {
      colorScale, circleRadius: 30, spacing: 80, textOffset: 40,
    })

  const sizeScale = d3.scaleSqrt().domain([0, 10]).range([0, 50])

  svg.append('g').
    attr('transform', `translate(400,100)`).
    call(sizeLegend, {
      sizeScale,
      spacing: 100,
      textOffset: 10,
      numTicks: 5,
      circleFill: 'rgba(0,0,0,0.5)',
    })
}(d3))
