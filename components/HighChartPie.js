import ChartView from 'react-native-highcharts';
import React from "react";
import {
    StyleSheet,
    View,
} from 'react-native';
import Layout from '../constants/Layout';
import Colors from "../constants/Colors";

export class HighChartPie extends React.Component {
    render() {
        var Highcharts = 'Highcharts';

        var configGiven = {
            credits: false,

            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                width: Layout.window.width,
                height: Layout.window.width/1.5,
            },
            title: {
                text: 'Given',
                align: 'center',
                verticalAlign: 'middle',
                y: 0,
                x: -Layout.window.width/2+40,
            },
            tooltip: {
                enabled: false,
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance:20,
                        style: {
                            fontWeight: 'bold',
                            color: 'black',
                        }
                    },
                    startAngle: 180,
                    endAngle: 359,
                    center: ['50%', '50%']
                }
            },
            series: [{
                events: {
                    legendItemClick: function (e) {
                        e.preventDefault();
                    }
                },
                animation: false,
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: [
                    ['Firefox',   10.38],
                    ['IE',       56.33],
                    ['Chrome', 24.03],
                    ['Safari',    4.77],
                    ['Opera',     0.91],
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.2,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }]
        };

        var configReceived = {
            credits: false,

            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                width: Layout.window.width,
                height: Layout.window.width/1.5,
            },
            title: {
                text: 'Received',
                align: 'center',
                verticalAlign: 'middle',
                y: 0,
                x: -Layout.window.width-40,
            },
            tooltip: {
                enabled: false,
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance:20,
                        style: {
                            fontWeight: 'bold',
                            color: 'black',
                        }
                    },
                    startAngle: 0,
                    endAngle: 180,
                    center: ['50%', '50%']
                }
            },
            series: [{
                events: {
                    legendItemClick: function (e) {
                        e.preventDefault();
                    }
                },
                animation: false,
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: [
                    ['Firefox',   10.38],
                    ['IE',       56.33],
                    ['Chrome', 24.03],
                    ['Safari',    4.77],
                    ['Opera',     0.91],
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.2,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }]
        };

        const options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };

        return (
            <View style={styles.container}>
                <ChartView style={styles.chart} config={configGiven} options={options}></ChartView>
                <ChartView style={styles.chart} config={configReceived} options={options}></ChartView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        // width: Layout.window.width,
        // height: Layout.window.width/1.5,
        // position: 'relative',
    },
    chart: {
        width: Layout.window.width,
        height: Layout.window.width/1.5,
        // position: 'absolute',
        // top: 0,
    },
});