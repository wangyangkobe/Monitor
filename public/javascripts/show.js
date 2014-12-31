/**
 * Created by elqstux on 2014/12/26.
 */
$(function () {
    var i = 1, chart;

    $('#container').highcharts({
        title: {
            text: "Socket.io - System Monitor",
            style: {
                color: "#ff0000"
            }
        },
        chart: {
            type: 'spline',
            animation: Highcharts.svg,
            marginRight: 10
        },
        xAxis: {
            maxPadding: 0.05,
            minPadding: 0.05,
            type: 'datetime',
            tickWidth: 3
        },
        yAxis: {
            title: {
                text: 'Percent(%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        series: [{
            name: 'CPU',
            data: [
            ]
        }, {
            name: 'Memory',
            data: []
        }]
    });
    chart = $('#container').highcharts();
});