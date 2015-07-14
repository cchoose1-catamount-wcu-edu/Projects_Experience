/*
* Author: Cavan Hoose
* Date: 3/1/15
* Description: Renders only the requested polylines
*/

var map;
var arrayOfRequestedItems = [];
var placemarkBool = [];


// This is the function that will be called from another page
/*
* Parameter: parSystemName (required): The name of the trail system subfolder (must also be the name of the KML file) :: Use getQueryString(qryCatTitle) to pass

* Parameter: parRouteName (required): The name of the .js file within the trail system subfolder :: Use getQueryString(qryRouteFile) to pass

* Parameter: parMap (required): The map constructed from another page
 */
function RenderRequestedItems(parRequestedItemsArray, doc, parMap) {
    map = parMap;

    for (var i = 0; i < doc[0].placemarks.length; i++) {         //set all polylines to map to allow checkboxes
        doc[0].placemarks[i].polyline.setMap(map);
    }


    getNeededItems(parRequestedItemsArray, doc);
    return map;
}

// ajax call for colors needed to display 
// initialize geoxml3 parser
function getNeededItems(parRequestedItemsArray, doc) {

    for (var i = 0; i < parRequestedItemsArray.length; i++) {
        arrayOfRequestedItems[i] = parRequestedItemsArray[i];
    }
    KMLDataParsed(doc);

}

function KMLDataParsed(doc) {

    //loop through all undefined elements and put false placeholder
    for (var i = 0; i < doc[0].placemarks.length; i++) { 
        if (arrayOfRequestedItems[i] == undefined) {
            placemarkBool[i] = false;
        }
    }


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
                   
                } else {
                   
                    placemarkBool[j] = false;
                    
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

    //erase all data from arrays for next button click
    while (arrayOfRequestedItems.length) { arrayOfRequestedItems.pop() }; 
    while (placemarkBool.length) { placemarkBool.pop() };


}

// Returns true if the two parameters are equal to eachother
// Needed in double for loop
function isRequested(parRequestedItem, parKMLCompareItem) {
    if (parRequestedItem == parKMLCompareItem) {
        return true;
    }

    return false;
}

