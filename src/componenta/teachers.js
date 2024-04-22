//Including react
import React, {Component} from "react";


//Including the fusioncharts library
import FusionCharts from "fusioncharts/core";

//Including the chart type
import Scrollstackedbar2d from "fusioncharts/viz/scrollstackedbar2d";

//Import ReactFC
import ReactFC from "react-fusioncharts";

//Including the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

function Teachers(props) {
    ReactFC.fcRoot(FusionCharts,Scrollstackedbar2d, FusionTheme);


    const chartConfigs = {
        type: "scrollstackedbar2d", // The chart type
        width: "100%", // Width of the chart
        height: "700", // Height of the chart
        dataFormat: "json", // Data type
        dataSource: {
            chart: {
                theme: "fusion",
                numVisiblePlot: "5",

                numbersuffix: "",
                plottooltext: "<b>$seriesName</b><hr>$label: <b>$dataValue</b>"
            },
            categories: [
                {
                    category: [
                        {
                            label: "Djumayeva Shahlo Elmurotovna"
                        },
                        {
                            label: "Nurmatov Obid Yoqubboyevich"
                        },
                        {
                            label: "DUNGBOYEV SHUHRAT ISMATOVICH"
                        },
                        {
                            label: "Mirzabekov Sherzot Muytanboyevich"
                        },

                    ]
                }
            ],
            dataSet: [
                {
                    seriesName: "North America",
                    data: [
                        {
                            value: "41.49"
                        },
                        {
                            value: "29.08"
                        },
                        {
                            value: "15.85"
                        },
                        {
                            value: "15.75"
                        }
                    ]
                },
                {
                    seriesName: "Europe ",
                    data: [
                        {
                            value: "29.02"
                        },
                        {
                            value: "3.58"
                        },
                        {
                            value: "12.88"
                        },
                        {
                            value: "11.01"
                        },
                    ]
                },
                {
                    seriesName: "Japan",
                    data: [
                        {
                            value: "3.77"
                        },
                        {
                            value: "6.81"
                        },
                        {
                            value: "3.79"
                        },
                        {
                            value: "3.28"
                        },
                    ]
                },
                {
                    seriesName: " Rest of the world",
                    data: [
                        {
                            value: "8.46"
                        },
                        {
                            value: "0.77"
                        },
                        {
                            value: "3.31"
                        },
                        {
                            value: "2.96"
                        },
                    ]
                }
            ]

        }
    };


    return (
        <ReactFC {...chartConfigs} />
    );
}

export default Teachers;