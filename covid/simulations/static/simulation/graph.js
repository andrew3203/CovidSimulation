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
            am4core.ready(function() {
                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                let chart = am4core.create("hist", am4charts.XYChart);

                let data = [];

                RESPONSE.forEach(point =>{
                    let date = new Date(point.date);
                    data.push({date:date, value: point.data});
                });


                chart.data = data;

                // Create axes
                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.minGridDistance = 60;

                let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

                // Create series
                let series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = "value";
                series.dataFields.dateX = "date";
                series.tooltipText = "{value}";

                series.tooltip.pointerOrientation = "vertical";

                chart.cursor = new am4charts.XYCursor();
                chart.cursor.snapToSeries = series;
                chart.cursor.xAxis = dateAxis;

                //chart.scrollbarY = new am4core.Scrollbar();
                chart.scrollbarX = new am4core.Scrollbar();


}); // end am4core.ready()
        }

    });
