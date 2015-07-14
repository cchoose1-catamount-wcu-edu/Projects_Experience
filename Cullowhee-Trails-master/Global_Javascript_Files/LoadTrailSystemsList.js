//--------------------------------------------------------------------
//Program: Cullowhee Trails - mountainBiking.js
//Programmers: Thanh Tram, Cavan Hoose
//Date: 11/15/2013
//Description: Javascript file for the mountainBiking.html page
//--------------------------------------------------------------------
var systemURL;
var system = decodeURI(getQuerystring("qryTrailType")).split(" ").join("_");

$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.pushStateEnabled = false;
});

//--------------------------------------------------------------------
// Name:  documentReady function
// Description: Get the current Category List
//--------------------------------------------------------------------

$(document).ready(function () {
   
    systemURL = "System_Lists/System_" + system + ".js";

    console.log("System URL: " + systemURL);
    getListOfSystems();
});

//--------------------------------------------------------------------
// Name:  getListOfTours function
// Description: Get data from the Data_POI.js file
//--------------------------------------------------------------------
function getListOfSystems() {
    $.ajax({
        type: "GET",
        url: systemURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success_GetCategoryList_CallbackFunction,
        error: error_GetCategoryList_CallbackFunction
    });
}

//--------------------------------------------------------------------
// Name:  Ajax Callbacks
//--------------------------------------------------------------------

//----------------------------------------------------------------
// Name:  success_GetCategoryList_CallbackFunction
// Description: Function that runs after the retrieval of the JSON
// object via the Ajax request
//----------------------------------------------------------------
function success_GetCategoryList_CallbackFunction(parRetrievedData) {

    var sortedArray = parRetrievedData;

    //   sortedArray = sortArrayByTitle(parRetrievedData);

    //Display sorted array
    displayArray(sortedArray);
}

//----------------------------------------------------------------
// Name:  error_GetCategoryListt_CallbackFunction
// Description: Function that runs after the failure to retrieve 
// of the JSON object via the Ajax request
//----------------------------------------------------------------
function error_GetCategoryList_CallbackFunction(parXMLHttpRequestObject) {

    //If the info can not be used from the Data_POI.js file, display an error
    alert("Unable to reach server. Please try again later.");
}

//--------------------------------------------------------------------
// Name: sortArrayByTitle
// Description: Sorts the array by the Titles of the POIs
//(NOTE: This was taken out so that Promotions would stay that the top of 
//the Index List...as per request from client)
//--------------------------------------------------------------------
//function sortArrayByTitle(parArrayToSort) {

//    //Sort the array by distance from the user
//    var sortedArray = parArrayToSort.sort(
//                        function (a, b) {
//                            var firstCategory = a.CategoryName.toLowerCase;
//                            var secondCategory = b.CategoryName.toLowerCase;
//                            if (firstCategory < secondCategory) { return -1 }
//                            if (firstCategory > secondCategory) { return 1 }
//                            return 0;
//                        }
//     );
//    return sortedArray;
//}

//--------------------------------------------------------------------
// Name: displayArray
// Description: Display the locations by distance from the user
//(if available), or by title (if not available)
//--------------------------------------------------------------------
function displayArray(parArray) {

    //Local variables
    var arrayIndex = 0;
    var display = "";
    var trailType = getQuerystring("qryTrailType");
    //Loop through the array to assign object properties to local variables
    while (arrayIndex < parArray.length) {
        var catCode = parArray[arrayIndex].CategoryCode;
        console.log("catCode =" + catCode);

        var catTitle = parArray[arrayIndex].CategoryName;
        console.log("catTitle =" + catTitle);

        console.log("system: " + system);

        if (system == "Routes") {
            display += '<li id="' + catTitle.replace(/\s+/g, '') + '" ><a href="routeList.html?' + 'qryTrailType=' + trailType + '&qryCatCode=' + catCode + '&qryCatTitle=' + catTitle + '" rel="external">' +
                '<span>' + catTitle + "</span></a></li>";
            console.log("display =" + display);
        } else if (system == "Walking_Jogging") {
            display += '<li id="' + catTitle.replace(/\s+/g, '') + '" ><a href="poiList.html?' + 'qryTrailType=' + trailType + '&qryCatCode=' + catCode + '&qryCatTitle=' + catTitle + '" rel="external">' +
                '<span>' + catTitle + "</span></a></li>";
        }
        else if (system == "Fishing") {
            display += '<li id="' + catTitle.replace(/\s+/g, '') + '" ><a href="fishingList.html?' + 'qryTrailType=' + trailType + '&qryCatCode=' + catCode + '&qryCatTitle=' + catTitle + '" rel="external">' +
               '<span>' + catTitle + "</span></a></li>";
        }

        //Move to the next row of data for the next location
        arrayIndex++;
    }

    //Display all items in the array
    $("#lstCategories").append(display).listview("refresh");

}
//--------------------------------------------------------------------
// Name:  getQuerystring Function
// Description: gets the value equal to "poi" in the url and returns 
// an integer. Additional info about this function can be viewed at
// http://www.bloggingdeveloper.com/post/javascript-querystring-parse
// Get-QueryString-with-Client-Side-JavaScript.aspx
//--------------------------------------------------------------------
function getQuerystring(key, default_) {
    if (default_ === null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs === null) {
        return default_;
    } else {
        return qs[1];
    }
}
