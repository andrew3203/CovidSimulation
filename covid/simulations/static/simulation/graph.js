let RESPONSE = undefined;
$(document).ready(function() {
    $('#plot').click(function () {

    });


});


$.ajax({
        url: 'http://127.0.0.1:8000/get_hist_data/',
        dataType: 'json',
        success: function(json_data){
            RESPONSE = json_data;
            console.log(RESPONSE);
            am4core.ready(function() {

                am4core.useTheme(am4themes_animated);

                let chart = am4core.create("hist", am4charts.XYChart);

                let data = [];

                let driving = RESPONSE['driving'];
                let walking = RESPONSE['walking'];
                driving.forEach(point =>{
                    let date = new Date(point.date);
                    data.push({
                        date1: date,
                        value1: point.value,
                    });
                    console.log(point.value);
                });
                walking.forEach(point =>{
                    let date = new Date(point.date);
                    data.push({
                        date2: date,
                        value2: point.value,
                    });
                });



                chart.data = data;

                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.title.text = "Date";
                dateAxis.renderer.grid.template.location = 0;
                dateAxis.renderer.labels.template.fill = am4core.color("#1d110d");


                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.title.text = "Percent";
                valueAxis.tooltip.disabled = true;
                valueAxis.renderer.labels.template.fill = am4core.color("#1d110d");
                valueAxis.renderer.labels.template.adapter.add("text", function(text) {
                  return text + "%";
                });
                valueAxis.renderer.minWidth = 60;


                var series = chart.series.push(new am4charts.LineSeries());
                series.name = "driving";
                series.dataFields.dateX = "date1";
                series.dataFields.valueY = "value1";
                series.tooltipText = "{valueY.value}";
                series.fill = am4core.color("#e59165");
                series.stroke = am4core.color("#e59165");

                var series2 = chart.series.push(new am4charts.LineSeries());
                series2.name = "walking";
                series2.dataFields.dateX = "date2";
                series2.dataFields.valueY = "value2";
                series2.tooltipText = "{valueY.value}";
                series2.fill = am4core.color("#dfcc64");
                series2.stroke = am4core.color("#dfcc64");

                chart.cursor = new am4charts.XYCursor();
                chart.cursor.xAxis = dateAxis;

                var scrollbarX = new am4charts.XYChartScrollbar();
                scrollbarX.series.push(series);
                chart.scrollbarX = scrollbarX;

                chart.legend = new am4charts.Legend();
                chart.legend.parent = chart.plotContainer;
                chart.legend.zIndex = 100;

                dateAxis.renderer.grid.template.strokeOpacity = 0.07;
                valueAxis.renderer.grid.template.strokeOpacity = 0.07;
        });
 }
});

