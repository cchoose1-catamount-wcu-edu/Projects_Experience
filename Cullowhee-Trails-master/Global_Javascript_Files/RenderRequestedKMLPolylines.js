/*
* Author: Cavan Hoose
* Date: 2/3/15
* Description: Renders only the requested polylines
*/

var map;
var arrayOfRequestedItems = [];
var placemarkBool = [];
var systemName;
var RouteName;
var geoxml3Doc;
var arrayOfRequestedIndexes = [];




// This is the function that will be called from another page
/*
* Parameter: parSystemName (required): The name of the trail system subfolder (must also be the name of the KML file) :: Use getQueryString(qryCatTitle) to pass

* Parameter: parRouteName (required): The name of the .js file within the trail system subfolder :: Use getQueryString(qryRouteFile) to pass

* Parameter: parMap (required): The map constructed from another page
 */
function RenderRequestedKMLPolylines(parTitleName, parSystemName, parRouteName, parMap) {


    map = parMap;
    systemName = parSystemName;
    RouteName = parRouteName;

    getNeededItems(parTitleName, parSystemName, parRouteName);
}

//----------------------------GETTER FUNCTIONS-------------------------------------------
//use getter to return doc[0] object
function getGeoxml3Document() {
    return geoxml3Doc;
}

//use getter to return the indexes of the KML polylines of the requested route
function getArrayOfRequestedIndexes() {
    return arrayOfRequestedIndexes;
}
//------------------------------------------------------------------------------------------

function ShowMapWithPolylines() {

    if (map == undefined) {
        console.log("-----------------------------ERROR REPORT----------------------------------");
        console.log("ERROR: MAP IS UNDEFINED");
        console.log("You must call RenderRequestedKMLPolylines before this method.");
        console.log("These are the parameters you must pass to  RenderRequestedKMLPolylines:");
        console.log("Parameter 1 = Trail Type: This is the value of qryTrailType");
        console.log("Parameter 2 = System Name: This is the value of qryCatTitle");
        console.log("Parameter 3 = Route Name: This is the value of qryRouteFile");
        console.log("Parameter 4 = Map: You must first declare a map with CreateMap");
        console.log("-------------------------------------------------------------------------");

    }
    return map;
}

// ajax call for colors needed to display 
// initialize geoxml3 parser
function getNeededItems(parTitleName, parTrailSystemName, parRouteName) {

    var url = (decodeURI(parTitleName) + "/" + decodeURI(parTrailSystemName) + "/" + decodeURI(parRouteName) + ".js").split(" ").join("_");

       console.log("url: " + url);

    //Get an array of colors ex. [blue, green, blue-white-red]
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: cb_LoadListOfRequestedItems_Success,
        error: cb_LoadListOfRequestedItems_Error
    })

    //geoXML3 parser
    var myParser = new geoXML3.parser({ map: map, afterParse: cb_KMLDataParsed });
    myParser.parse('KML/' + decodeURI(parTrailSystemName).split(" ").join("_") + '.kml');
    console.dir(myParser);
    console.dir(myParser.options);
    console.dir(myParser.docs);
}

//assigns the array of colors to class level variable arrayOfRequestedItems[]
function cb_LoadListOfRequestedItems_Success(parListOfRequestedItems) {
    console.log("Inside cb_LoadListOfRequestedItems_Success() callback function");

    for(var i = 0; i < parListOfRequestedItems.length; i++){
        arrayOfRequestedItems[i] = parListOfRequestedItems[i].PolylineID;
    }

}

// If there is an error in loading TrackID
function cb_LoadListOfRequestedItems_Error(parListOfRequestedItems) {
    console.log("------------------------------------------");
    console.log("ERROR: Unable to load TrackID");
    console.log("------------------------------------------");
}

function cb_KMLDataParsed(doc) {
    geoxml3Doc = doc;

    var indexCounter = 0;

    /* For loop logic in order:
     * - Loop through the array of requested items
     * - Loop through the array of KML placemarks
     * - IF the name of the indicated placemark matches the name of the requested item,
           put "true" in placmarkID, else it is "false"
     * - Loop to next item in array of requested items
     */
    for (var i = 0; i < arrayOfRequestedItems.length; i++) {

        for (var j = 0; j < doc[0].placemarks.length; j++) {           
            if (placemarkBool[j] != true) {
                if (isRequested(arrayOfRequestedItems[i].toString(), doc[0].placemarks[j].name)) {
                    placemarkBool[j] = true;

                    arrayOfRequestedIndexes[indexCounter] = j;
                    indexCounter++;
                   
                } else {
                    placemarkBool[j] = false;

                    //console.log("----------------------------------------------");
                    //console.log("Information for debugging setmap");
                    //console.log("PlacemarkBool array number [" + j + "] is equal to: " + placemarkBool[j]);
                    //console.log("doc[0].placemarks[" + j + "].name is equal to: " + doc[0].placemarks[j].name);
                    //console.log("Requested color is: " + arrayOfRequestedItems[i]);
                    //console.log("This information is showing when evaluated to FALSE");
                    //console.log("----------------------------------------------");
                  //  doc[0].placemarks[j].polyline.setMap(null);   
                }
            }

        }
        
    }

    console.log("------------------------------------");
    console.log("Requested colors:" + arrayOfRequestedItems.toString());
    console.log("KML Bool of items to render:" + placemarkBool.toString());
    console.log("------------------------------------");

    // If the polyline was not requested (ie. is "false" in the placemarkBool array)
    // take it out of the map
    for (var i = 0; i < placemarkBool.length; i++) {
        if (placemarkBool[i] != true) {
            doc[0].placemarks[i].polyline.setMap(null);
        }
    }
}

// Returns true if the two parameters are equal to eachother
// Needed in double for loop
function isRequested(parRequestedItem, parKMLCompareItem) {
    if (parRequestedItem == parKMLCompareItem) {
        return true;
    }
    return false;
}



