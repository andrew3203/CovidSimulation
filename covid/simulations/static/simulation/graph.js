let regions = undefined;
let $result = undefined;


$(document).ready(function() {
	$result = $('#search_box-result');

	$('#search').on('keyup', function(){
		let search = $(this).val();
		let res = '' +
			'<div class="search_result">\n' +
				'\t\t\t<table>\n';
		let f = false;
		if ((search !== '') && (search.length >= 1)){
			regions.forEach(reg=>{
				if(reg.indexOf(search) >= 0 && reg.indexOf(search) <= 2){
					res += '' +
						'<tr>\n' +
						'\t\t\<td class="search_result-name">\n' +
						'\t\t\t<a href="#" onclick="sendResp(this)" >'+ reg + '</a>\n' +
						'\t\t</td>\n' +
						'\</tr>';
					f = true;
				}

			});
			res += '</table>\n' +'</div>';
			$result.html(res);
			f ? $result.fadeIn() : $result.fadeOut(100);
		 } else {
			$result.html('');
			$result.fadeOut(100);
		 }
	});

});

function sendResp(element) {
	console.log($(element).text());
	$result.html('');
	$result.fadeOut(100);
	plot($(element).text())
}

function plot(name) {
    $(document).ready(function() {
        $('#hist').html('');
        $('#region_name').text(name);
        $('#search').val('');
    });
    $.ajax({
        type: "GET",
        url: 'http://127.0.0.1:8000/get_hist_data/',
        dataType: 'json',
        data: {'search': name},
        success: function(json_data){
            am4core.ready(function() {

                am4core.useTheme(am4themes_animated);

                let chart = am4core.create("hist", am4charts.XYChart);

                let data = [];

                let driving = json_data['driving'];
                let walking = json_data['walking'];
                driving.forEach(point =>{
                    let date = new Date(point.date);
                    data.push({
                        date1: date,
                        value1: point.value,
                    });
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

}


$.ajax({
    url: 'http://127.0.0.1:8000/get_all_regions/',
    dataType: 'json',
    success: function (json_data) {
        regions = json_data;
    }
});

plot("Moscow");


