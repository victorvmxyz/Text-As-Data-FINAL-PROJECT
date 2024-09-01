// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  documentLoader();
  statsLoader();
  // Event listener for sel1 change
function selectHand(event) {
    var visible_mary = document.querySelectorAll('[hand="#MWS"]');
    var visible_percy = document.querySelectorAll('[hand="#PBS"]');

    var MaryArray = Array.from(visible_mary);
    var PercyArray = Array.from(visible_percy);

    console.log("Selected Value: " + event.target.value);

    if (event.target.value === 'both') {
        MaryArray.forEach(function(element) {
            element.style.color = 'black';
        });
        PercyArray.forEach(function(element) {
            element.style.color = 'black';
        });
    } else if (event.target.value === 'Mary') {
        MaryArray.forEach(function(element) {
            element.style.color = 'blue';
        });
        PercyArray.forEach(function(element) {
            element.style.color = 'black';
        });
    } else if (event.target.value === 'Percy') {
        PercyArray.forEach(function(element) {
            element.style.color = 'green';
        });
        MaryArray.forEach(function(element) {
            element.style.color = 'black';
        });
    }
}

// write another function that will toggle the display of the deletions by clicking on a button
function toggleDeletions() {
    var deletions= document.querySelectorAll('del');
    deletions.forEach(function(element) {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display='inline';
        } else {
            element.style.display='none'
        }
    }
document.getElementById('toggleDeletionsButton').addEventListener('click', toggleDeletions);

// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline //
//function displayAsReadingText() {
//    var deletions = document.querySelectorAll('del');
 //   deletions.forEach(function(delElement) {
   //     delElement.remove();
    //});
    //var additions = document.querySelectorAll('add');
    //additions.forEach(function(addElement) {
      //  addElement.style.textDecoration = 'none';
        //addElement.style.fontStyle = 'normal';
        //addElement.style.display = 'inline';
    //});
//}

//document.getElementById('showReadingTextButton').addEventListener('click', displayAsReadingText);

//document.getElementById('viewSelector').addEventListener('change', function(event) {
//    if (event.target.value === 'reading') {
//        displayAsReadingText();
//    }
// I tried adding this line to the HTML which worked but it removed the text and picture, so that is about as close as i got
//<button id="showReadingTextButton">Display Reading Text</button>
//    <select id="viewSelector">
//      <option value="default">Default View</option>
//      <option value="reading">Display Reading Text</option>
//    </select>
