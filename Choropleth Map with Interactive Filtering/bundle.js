import { loadAndProcessData } from './loadAndProcessData.js'
import { colorLegend } from './colorLegend.js'
import { choroplethMap } from './choroplethMap.js'

(function (d3, topojson) {
  'use strict'

  const svg = d3.select('svg')

  const choroplethMapG = svg.append('g')
  const colorLegendG = svg.append('g').
    attr('transform', `translate(30,300)`)

  const colorScale = d3.scaleOrdinal()

  // const colorValue = d => d.properties.income_grp;
  const colorValue = d => d.properties.economy

  let selectedColorValue
  let features

  const onClick = d => {
    selectedColorValue = d
    render()
  }

  loadAndProcessData().then(countries => {
    features = countries.features
    render()
  })

  const render = () => {
    colorScale.
      domain(features.map(colorValue)).
      domain(colorScale.domain().sort().reverse()).
      range(d3.schemeSpectral[colorScale.domain().length])

    colorLegendG.call(colorLegend, {
      colorScale,
      circleRadius: 8,
      spacing: 20,
      textOffset: 12,
      backgroundRectWidth: 235,
      onClick,
      selectedColorValue,
    })

    choroplethMapG.call(choroplethMap, {
      features, colorScale, colorValue, selectedColorValue,
    })
  }

}(d3, topojson))
