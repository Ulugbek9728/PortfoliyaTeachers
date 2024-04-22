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

function Kaferdras(props) {
    ReactFC.fcRoot(FusionCharts,Pie3D, FusionTheme);


    const chartConfigs = {
        type: "pie3d", // The chart type
        width: "100%", // Width of the chart
        height: "700", // Height of the chart
        dataFormat: "json", // Data type
        dataSource: {
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
                    label: "kafedra test",
                    value: "810000",
                    link: "/kafedra/1"
                },
                {
                    label: "kafedra 2",
                    value: "620000",
                    link: "/123"
                },
                {
                    label: "kafedra 3",
                    value: "350000",
                },
                {
                    label: "kafedra 4",
                    value: "410000",
                },
                {
                    label: "kafedra 5",
                    value: "620000",

                },
                {
                    label: "kafedra 6",
                    value: "810000",

                },
                {
                    label: "kafedra 7",
                    value: "620000",

                },
                {
                    label: "kafedra 8",
                    value: "350000",
                    color:"e06602"
                }

            ],

        }
    };


    return (
     <ReactFC {...chartConfigs} />
    );
}

export default Kaferdras;


