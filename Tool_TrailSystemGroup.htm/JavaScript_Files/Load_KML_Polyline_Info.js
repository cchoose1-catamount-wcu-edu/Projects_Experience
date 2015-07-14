var map;
var globalKMLItems = [];
var globalCheckboxArray = [];
var globalDoc = [];
var globalcheckedValuesArray = [];


$(document).ready(function () {
    $("#divPanelCheckbox").hide(); // On page load hide the checkbox 
    $("#divHeader").html("KML View Tool");
    console.log("Inside ready function");
    //Draw the screen
    FillDropDownList();
    $("#butSubmitDropDownList").on("click", function () {
        getSelectedDropDownItem();
        $("#divPanelCheckbox").show();
        $("#divPanelDropDownList").hide();
    });
    $("#butBackToDropDownList").on("click", function () {
        location.reload();
    });
    $("#butSubmitCheckbox").on("click", function () {
        console.log("Button Click for checkboxes has been clicked!");
        getInfoFromCheckboxes(globalCheckboxArray, globalDoc);   
    });
});

function FillDropDownList() { // Getting trial segments from a JSON data file  

        //Read JSON file
        $.ajax({
            type: "GET",
            url: "JavaScript_Files/JSON_KML.js",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: cb_LoadData_Success,
            error: cb_LoadData_Error
        });
        console.log("Inside fill ddl");
    }

    //----------------------------------------------------------------
    // Name:  cb_LoadData_Success
    // Description: Callback function that runs after the retrieval of the JSON
    // data via the Ajax request
    //----------------------------------------------------------------
    function cb_LoadData_Success(parRetrievedData) { // Filling the html drop down list 
        var arrayOfDDLItems = parRetrievedData;
        var DDLhtml = '<select id="DDLKMLItems"> \n';
        var viewHTMLMarkupInConsole = DDLhtml;
        var consoleCounter = 0;

        for (var value in arrayOfDDLItems) { // Creating an html drop down option for every object in the url: JSON_KML.js 
            if (value == consoleCounter) {
                DDLhtml += '<option value="' + arrayOfDDLItems[value].KMLFileName + '">' + arrayOfDDLItems[value].KMLTitle + '</option>';
                viewHTMLMarkupInConsole += '<option value="' + arrayOfDDLItems[value].KMLFileName + '">' + arrayOfDDLItems[value].KMLTitle + '</option> \n';
                consoleCounter++;
            }
        }
        DDLhtml += "</select>";
        viewHTMLMarkupInConsole += "</select>";
        console.log("html Markup for drop down list: \n" + viewHTMLMarkupInConsole);
        $("#divDropDownList").append(DDLhtml);
    }

    //----------------------------------------------------------------
    // Name:  cb_LoadData_Error
    //----------------------------------------------------------------
    function cb_LoadData_Error(parRetrievedData) {
        /// <summary>
        /// call back error function
        /// </summary>
        /// <param name="parRetrievedData">Retrieved Data</param>
        console.log("ERROR LOADING JSON DATA");
    }

    function getSelectedDropDownItem() { // Getting the vaule the user selected from the drop down list, then creating a map 

        var selected = $("#DDLKMLItems").val();
        $("#divHeader").html("Viewing trails in " + selected);
        map = CreateMap(35.306164, -83.20862); 
        console.log("Selected Item " + selected);       
        //geoXML3 parser
        var myParser = new geoXML3.parser({ map: map, afterParse: cb_KMLDataParsed }); // Getting KML file 
        myParser.parse("KML/"+selected);
        console.dir(myParser);
        console.dir(myParser.options);
        console.dir(myParser.docs);   
    }

    function cb_KMLDataParsed(doc) { // Getting the segments from the KML file 

        //set all polylines to null since no checkboxes will be checked at this time
        for (var i = 0; i < doc[0].placemarks.length; i++) {         
            doc[0].placemarks[i].polyline.setMap(null);
        }

        console.log("-----This is only a test!-----");
        console.log("The coordinate of the zeroth place is: " + JSON.stringify(doc[0].placemarks[0].LineString[0].coordinates[0]));
        console.log("------------------------------");

        globalDoc = doc; 
        var arrayOfKMLItems = [];
        console.log("cb_KMLDataParsed inside ");
        console.log("Placemark Lenth " + doc[0].placemarks.length);
        console.log("First coord: " +  JSON.stringify(doc[0].placemarks[0].LineString[0].coordinates[0]));



        for (var i = 0; i < doc[0].placemarks.length; i++) {
            arrayOfKMLItems[i] = doc[0].placemarks[i].name;
        }

        globalKMLItems = arrayOfKMLItems;
        renderCheckboxes(globalKMLItems);
    }
    function renderCheckboxes(parArrayofCheckboxNames) { // Creating the checkboxes for each segment 
        console.log("Length of Global KMl Items" + parArrayofCheckboxNames.length);
        var arrayOfCheckboxNames = parArrayofCheckboxNames;
        var arrayOfCheckboxIDs =[];

        for (var i = 0; i < arrayOfCheckboxNames.length; i++) { // Creating the id for each checkbox 
            arrayOfCheckboxIDs[i] = "Checkbox_" + (i + 1);
        }

        for (var value in arrayOfCheckboxIDs) { // Creating the html checkbox for each segment in the KML file 
            var checkbox = '<input type="checkbox" id="' + arrayOfCheckboxIDs[value] + '" />' + arrayOfCheckboxNames[value] + '<br />';
            console.log("html Markup for checkbox " + value + ": " + checkbox);
            $("#divCheckbox").append(checkbox);
        }
        globalCheckboxArray = arrayOfCheckboxIDs;        
    }

    function getInfoFromCheckboxes(parFilledGlobalCheckboxArray,parGlobalDoc) { // Seeing if the checkbox is true of false(checked or not checked) 
        var checkboxArray = parFilledGlobalCheckboxArray;
        var checkedValuesArray = [];
        var counter = 0;
        var doc = parGlobalDoc; 

        for (var i = 0; i < checkboxArray.length; i++) { // Looping through each checkbox looking for true(checked) 
            if ($('#' + checkboxArray[i]).prop('checked')) {
                checkedValuesArray[counter] = doc[0].placemarks[i].name; // Setting the name of postiton of that array 
                counter++; 
            }
            console.log(checkboxArray[i] + " is checked: " + $('#' + checkboxArray[i]).prop('checked'));
        }

        globalcheckedValuesArray = checkedValuesArray;
        rendorMapInfo(); 
    }

    function rendorMapInfo() {
        console.log("---------Map in rendorMapInfo()--------");
        console.dir(map);
        console.log("GlobalCheckedValesArray: " + globalcheckedValuesArray.toString());
        console.log("------------------------------------");
        map = RenderRequestedItems(globalcheckedValuesArray, globalDoc, map);
        google.maps.event.trigger(map, 'resize');
    }
    
