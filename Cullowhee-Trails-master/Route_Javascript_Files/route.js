//--------------------------------------------------------------------
//Program: Cullowhee Trails - route.js
//Author: Thanh Tram 
//Photoswipe: Daniel Keener, Britt Cline, Mitch Odom, Todd Michael
//Date: 3/16/2014
//Description: Javascript file for the route.htm page
//PhotoSwipe: Added 10/24/2012
//--------------------------------------------------------------------

$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.pushStateEnabled = false;
});

//Variables Page level in Scope
var poiID;
var categoryID;
var categoryTitle;
var lat_POI;
var long_POI;
var length_POI;
var difficulty_POI;
var myPhotoSwipe;


//--------------------------------------------------------------------
// Name:  Document Ready Function
//--------------------------------------------------------------------
$(document).ready(function () {

    //Get incoming querystring values
    poiID = unescape(getQuerystring('qryPOI'));
    poiListID = unescape(getQuerystring('qryCatCode'));
    categoryTitle = unescape(getQuerystring('qryCatTitle'));
    lat_POI = unescape(getQuerystring('qryLat_POI'));
    long_POI = unescape(getQuerystring('qryLong_POI'));
    length_POI = unescape(getQuerystring('qryLength_POI'));
    difficulty_POI = unescape(getQuerystring('qryDifficulty_POI'));


    var poiListUrl = "POI_Lists/POIList_" + poiListID + ".js";
   

    var URL = "Waypoints/" + categoryTitle.split(" ").join("_") + "/wayPoint_" + poiID + ".js";
    $.ajax({
        type: "GET",
        url: URL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success_GetAllWaypoints_CallbackFunction,
        error: error_GetAllWaypoints_CallbackFunction
    });

    //Get data from JSON object in Data_Categories file
    $.ajax({
        type: "GET",
        url: poiListUrl,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success_GetAllLocations_CallbackFunction,
        error: error_GetAllLocations_CallbackFunction
    });

    

    //$('a[id|=icon-back]').attr('href', 'poiList.html?qryCatCode=' + categoryID + '&qryCatTitle=' + categoryTitle);
});


//--------------------------------------------------------------------
// Ajax Callback Functions
//--------------------------------------------------------------------

//Name: success_GetAllWaypoints_CallbackFunction
function success_GetAllWaypoints_CallbackFunction(parRetrievedData) {

    console.log("Inside success_GetAllWaypoints_CallbackFunction");

    //var poiID = getQuerystring('qryPOI');
    for (var n = 0; n < parRetrievedData.length; n++) {
        var WPCode = parRetrievedData[n].wayPoint_Code;
        console.log("WPCode = " + WPCode);
        for (var i = 0; i < parRetrievedData.length; i++) {
            var currentCode = parRetrievedData[i].wayPoint_Code;
            console.log("currentCode = " + currentCode);

            if (currentCode == WPCode) {
                var image100 = parRetrievedData[i].WPImage1;
                console.log("image 1 from WP = " + image100);
                var image200 = parRetrievedData[i].WPImage2;
                var image300 = parRetrievedData[i].WPImage3;
                var lat = parRetrievedData[i].wayPoint_Lat;
                var long = parRetrievedData[i].wayPoint_Long;
            }
        }
    }

    $('input[name|=q]').attr('value', [lat, long]);

    var imageQueryString = 'Display_Image.htm?qryPOI=' + poiID +
                            '&qryCatCode=' + categoryID +
                            '&qryCatTitle=' + categoryTitle +
                            '&qryLat_POI=' + lat_POI +
                            '&qryLong_POI=' + long_POI +
                            '&qryImgFileName=';

    //Build and display first image (if any)
    //This assumes that if we don't have an image1 we don't have any images at all.
    if (image100 != "") {
        console.log("image 100 = " + image100);
        $('ul[id|=Gallery] li[id|=6]').html('<a rel="external" href="Images/' + image100 + '"><img class="extra" src="Images/' + image100 + '" /></a>');
        $('#Gallery').show();
    }
    else {
        $('ul[id|=Gallery] li[id|=6]').remove();
    }
    //Build and display second image (if any)
    if (image200 != "") {
        $('ul[id|=Gallery] li[id|=7]').html('<a rel="external" href="Images/' + image200 + '"><img class="extra" src="Images/' + image200 + '" /></a>');
        $('#Gallery').show();
    }
    else {
        $('ul[id|=Gallery] li[id|=7]').remove();
    }

    //Build and display third image (if any)
    if (image300 != "") {
        $('ul[id|=Gallery] li[id|=8]').html('<a rel="external" href="Images/' + image300 + '"><img class="extra" src="Images/' + image300 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=8]').remove();
    }

    //Photoswipe function
    myPhotoSwipe += $("#Gallery a").photoSwipe({ enableMouseWheel: false, enableKeyboard: false });

}

//name: error_GetAllWaypoints_CallbackFunction
function error_GetAllWaypoints_CallbackFunction(parXMLHttpRequestObject) {

    //If the info can not be used from the Data_POI.js file, display an error
    alert("Unable to reach server. Please try again later.");
}

//----------------------------------------------------------------
// Name:  success_GetAllLocations_CallbackFunction
// Description: Function that runs after the retrieval of the JSON
// object via the Ajax request
//---------------------------------------------------------------- 
function success_GetAllLocations_CallbackFunction(parRetrievedData) {

    console.log("Inside success_GetAllLocations()");

    //Retrieve the incoming POI ID from the querystring
    var poiID = getQuerystring('qryPOI');
    console.log("poiID = " + poiID);

    //Loop through the retrieved array of POI objects to get chosen POI info
    for (arrayIndex = 0; arrayIndex < parRetrievedData.length; arrayIndex++) {

        var currentPOIID = parRetrievedData[arrayIndex].RouteCode;
        // console.log("currentPOIID = " + currentPOIID);

        //Get info from desired POI
        if (currentPOIID == poiID) {
            // console.log("chosen POI = " + currentPOIID);

            var trailHead = parRetrievedData[arrayIndex].TrailHead;
            var lat = parRetrievedData[arrayIndex].TrailHead_Lat;
            var long = parRetrievedData[arrayIndex].TrailHead_Long;
            var title = parRetrievedData[arrayIndex].RouteName;
            var desc = parRetrievedData[arrayIndex].Description;
            var length = parRetrievedData[arrayIndex].RouteLength;
            var difficulty = parRetrievedData[arrayIndex].RouteDifficulty;
            var parking = parRetrievedData[arrayIndex].parking;
            var image1 = parRetrievedData[arrayIndex].Image1;
            var image2 = parRetrievedData[arrayIndex].Image2;
            var image3 = parRetrievedData[arrayIndex].Image3;
            var image4 = parRetrievedData[arrayIndex].Image4;
            var image5 = parRetrievedData[arrayIndex].Image5;
            //var image6 = parRetrievedData[arrayIndex].POI_Image6;
            //var url = parRetrievedData[arrayIndex].POI_URL;
            var cat = parRetrievedData[arrayIndex].TrailSystemCode;
            var routeFile = parRetrievedData[arrayIndex].RouteFile;


            break;
        }
    }
    var categoryTitle = unescape(getQuerystring('qryCatTitle'));
    var categoryID = unescape(getQuerystring('qryCatCode'));
    var trailType = unescape(getQuerystring('qryTrailType'));

    //Add link to buttons on POI.htm
    var buttonQuerystring = '?qryTrailType=' + trailType +
                    '&qryPOI=' + poiID +
                    '&qryCatCode=' + categoryID +
                    '&qryCatTitle=' + categoryTitle +
                    '&qryLat_POI=' + lat_POI +
                    '&qryLong_POI=' + long_POI +
                    '&qryRouteFile=' + routeFile;

    //$('a[id|=MapDirections]').attr('href', 'MapDirections.html' + buttonQuerystring);
    $('a[id|=icon-directions]').attr('href', 'ListDirections.html' + buttonQuerystring);
    $('a[id|=map-page]').attr('href', 'route_Map.html' + buttonQuerystring);

    //Add the title to the header and the info area
    $('#placeTitle').text(title);
    //$('#top-left #placeURL').html('<a href="' + url + ' " target="_blank">Website</a>');
    var trailHeadInfo = '<b>Trail Head: </b>' + trailHead;
    $('#trailHead').html(trailHeadInfo);
    var lengthInfo = '<b>Length:</b> ' + length;
    $('#length').html(lengthInfo);
    var diffInfo = '<b>Difficulty:</b> ' + difficulty;
    $('#difficulty').html(diffInfo);
    var descInfo = '<b>Description:</b> ' + desc;
    $('#desc').html(descInfo);
    var parkInfo = '<b>Parking:</b> ' + parking;
    $('#parking').html(parkInfo);

    //Display POI Info
    $('input[name|=q]').attr('value', [lat, long]);

    var imageQueryString = 'Display_Image.htm?qryPOI=' + poiID +
                            '&qryCatCode=' + categoryID +
                            '&qryCatTitle=' + categoryTitle +
                            '&qryLat_POI=' + lat_POI +
                            '&qryLong_POI=' + long_POI +
                            '&qryImgFileName=';

    //Build and display first image (if any)
    //This assumes that if we don't have an image1 we don't have any images at all.
    if (image1 != "") {
        $('ul[id|=Gallery] li[id|=1]').html('<a rel="external" id="image1" href="Images/' + image1 + '"><img id="mainImage" src="Images/' + image1 + '" /></a>');
        $('#Gallery').show();
    }
    else {
        $('span[id|=mainImage]').html('<img id="main" alt="" src="Images/' + "no-image.jpg" + '" />');

        $('ul[id|=Gallery] li[id|=1]').remove();
    }
    //Build and display second image (if any)
    if (image2 != "") {
        $('ul[id|=Gallery] li[id|=2]').html('<a rel="external" href="Images/' + image2 + '"><img class="extra" src="Images/' + image2 + '" /></a>');
        $('#Gallery').show();
    }
    else {
        $('ul[id|=Gallery] li[id|=2]').remove();
    }

    ////Build and display third image (if any)
    if (image3 != "") {
        $('ul[id|=Gallery] li[id|=3]').html('<a rel="external" href="Images/' + image3 + '"><img class="extra" src="Images/' + image3 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=3]').remove();
    }

    //Build and display fourth image (if any)
    if (image4 != "") {
        $('ul[id|=Gallery] li[id|=4]').html('<a rel="external" href="Images/' + image4 + '"><img class="extra" src="Images/' + image4 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=4]').remove();
    }

    //Build and display fifth image (if any)
    if (image5 != "") {
        $('ul[id|=Gallery] li[id|=5]').html('<a rel="external" href="Images/' + image5 + '"><img class="extra" src="Images/' + image5 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=5]').remove();
    }

    ////Build and display sixth image (if any)
    //if (image6 != "") {
    //    $('ul[id|=Gallery] li[id|=6]').html('<a rel="external" href="Images/' + image6 + '"><img class="extra" src="Images/' + image6 + '" /></a>');
    //}
    //else {
    //    $('ul[id|=Gallery] li[id|=6]').remove();
    //}

    //Photoswipe function
    myPhotoSwipe += $("#Gallery a").photoSwipe({ enableMouseWheel: false, enableKeyboard: false });
}

//----------------------------------------------------------------
// Name:  error_GetAllLocations_CallbackFunction
// Description: Function that runs after the failure to retrieve 
// of the JSON object via the Ajax request
//----------------------------------------------------------------
function error_GetAllLocations_CallbackFunction(parXMLHttpRequestObject) {

    //If the info can not be used from the Data_POI.js file, display an error
    alert("Unable to reach server. Please try again later.");
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