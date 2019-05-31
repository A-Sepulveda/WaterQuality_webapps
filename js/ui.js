var selectedRiskValues=["na", "low", "moderate", "high", "veryHigh"]

function uiInits(){

  minYear=1900+minDate.getYear()
  maxYear=1900+maxDate.getYear()

  var yearSpread=[...Array(maxYear-minYear+1)].map((_, i) => i + minYear)

  yearSpread.forEach(function(year) {
    // console.log(year);
    if(year==minYear){
      $('#yearsDropdown').append("<option value="+year+" selected>"+year+"</option>")
    }else{
      $('#yearsDropdown').append("<option value="+year+">"+year+"</option>")
    }
  });
  $('#yearsDropdown').formSelect()
  filterChange();

  $('#riskDropdown').formSelect()
  $('#riskDropdown').change(function(){
    selectedRiskValues=$(this).val()
    updateSelectedRiskSites()
  })


  $('#yearsDropdown').change(function(){
    minYear=$(this).val()
    // console.log(minYear);
    // filterMapFeatures();
    filterChange();
  })

  $('.indicatorSelector').change(function(){
    // console.log($(this).val())
    selectedAnalyte=$(this).val()
    filterChange()
  })

  mapInits();
  buildLegend()
}

$(document).on('mousemove', function(e){
      $('#hoverInfoBox').css({
         left:  e.pageX+10,
         top:   e.pageY+10
      });
  });


var caRamp=[['NA', '#7a7a7a'],[0, '#5f64c8'],[10, '#232ac9'],[20, '#53c923'],[30, '#c9c823'],[40, '#c95a23'],[50, '#c92323']]
var phRamp=[['NA', '#7a7a7a'],[0, '#5f64c8'],[6, '#232ac9'],[7, '#53c923'],[8, '#c9c823'],[9, '#c95a23'],[10, '#c92323']]

function buildLegend(){
  $('#legendBody').empty();
  if(selectedAnalyte=='ca'){
    thisRamp=caRamp
    $('#legendBody').append('<span>Avg Calcium (mg/l)</span>')
  }else{
    thisRamp=phRamp
    $('#legendBody').append('<span>Avg pH</span>')
  }
  $.each(thisRamp,function(i,item){
    console.log(item)
    if(i==0){
      $('#legendBody').append('<div class="legendRow"><svg height="30" width="30"><circle cx="15" cy="15" r="15" stroke="" stroke-width="3" fill="'+item[1]+'"/></svg><span class="legendText"> '+item[0]+'</span></div>')
    }
    if(i>0 && i < thisRamp.length-1){
      $('#legendBody').append('<div class="legendRow"><svg height="30" width="30"><circle cx="15" cy="15" r="15" stroke="" stroke-width="3" fill="'+item[1]+'"/></svg><span class="legendText">'+item[0]+'-'+thisRamp[i+1][0]+'</span></div>')
    }
    if(i >= thisRamp.length-1){
      $('#legendBody').append('<div class="legendRow"><svg height="30" width="30"><circle cx="15" cy="15" r="15" stroke="" stroke-width="3" fill="'+item[1]+'"/></svg><span class="legendText">> '+item[0]+'</span></div>')
    }
    // $('#legendBody').append()
    // $('#legendBody').append('<div class="legendRow"><svg height="30" width="30"><circle cx="15" cy="15" r="15" stroke="" stroke-width="3" fill="'+item[1]+'"/></svg><span class="legendText"> '+item[0]+'</span></div>')


    // $('#legendBody').append('<span class="legendText">doggggg</span><br>')
  })
}
