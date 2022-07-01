
//creates a dropdown menu of ID numbers dynamically
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.js").then((data) => {
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
  d3.json("samples.js").then((data) => {
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
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function. 
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.js").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;   //console.log(sampleArr);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var resultItem = resultSample[0];

    // Create a variable that holds the first sample in the metadata array.
    var resultMeta= metaData[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds =resultItem.otu_ids
    var otuLabels = resultItem.otu_labels
    var sampleValues = resultItem.sample_values

    // 3. Create a variable that holds the washing frequency.
    var washingF = parseFloat(resultMeta.wfreq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
   
    var yticks = otuIds.slice(0,10).map(otuIds=>`OTU ${otuIds}`).reverse();
    
    // 8. Create the trace for the bar chart. (orientation: "h")
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type : "bar",
      orientation: "h",
      text: otuLabels,
      marker: {
      color: 'rgb(196, 126, 120)' //(212, 120, 112) or rosybrown
    }}];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
       title: "Top 10 Bacteria Cultures Found",

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      type: "scatter",
      mode: "markers",
      text: otuLabels,
      marker: {
        color:  otuIds,
        size: sampleValues
      }

    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
       title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margins: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      height: 600,
      hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    
    // Deliverable 3 Create Gauge Chart
    var gaugeData = [{
      value: washingF,
      title:"Scrubs Per Week",
      type: "indicator",
      mode:  "gauge+number",
      gauge:{
        axis: { range: [0, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 11], color: "green" }
        ],
        threshold: {
          //line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }}

    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {'text': "Belly Button Washing Frequency", 'font':{'size':20}},
      width: 500,
      height: 400,
      margin: { t: 100, b: 0 } 
    }; //

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}



