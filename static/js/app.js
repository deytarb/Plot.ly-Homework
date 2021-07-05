
function Initiate() {
    var DropDownSelection = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        data.names.forEach((name) => {
            DropDownSelection.append("option").text(name);
        });
        demographics(data.names[0]);
        plots(data.names[0]);
    });
};

Initiate();

function optionChanged(id) {
    demographics(id)
    plots(id)
};

//Demographic table 
function demographics(id) {
    d3.json("samples.json").then((data) => {
        var demoInfo = d3.select("#sample-metadata")
        var filtered = data.metadata.filter(object => object.id.toString() == id)[0];
        demoInfo.html("")
        Object.entries(filtered).forEach(([key, value]) => {
            demoInfo.append("h6").text(`${key}: ${value}`);
        });
    });
};

//Filters
function plots(id) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var samplesArray = samples.filter(object => object.id == id)[0];
        var metadata = data.metadata;
        var metadataArray = metadata.filter(object => object.id == id)[0];
        var valuesArray = samplesArray.sample_values.slice(0,9).reverse();
        var OTUidsArray = samplesArray.otu_ids.slice(0,10).reverse();
        var OTUlabelsArray = samplesArray.otu_labels.slice(0,10).reverse();
        var ValueBubble = samplesArray.sample_values;
        var IDsBubble = samplesArray.otu_ids;
        var LabelsBubble = samplesArray.otu_labels;

        var OTUs = OTUidsArray.map((num) => "OTU" + num);


//Charts 1Bar, 2Gauge, 3Bubbles

        //1
        var trace1 = {
            type: "bar",
            orientation: "h",
            x: valuesArray,
            y: OTUs,
            text: OTUlabelsArray,
            marker: {
                color: "38ACEC"
            }
        };

        var barLayout = {
            title: "Top Ten OTU's in Test Subject's Navel",
            xaxis: {
            
            },
            yaxis: {
            
            }
        };

        var barChart = [trace1];

        Plotly.newPlot("bar", barChart, barLayout);

        //2
        var trace2 = {
            x: IDsBubble,
            y:ValueBubble,
            text: LabelsBubble,
            type: "bubble",
            mode: "markers",
            marker: {
                color: ['RGB(92,180,170', 'RGB(93, 164, 254)', 'RGB(247, 122, 155)',  'RGB(181, 162, 65)', 'rgb(0, 185, 169)', 'rgb(150,134,54)'],
                size: ValueBubble
            }
        };

        var bubbleLayout = {
            title: 'Bacteria Cultures per Sample',
            xaxis: {title: 'OTU ID'},
            
        };

        var bubbleChart = [trace2];

        Plotly.newPlot("bubble", bubbleChart, bubbleLayout);

        //3
        var trace3 = {
            value: metadataArray.wfreq,
            title: {
                text: "Belly Button Washing Frequency <br> Scrubs Per Week",
            },
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {range: [0,9]},
                bar: {color: "#808000", thickness: 0.425},
                steps: [
                    {range: [0,1], color: "#43C6DB"},
                    {range: [1,2], color: "#00CED1"},
                    {range: [2,3], color: "#43BFC7"},
                    {range: [3,4], color: "#20B2AA"},
                    {range: [4,5], color: "#3EA99F"},
                    {range: [5,6], color: "#5F9EA0"},
                    {range: [6,7], color: "#3B9C9C"},
                    {range: [7,8], color: "#008B8B"},
                    {range: [8,9], color: "#045F5F"}
                ]
            }
        };

        var gaugeChart = [trace3];

        Plotly.newPlot("gauge", gaugeChart)

    });
};