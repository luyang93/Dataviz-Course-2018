export const loadAndProcessData = () => Promise.all([
  d3.tsv('https://cdn.jsdelivr.net/npm/world-atlas@1.1.4/world/50m.tsv'),
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@1.1.4/world/50m.json')]).
  then(([tsvData, topoJSONdata]) => {
    const rowById = tsvData.reduce((accumulator, d) => {
      // Use d.name for title
      // Use d.iso_n3 for id
      accumulator[d.iso_n3] = d
      return accumulator
    }, {})

    // const countryName = {};
    // tsvData.forEach(d => {
    //   countryName[d.iso_n3] = d.name;
    // });

    const countries = topojson.feature(topoJSONdata,
      topoJSONdata.objects.countries)

    countries.features.forEach(d => {
      Object.assign(d.properties, rowById[d.id])
    })

    return countries
  })
