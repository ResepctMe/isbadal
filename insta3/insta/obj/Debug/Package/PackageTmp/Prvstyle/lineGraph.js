/*
 
    SixDos - onLoad.js
 
    Script for load functions.
 
*/

/// <reference path = "mainControls.js" />




/*
Summary
 Loads up line graph.
Params
 Start date and time, count array and total count paramenters
Returns
 line graph in UI.
*/
function chart(startYear, startMonth, startDay, startHour, startMinute, chartTitle, intsAsJSArray, totalCount) {
    var originalFrom = $("#fromDateBox").val();
    var originalUntil = $("#untilDateBox").val();

    Highcharts.setOptions({
        global: {
            timezoneOffset: get_time_zone_offset(), // set offset server
            useUTC: false
        }
    });
    $('#chartDiv').highcharts({

        chart: {

            zoomType: 'x',
            spacingRight: 20
        },
        title: {
            text: chartTitle + "<br>" + "Total Count: " + totalCount // set title
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                      'Click and drag in the plot area to zoom in' :
                      'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            minTickInterval: 3600 * 1000,
            maxZoom: 3600 * 1000,
            title: {
                text: 'datetime'
            },
            events: {

                setExtremes: function (event) { // extremes are used for the pinching of the graph to set the start and end points


                    var datefrom = new Date(event.min);
                    var dateto = new Date(event.max);

                    if (event.min != null) {


                        var day = datefrom.getDate();
                        var month = datefrom.getMonth() + 1; //Months are zero based
                        var year = datefrom.getFullYear();
                        var hour = datefrom.getHours(); // - offSet; 

                        var min = datefrom.getMinutes();

                        if (day < 10)
                            day = "0" + day;
                        if (month < 10)
                            month = "0" + month;
                        if (hour < 10)
                            hour = "0" + hour;
                        if (min < 10)
                            min = "0" + min;


                        if (IsInUSTimezone()) {
                            datefrom = month + "/" + day + "/" + year + " " + hour + ":" + min;
                            $("#fromDateBox").datetimepicker({ dateFormat: 'mm/dd/yy' }).val(datefrom);
                        } else {
                            datefrom = day + "/" + month + "/" + year + " " + hour + ":" + min;
                            $("#fromDateBox").datetimepicker({ dateFormat: 'dd/mm/yy' }).val(datefrom);
                        }


                    }
                    else {

                        $("#fromDateBox").val(originalFrom);
                    }
                    if (event.max != null) {


                        var dayT = dateto.getDate();
                        var monthT = dateto.getMonth() + 1; //Months are zero based
                        var yearT = dateto.getFullYear();
                        var hourT = dateto.getHours(); // - offSet;

                        var minT = dateto.getMinutes();

                        if (dayT < 10)
                            dayT = "0" + dayT;
                        if (monthT < 10)
                            monthT = "0" + monthT;
                        if (hourT < 10)
                            hourT = "0" + hourT;
                        if (minT < 10)
                            minT = "0" + minT;


                        //var newTimePeriod = ProcessDateTime(dateto, 'local', true);


                        if (IsInUSTimezone()) {
                            dateto = monthT + "/" + dayT + "/" + yearT + " " + hourT + ":" + minT;
                            $("#untilDateBox").datetimepicker({ dateFormat: 'mm/dd/yy' }).val(dateto);
                        } else {
                            dateto = dayT + "/" + monthT + "/" + yearT + " " + hourT + ":" + minT;
                            $("#untilDateBox").datetimepicker({ dateFormat: 'dd/mm/yy' }).val(dateto);
                        }


                    }
                    else {

                        $("#untilDateBox").val(originalUntil);
                    }

                }

            }

        },
        yAxis: {
            title: {
                text: 'Count'
            }
        },
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {

                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                              [0, Highcharts.getOptions().colors[0]],
                              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function (e) {

                        }
                    }
                },
                marker: {
                    lineWidth: 1
                }
            }
        },

        series: [{
            type: 'area',
            name: 'Count:',
            pointInterval: 3600 * 1000,
            pointStart: Date.UTC(startYear, startMonth, startDay, startHour, startMinute), // sets series and data

            data: intsAsJSArray

        }]
    });

};