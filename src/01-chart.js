import * as d3 from 'd3'

let margin = { top: 0, left: 80, right: 20, bottom: 100 }

let height = 400 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let xPositionScale = d3
  .scaleLinear()
  .domain([0, 1000])
  .range([0, width])

let yPositionScale = d3
  .scaleBand()
  .range([height, 0])
  .padding(0.25)

d3.csv(require('./data/homicides.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // Calculate the homicide rate per 10,000 people
  datapoints.forEach(d => {
    d.rate_2017 = (d.homicides_2017 / d.population) * 10000
    d.rate_2016 = (d.homicides_2016 / d.population) * 10000
  })

  let cityNames = datapoints.map(d => d.city)
  yPositionScale.domain(cityNames)

  svg
    .selectAll('.city')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('class', 'city')
    .attr('x', 0)
    .attr('y', d => yPositionScale(d.city))
    .attr('height', yPositionScale.bandwidth())
    .attr('width', d => xPositionScale(d.homicides_2016))

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  let xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  // events
  d3.select('#step-homicides-2016').on('stepin', d => {
    xPositionScale.domain([0, 1000])
    svg
      .select('.x-axis')
      .transition()
      .call(xAxis)

    let sorted = datapoints.sort((a, b) => {
      return b.homicides_2016 - a.homicides_2016
    })
    let cityNames = datapoints.map(d => d.city)
    yPositionScale.domain(cityNames)
    svg
      .select('.y-axis')
      .transition()
      .call(yAxis)

    svg
      .selectAll('.city')
      .transition()
      .attr('y', d => yPositionScale(d.city))
      .attr('width', d => {
        return xPositionScale(d.homicides_2016)
      })
  })

  d3.select('#step-homicides-2017').on('stepin', d => {
    // update the x axis
    xPositionScale.domain([0, 1000])
    svg
      .select('.x-axis')
      .transition()
      .call(xAxis)

    // update the y axis
    let sorted = datapoints.sort((a, b) => b.homicides_2017 - a.homicides_2017)
    let cityNames = datapoints.map(d => d.city)
    yPositionScale.domain(cityNames)
    svg
      .select('.y-axis')
      .transition()
      .call(yAxis)

    svg
      .selectAll('.city')
      .transition()
      .attr('y', d => yPositionScale(d.city))
      .attr('width', d => xPositionScale(d.homicides_2017))
  })

  d3.select('#rate-2016').on('click', () => {
    xPositionScale.domain([0, 10])
    svg
      .select('.x-axis')
      .transition()
      .call(xAxis)

    svg
      .selectAll('.city')
      .transition()
      .attr('width', d => xPositionScale(d.rate_2016))
  })

  d3.select('#rate-2017').on('click', () => {
    xPositionScale.domain([0, 10])
    svg
      .select('.x-axis')
      .transition()
      .call(xAxis)

    svg
      .selectAll('.city')
      .transition()
      .attr('width', d => xPositionScale(d.rate_2017))
  })

  d3.select('#highlight-mass').on('click', () => {
    svg
      .selectAll('.city')
      .classed('highlighted', d => d.had_mass_shooting === 'yes')
  })

  d3.select('#toggle-mass').on('click', () => {
    // filter our data
    let filtered = datapoints.filter(d => d.had_mass_shooting === 'no')

    // remove the rects we don't want
    let rectangles = svg.selectAll('.city').data(filtered)
    rectangles.exit().remove()

    // update the y axis
    let cityNames = filtered.map(d => d.city)
    yPositionScale.domain(cityNames)
    svg
      .select('.y-axis')
      .transition()
      .call(yAxis)

    svg
      .selectAll('.city')
      .transition()
      .attr('y', d => yPositionScale(d.city))
      .attr('height', yPositionScale.bandwidth())
  })
}
