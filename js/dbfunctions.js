function wqquery(){
  $('#loader').show()
  axios.get('https://gappadus.services/postgres/', {
    params: {
      type:'waterquality',
      queryString: 'select * from waterquality;'
    }
  }).then(function (result) {
    $('#loader').hide()
    console.log(result.data);
  }).catch(function (error) {
    $('#loader').hide()
    console.log("error:", error);
  });
}

function getMeanValues(){
  $('#loader').show();
  if(selectedAnalyte=='ca'){
    var queryString='SELECT siteid, AVG (camean) AS camean, AVG (tempmean) AS tempmean, SUM (cacnt) AS cacnt FROM waterquality WHERE tempmean IS NOT NULL and camean IS NOT NULL AND EXTRACT(MONTH FROM date) in (6,7,8,9) AND EXTRACT(YEAR FROM date) >= '+minYear+' GROUP BY siteid;'
    // var queryString='SELECT siteid, AVG (camean) AS camean, AVG (tempmean) AS tempmean FROM waterquality WHERE camean IS NOT NULL AND EXTRACT(MONTH FROM date) in (6,7,8,9) AND EXTRACT(YEAR FROM date) >= '+minYear+' GROUP BY siteid;'
  }
  if(selectedAnalyte=='ph'){
    var queryString='SELECT siteid, AVG (phmean) AS phmean, AVG (tempmean) AS tempmean, SUM (phcnt) AS phcnt FROM waterquality WHERE tempmean IS NOT NULL and phmean IS NOT NULL AND EXTRACT(MONTH FROM date) in (6,7,8,9) AND EXTRACT(YEAR FROM date) >= '+minYear+' GROUP BY siteid;'
  }
  axios.get('https://gappadus.services/postgres/', {
    params: {
      type:'waterquality',
      queryString: queryString
    }
  }).then(function (result) {
    $('#loader').hide()
    queryResult=result.data.result;
    getSiteRisk()
  }).catch(function (error) {
    $('#loader').hide()
    console.log("error:", error);
  });
}

function getDateRange(){
  $('#loader').show()
  axios.get('https://gappadus.services/postgres/', {
    params: {
      type:'waterquality',
      queryString: 'select MIN(date) as mindate, MAX(date) as maxdate from waterquality;'
    }
  }).then(function (result) {
    $('#loader').hide()
    minMaxDates=result.data;
    maxDate=new Date(minMaxDates.result[0].maxdate)
    minDate=new Date(minMaxDates.result[0].mindate)
    uiInits();
  }).catch(function (error) {
    $('#loader').hide()
    console.log("error:", error);
  });
}
