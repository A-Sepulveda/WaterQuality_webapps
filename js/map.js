mapboxgl.accessToken = 'pk.eyJ1Ijoid3N1LWZwbSIsImEiOiJjanF5Mnpkd2ExbmxlM3htajh0cTRvNTE5In0.fVraCn9k7D9ncy49QtKXRQ';

function mapInits(){
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-110.748,43.299],
    zoom: 6.5
  });

  map.on('style.load', function () {
    map.addSource("markers", {
        "type": "geojson",
        "data": siteLocations
    });

    map.addLayer({
        "id": "sites",
        "interactive": true,
        "type": "circle",
        "source": "markers",
        "paint": {
            'circle-color': caStyle,
            "circle-stroke-color":"#1d2a60",
            // "circle-radius":6,
            'circle-radius': [
              'match',
              ['get', 'risk'],
              'na', 4,
              'high', 10,
              'low', 10,
              /* other */ 4
              ],
            "circle-stroke-width":0.5,
            "circle-color-transition": {
              "duration": 750,
              "delay": 0
            }
        }
    });

    map.on('mouseenter', 'sites', function(e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      hoverHandler(e.features[0].properties)
      $('#hoverInfoBox').show()
    });

    map.on('click', 'sites', function(e) {
      // Change the cursor style as a UI indicator.
      console.log(e.features[0].properties.MonitoringLocationIdentifier)
      clickedSite=e.features[0].properties.MonitoringLocationIdentifier

    });

    map.on('mouseleave', 'sites', function() {
      map.getCanvas().style.cursor = '';
      $('#hoverInfoBox').hide()
    });
  });
}

function filterRiskMapFeatures(){
  siteLocationsTemp={
    "type": "FeatureCollection",
    "features": []
  };
  siteLocations.features.forEach(function(thisSite){
    var tempSite=thisSite
    var siteId=tempSite.properties.MonitoringLocationIdentifier
    if(riskLookup[siteId]){
      tempSite.properties.risk=riskLookup[siteId]['risk']
      tempSite.properties.value=riskLookup[siteId]['value']
      tempSite.properties.temp=riskLookup[siteId]['temp']
      tempSite.properties.count=riskLookup[siteId]['count']
    }else{
      tempSite.properties.risk='na'
      tempSite.properties.value=-1
      tempSite.properties.temp='na'
      tempSite.properties.count='na'
    }
    if(tempSite.properties.risk=='high'){
      siteLocationsTemp.features.push(tempSite)
    }else{
      siteLocationsTemp.features.unshift(tempSite)
    }
  })
  updateSitesDataSource();
}

function updateSitesDataSource(){
  map.getSource('markers').setData(siteLocationsTemp);
  updateSelectedRiskSites()
}


function updateSelectedRiskSites(){
  filter=['all',['in','risk'].concat(selectedRiskValues)]
  map.setFilter('sites', filter)
  if(selectedAnalyte=='ca'){
      map.setPaintProperty('sites','circle-color',caStyle)
  }else{
      map.setPaintProperty('sites','circle-color',phStyle)
  }
}

var caStyle=[
  'interpolate',
  ['linear'],
  ['get', 'value'],
  -1, '#7a7a7a',
  0, '#5f64c8',
  10, '#232ac9',
  20, '#53c923',
  30, '#c9c823',
  40, '#c95a23',
  50, '#c92323'
  ]

var phStyle=[
  'interpolate',
  ['linear'],
  ['get', 'value'],
  -1, '#7a7a7a',
  0, '#5f64c8',
  6, '#232ac9',
  7, '#53c923',
  8, '#c9c823',
  9, '#c95a23',
  10, '#c92323'
  ]





// function filterMapFeatures(){
//   // checkdates
//   // var sitesFiltered=[]
//   //
//   // $.each(Object.keys(resultsData),function(i,thisSite){
//   //   if(new Date(resultsData[thisSite].minDate).getYear()+1900>=minYear){
//   //     sitesFiltered.push(thisSite)
//   //   }
//   // })
//   //
//   //
//   // filter=['all',['in','MonitoringLocationIdentifier'].concat(sitesFiltered)]
//
//   // var filteredSites=filterGeojson(sitesFiltered)
//
//   // map.fitBounds(turf.bbox(filteredSites),{
//   //   padding:20
//   // })
//   //
//   // map.setFilter('sites', filter)
// }
//
// function filterGeojson(sitesFiltered){
//   var filteredSites=siteLocations;
//   var newFeatures=[]
//   filteredSites.features.forEach(function(thisSite){
//     if(sitesFiltered.indexOf(thisSite.properties.MonitoringLocationIdentifier) > -1){
//       newFeatures.push(thisSite)
//     }
//   })
//   filteredSites.features=newFeatures
//   return(filteredSites)
// }
