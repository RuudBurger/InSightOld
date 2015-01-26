define([
    'react', 'js/router_helper'
], function(
    React, ReactRouter
){

    return React.createClass({
        mixins: [ ReactRouter.State ],

        componentDidMount: function(){
            var self = this;


            // Don't load movies if they're already loaded
            if(!self.props.dashboard)
                App.request('dashboard', {
                    'success': function(json){
                        self.props.dashboard = json.dashboard;
                        self.setState({}); // Re-render
                    }
                });
            else {

                var db = self.props.dashboard;

                requirejs(['highcharts', 'highcharts-more', 'highcharts-gauge'], function(
                    Highcharts, HighchartsMore, HighchartsGauge
                ){
                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });

                    $('#usage').highcharts({
                        credits: {
                            enabled: false
                        },
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Energy usage'
                        },
                        xAxis: {
                            type: 'datetime'
                        },
                        yAxis: {
                            title: {
                                text: 'Usage in W'
                            },
                            min: 0
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            area: {
                                marker: {
                                    radius: 2
                                },
                                lineWidth: .5,
                                states: {
                                    hover: {
                                        lineWidth: .5
                                    }
                                },
                                threshold: null
                            }
                        },

                        series: [{
                            type: 'area',
                            name: 'Watt',
                            pointInterval: 60 * 1000,
                            pointStart: db.timestamps[0] * 1000,
                            data: db.usage
                        }]
                    });

                    var high = Math.round((db.elec_high[db.elec_high.length-1] - db.elec_high[0])*1000)/1000,
                        low = Math.round((db.elec_low[db.elec_low.length-1] - db.elec_low[0])*1000)/1000;

                    $('#high_low').highcharts({

                        credits: {
                            enabled: false
                        },
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: 0,
                            plotShadow: false
                        },
                        title: {
                            text: 'Verbruik<br /> laatste 24u',
                            align: 'center',
                            verticalAlign: 'middle',
                            y: 100
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: true,
                                    distance: -50,
                                    style: {
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textShadow: '0px 1px 2px black'
                                    },
                                    format: '<b>{point.name}</b>: {point.y}'
                                },
                                startAngle: -90,
                                endAngle: 90,
                                center: ['50%', '75%']
                            }
                        },
                        series: [{
                            animation: false,
                            type: 'pie',
                            name: 'Usage',
                            innerSize: '50%',
                            data: [
                                ['High', high],
                                ['Low', low]
                            ]
                        }]
                    });

                    // The speed gauge
                    $('#current_usage').highcharts({

                        chart: {
                            type: 'solidgauge'
                        },

                        title: null,

                        pane: {
                            center: ['50%', '72%'],
                            size: '100%',
                            startAngle: -90,
                            endAngle: 90,
                            background: {
                                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                                innerRadius: '60%',
                                outerRadius: '100%',
                                shape: 'arc'
                            }
                        },

                        tooltip: {
                            enabled: false
                        },

                        // the value axis
                        yAxis: {
                            stops: [
                                [0.1, '#55BF3B'], // green
                                [0.5, '#DDDF0D'], // yellow
                                [0.9, '#DF5353'] // red
                            ],
                            lineWidth: 0,
                            minorTickInterval: null,
                            tickPixelInterval: 400,
                            tickWidth: 0,
                            title: {
                                y: -70,
                                text: 'Watt'
                            },
                            labels: {
                                y: 16
                            },
                            min: 0,
                            max: 2500
                        },

                        plotOptions: {
                            solidgauge: {
                                dataLabels: {
                                    y: 5,
                                    borderWidth: 0,
                                    useHTML: true
                                }
                            }
                        },

                        credits: {
                            enabled: false
                        },

                        series: [{
                            name: 'Watt',
                            data: [db.usage[db.usage.length-1]],
                            dataLabels: {
                                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                '<span style="font-size:12px;color:silver">Watt</span></div>'
                            },
                            tooltip: {
                                valueSuffix: ' Watt'
                            }
                        }]
                    });

                    setInterval(function () {
                        App.request('current_usage', {
                            'success': function(json){
                                var point = $('#current_usage').highcharts().series[0].points[0];
                                point.update(json.current_usage.usage);
                            }
                        });
                    }, 5000);


                    $('#gas_usage').highcharts({
                        credits: {
                            enabled: false
                        },
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Gas usage'
                        },
                        xAxis: {
                            type: 'datetime'
                        },
                        yAxis: {
                            title: {
                                text: 'Usage in m3'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            area: {
                                marker: {
                                    radius: 2
                                },
                                lineWidth: .5,
                                states: {
                                    hover: {
                                        lineWidth: .5
                                    }
                                },
                                threshold: null
                            }
                        },

                        series: [{
                            type: 'area',
                            name: 'm3',
                            pointInterval: 60 * 1000,
                            pointStart: db.timestamps[0] * 1000,
                            data: db.gas
                        }]
                    });

                });

            }

        },

        render: function(){

            return (
                <div className="dashboard">
                    <div className="current electricity" id="current_usage"></div>
                    <div className="high_low electricity" id="high_low"></div>
                    <div className="last_24h electricity" id="usage"></div>
                    <div className="last_24h gas" id="gas_usage"></div>
                </div>
            )
        }
    });

});
