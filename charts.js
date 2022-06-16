function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").append("b").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {


    // Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var selectedSample = samplesArray[0];

    // Create a variable that holds the first sample in the metadata array.
    var selectedMeta = metaArray[0]


    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = selectedSample.otu_ids;
    var otuLabels = selectedSample.otu_labels;
    var sampleValues = selectedSample.sample_values;

    // Create a variable that holds the washing frequency.
    var wfreq = selectedMeta.wfreq;

    // Create the yticks for the bar chart.
    var yticks = otuIDs.slice(0,10).map(id => "OTU " + id).reverse();

    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: 'h'
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        yanchor: 'center',
        text: 'The bar chart displays the top 10 bacterial species (OTUs)<br>with the number of samples found in your belly button',
        showarrow: false
      }]
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});
  
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      mode: "markers",
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Portland"
      }
    }];
  
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID", automargin: true},
      yaxis: {automargin: true},
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: .5,
        xanchor: 'center',
        y: -.5,
        yanchor: 'center',
        text: 'The bubble chart displays the all the bacterial species (OTUs)<br>with the number of samples found in your belly button',
        showarrow: false
      }]
    };
  
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}); 
  
    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { 
          range: [null, 10],
          tickmode: "array",
          tickvals: [0,2,4,6,8,10],
          ticktext: [0,2,4,6,8,10]
        },
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange"},
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }]
      }    
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      autosize: true,
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "The gauge displays your belly button weekly washing frequency",
        showarrow: false
      }]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  
  });
}

