// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultID = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let entries = Object.entries(resultID);
    for (let i = 0; i < entries.length; i++) {
      let [key, value] = entries[i];
      panel.append("h6").text(`${key}: ${value}`);
    };
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultID = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = resultID.otu_ids;
    let otu_labels = resultID.otu_labels;
    let sample_values = resultID.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Bluered',
        line: {
          color: 'black',
          width: 2
        }
      }
    };
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'}
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // keep the data together so it is sorted and sliced together
    let workingData = otu_ids.map((id, index)=> {
      return {
        id: `OTU ${id}`, 
        value: sample_values[index], 
        label: otu_labels[index]};
    });
    // Don't forget to slice and reverse the input data appropriately

    let sortSliceData = workingData.sort().slice(0,10).reverse();

    // Build a Bar Chart
 
    let barTrace = {
      x: sortSliceData.map(item => item.value),
      y: sortSliceData.map(item => item.id),
      text: sortSliceData.map(item => item.label),
      type: 'bar',
      orientation: 'h'
    }
    let barData = [barTrace];
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria'}
    }
    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout)
  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select('#selDataset')

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (i=0; i< names.length; i++) {
      dropdownMenu.append('option').text(names[i]).property('value', names[i]);
    };

    // Get the first sample from the list
    let initSample = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(initSample);
    buildCharts(initSample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard
init();
