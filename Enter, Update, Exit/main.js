(function bundle (d3) {

  const dataset = [15, 8, 42, 4], maxHeight = 100
  // Local variable for storing the index.
  const index = d3.local()

  // Updates the visualization
  function update () {

    // Update selection: Resize and position existing
    // DOM elements with data bound to them.
    const selection = d3.select('#chart').
      selectAll('.bar').
      data(dataset).
      each(function (d, i) {
        // Store index in local variable.
        index.set(this, i)
      })

    // Enter selection: Create new DOM elements for added
    // data items, resize and position them and attach a
    // mouse click handler.
    selection.enter().
      append('div').
      attr('class', 'bar').
      merge(selection).
      style('height', function (d) {
        return d
      }).
      style('margin-top', function (d) {
        return maxHeight - d
      }).
      on('click', function (event, d) {
        // Get index from local variable.
        dataset.splice(index.get(this), 1)
        update()
      })

    // Exit selection: Remove elements without data from the DOM
    selection.exit().remove()

    // Print underlying data array
    d3.select('#dataset').text(dataset)

  }

// Add a new datum to the set
  d3.select('#add-btn').on('click', function (e) {

    if (dataset.length < 10) dataset.push(
      Math.round(Math.random() * maxHeight))

    update()

  })

// Fire when DOM is available
  const domReady = function (callback) {
    document.readyState === 'interactive' || document.readyState === 'complete'
      ? callback()
      : document.addEventListener('DOMContentLoaded', callback)
  }

  domReady(function () {
    update()
  })
})(d3)