// To use scrollytelling, we need to install this package here:
//    https://github.com/russellgoldenberg/enter-view
// Parcel might do it for you, or you can just use
//    npm install enter-view

import enterView from 'enter-view'
import * as d3 from 'd3'

// If this module changes, refresh the ENTIRE page
if (module.hot) {
  module.hot.accept(() => window.location.reload())
}

enterView({
  selector: '.step',
  offset: 0.75,
  enter: function(element) {
    // Highlight it (just for the demo)
    element.classList.add('entered')

    // What are we entering?
    console.log('entered', element.getAttribute('id'))

    // Fire an event through d3
    d3.select(element).dispatch('stepin')
  },
  exit: function(element) {
    // Highlight it (just for the demo)
    element.classList.remove('entered')

    // What are we exiting?
    console.log('exited', element.getAttribute('id'))

    // Fire an event through d3
    d3.select(element).dispatch('stepout')
  }
})
