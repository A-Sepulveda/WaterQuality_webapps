var riskLookup={}
var selectedAnalyte='ca'

function filterChange(){
  console.log(minYear)
  console.log(selectedAnalyte)
  getMeanValues();
}

function getSiteRisk(){
  riskLookup={}
  queryResult.forEach(function(thisSite){
    var siteId=thisSite.siteid;
    var thisRisk=tempRisk(Number(thisSite.tempmean))
    if(selectedAnalyte=='ca'){
      riskLookup[siteId]={
          'risk':thisRisk,
          'value':Number(thisSite.camean),
          'temp':Number(thisSite.tempmean),
          'count':Number(thisSite.cacnt)
      }
    }
    if(selectedAnalyte=='ph'){
      riskLookup[siteId]={
          'risk':thisRisk,
          'value':Number(thisSite.phmean),
          'temp':Number(thisSite.tempmean),
          'count':Number(thisSite.phcnt)
      }
    }

  })
  filterRiskMapFeatures()
  buildLegend()
}

function tempRisk(d) {
    return d >= 12 ? 'high' :
           d >= 0  ? 'low' :
                      'na';
}

function hoverHandler(props){
  console.log(props)
  var hoverString=''
  hoverString+='<span class="hoverTitle">'+props.MonitoringLocationName+'</span><br>'
  hoverString+='<span class="hoverSubTitle italic">'+props.MonitoringLocationIdentifier+'</span><br>'
  if(props.value==-1){
    props.value='na'
  }
  if(selectedAnalyte=='ca'){
    hoverString+='<span class="hoverBody">Avg calcium: '+props.value+'</span><br>'
  }else{
    hoverString+='<span class="hoverBody">Avg ph: '+props.value+'</span><br>'
  }
  hoverString+='<span class="hoverBody">Avg temp: '+props.temp+'</span><br>'
  hoverString+='<span class="hoverBody">Total observations: '+props.count+'</span>'
  $('#hoverInfoBox').html(hoverString)
}

$(document).ready(function() {
  // dataPrep();
  getDateRange();
});
