export const loadAndProcessData = () => Promise.all([
  d3.csv('data.csv'),
  d3.json('https://cdn.jsdelivr.net/npm/visionscarto-world-atlas@0.0.4/world/50m.json')]).
    then(([unData, topoJSONdata]) => {
      const rowById = unData.reduce((accumulator, d) => {
        accumulator[d['Country code']] = d;
        return accumulator;
      }, {});

      const countries = topojson.feature(topoJSONdata,
          topoJSONdata.objects.countries);

      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[+d.id]);
      });

      const featuresWithPopulation = countries.
          features.
          filter(d => d.properties['2018']).
          map(d => {
            d.properties['2018'] = +d.properties['2018'].replace(/ /g, '') *
                1000;
            return d;
          });

      return {
        features: countries.features, featuresWithPopulation,
      };
    });
