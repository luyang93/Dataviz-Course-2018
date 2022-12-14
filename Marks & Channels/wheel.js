/* global d3 */

// This stateless component renders a static "wheel" made of circles,
// and rotates it depending on the value of props.angle.
const wheel = d3.component('g').create(function (selection) {
  const minRadius = 4
  const maxRadius = 10
  const numDots = 10
  const wheelRadius = 40
  const rotation = 0
  const rotationIncrement = 3

  const radius = d3.scaleLinear().
    domain([0, numDots - 1]).
    range([maxRadius, minRadius])

  const angle = d3.scaleLinear().domain([0, numDots]).range([0, Math.PI * 2])

  selection.selectAll('circle').
    data(d3.range(numDots)).
    enter().
    append('circle').
    attr('cx', d => Math.sin(angle(d)) * wheelRadius).
    attr('cy', d => Math.cos(angle(d)) * wheelRadius).
    attr('r', radius)
}).render(function (selection, d) {
  selection.attr('transform', `rotate(${d})`)
})
