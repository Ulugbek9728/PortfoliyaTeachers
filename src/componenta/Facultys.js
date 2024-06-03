//Including react
import React, {Component} from "react";


//Including the fusioncharts library
import FusionCharts from "fusioncharts/core";

//Including the chart type
import Pie3D from "fusioncharts/viz/pie3d";

//Import ReactFC
import ReactFC from "react-fusioncharts";

//Including the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

//Adding the chart as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Pie3D, FusionTheme);

//Creating the JSON object to store the chart configurations

const chartConfigs = {
    type: "pie3d", // The chart type
    width: "100%", // Width of the chart
    height: "700", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
        // Chart Configuration
        chart: {
            caption: "",
            subcaption: "Last year",
            xaxisname: "Flavor",
            yaxisname: "Amount (In USD)",
            numberprefix: "%",
            theme: "fusion",
            rotateValues: "0"
        },
        data: [
            {
                label: "Elektr energetika fakulteti",
                value: "810000",
            },
            {
                label: "Muhandislik texnologiyalari fakulteti",
                value: "620000",
            },
            {
                label: "Geologiya-qidiruv va kon-metallurgiya fakulteti",
                value: "350000",
            },
            {
                label: "Neft va gaz fakulteti",
                value: "410000",
            },
            {
                label: "Issiqlik energetikasi fakulteti",
                value: "620000",
            },
            {
                label: "Mashinasozlik fakulteti",
                value: "810000",
            },
            {
                label: "Elektronika va avtomatika fakulteti",
                value: "620000",
            },
            {
                label: "Mexanika fakulteti",
                value: "350000",
                color:"e06602"
            }

        ],

    }
};


// Step 9 - Creating the DOM element to pass the react-fusioncharts component
export default class Facultys extends React.Component {
    render() {
        return <ReactFC {...chartConfigs} style={{    backgroundColor:"#e5e9f4"}} />;
    }
}