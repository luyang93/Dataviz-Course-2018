(function(d3) {
  'use strict';

  function computeYears(rawData) {
    const allYearsSet = new Set();
    rawData.forEach(function(d) {
      d.values.forEach(function(d) {
        allYearsSet.add(d.key);
      });
    });
    const yearsExtent = d3.extent(
        Array.from(allYearsSet).map(function(yearStr) {
          return +yearStr;
        }));
    return d3.range(yearsExtent[0], yearsExtent[1] + 1).map(function(year) {
      return new Date(year + '');
    });
  }

  const bisectDate = d3.bisector(function(d) {
    return d.date;
  }).left;

  function getInterpolatedValue(values, date, value) {
    const i = bisectDate(values, date, 0, values.length - 1);
    if (i > 0) {
      const a = values[i - 1];
      const b = values[i];
      const t = (date - a.date) / (b.date - a.date);
      return value(a) * (1 - t) + value(b) * t;
    }
    return value(values[i]);
  }

  // Interpolate values, create data structure
  // for d3.stack.
  function interpolateValues(years, rawData) {
    const value = function(d) {
      return d.value;
    };
    return years.map(function(date) {
      // Create a new row object with the date.
      const row = {
        date: date,
      };

      // Assign values to the new row object for each key.
      // Value for `key` here will be country name.
      rawData.forEach(function(d) {
        row[d.key] = getInterpolatedValue(d.values, date, value);
      });

      return row;
    });
  }

  d3.json('sumByCountryByYear.json').then(rawData => {
    // Parse dates, extract keys.
    const keys = rawData.filter(function(d) {
      const sum = d3.sum(d.values, function(d) {
        return d.value;
      });
      return sum > 1000000;
    }).map(function(d) {
      d.values.forEach(function(d) {
        d.date = new Date(d.key);
      });
      return d.key;
    });

    // Compute interpolated values for all years.
    const data = interpolateValues(computeYears(rawData), rawData);

    render(data, keys);
  });

  const margin = {
    top: 0, bottom: 30, left: 0, right: 18,
  };

  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const g = svg.append('g').
      attr('transform', `translate(${margin.left},${margin.top})`);
  const xAxisG = g.append('g').attr('class', 'axis');
  const xAxisMinorG = xAxisG.append('g').attr('class', 'axis axis--minor');
  const xAxisMajorG = xAxisG.append('g').attr('class', 'axis axis--major');
  const marksG = g.append('g');

  const stack = d3.stack().
      offset(d3.stackOffsetWiggle).
      order(d3.stackOrderInsideOut);
  const xValue = function(d) {
    return d.date;
  };
  const xScale = d3.scaleTime();
  const yScale = d3.scaleLinear();
  const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

  const xAxisMajor = d3.axisBottom().scale(xScale);
  const xAxisMinor = d3.axisBottom().scale(xScale).ticks(50);

  const area = d3.area().
      x((d) => xScale(xValue(d.data))).
      y0((d) => yScale(d[0])).
      y1((d) => yScale(d[1])).
      curve(d3.curveBasis);

  // Render StreamGraph
  function render(data, keys) {
    stack.keys(keys);
    const stacked = stack(data);

    const innerWidth = width - margin.right - margin.left;
    const innerHeight = height - margin.top - margin.bottom;

    xScale.domain(d3.extent(data, xValue)).range([0, innerWidth]);

    yScale.domain([
      d3.min(stacked, function(series) {
        return d3.min(series, function(d) {
          return d[0];
        });
      }), d3.max(stacked, function(series) {
        return d3.max(series, function(d) {
          return d[1];
        });
      })]).range([innerHeight, 0]);

    colorScale.domain(d3.range(keys.length));

    const paths = marksG.selectAll('path').data(stacked);
    const pathsEnter = paths.enter().append('path');
    pathsEnter.merge(paths).attr('fill', function(d) {
      return colorScale(d.index);
    }).attr('stroke', function(d) {
      return colorScale(d.index);
    }).attr('d', area);

    paths.select('title').merge(pathsEnter.append('title')).text(function(d) {
      return d.key;
    });

    const labels = marksG.selectAll('text').data(stacked);
    labels.enter().
        append('text').
        attr('class', 'area-label').
        merge(labels).
        text(function(d) {
          return d.key;
        }).
        attr('transform', d3.areaLabel(area).interpolateResolution(1000));

    xAxisMajor.tickSize(-innerHeight);
    xAxisMinor.tickSize(-innerHeight);

    xAxisG.attr('transform', `translate(0,${innerHeight})`);
    xAxisMajorG.call(xAxisMajor);
    xAxisMinorG.call(xAxisMinor);
  }
}(d3));