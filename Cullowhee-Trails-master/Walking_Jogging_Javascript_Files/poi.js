//--------------------------------------------------------------------
//Program: Cullowhee Trails - POI.js
//Author: Thanh Tram 
//Photoswipe: Daniel Keener, Britt Cline, Mitch Odom, Todd Michael
//Date: 11/15/2013
//Description: Javascript file for the POI.htm page
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
var pathFile;
var trailType;


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
    pathFile = unescape(getQuerystring('qryPathFile'));
    trailType = unescape(getQuerystring('qryTrailType'));


    var poiListUrl = "POI_Lists/POIList_" + poiListID + ".js";
    

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

        var currentPOIID = parRetrievedData[arrayIndex].Path_ID;
        // console.log("currentPOIID = " + currentPOIID);

        //Get info from desired POI
        if (currentPOIID == poiID) {
            // console.log("chosen POI = " + currentPOIID);

            var lat = parRetrievedData[arrayIndex].Path_Latitude;
            var long = parRetrievedData[arrayIndex].Path_Longitude;
            var title = parRetrievedData[arrayIndex].Path_Title;
            var desc = parRetrievedData[arrayIndex].Path_Description;
            var length = parRetrievedData[arrayIndex].Path_Length;
            var difficulty = parRetrievedData[arrayIndex].Path_Difficulty;
            var image1 = parRetrievedData[arrayIndex].Path_Image1;
            var image2 = parRetrievedData[arrayIndex].Path_Image2;
            var image3 = parRetrievedData[arrayIndex].Path_Image3;
            var image4 = parRetrievedData[arrayIndex].Path_Image4;
            var image5 = parRetrievedData[arrayIndex].Path_Image5;
            var image6 = parRetrievedData[arrayIndex].Path_Image6;
            var url1 = parRetrievedData[arrayIndex].Path_URL_1;
            var url2 = parRetrievedData[arrayIndex].Path_URL_2;
            var cat = parRetrievedData[arrayIndex].Path_Cat;


            break;
        }
    }
    var categoryTitle = unescape(getQuerystring('qryCatTitle'));
    var categoryID = unescape(getQuerystring('qryCatCode'));

    console.log("Inside = " + url1);

    //Add link to buttons on POI.htm
    var buttonQuerystring = '?qryTrailType=' + trailType +
                    '&qryPOI=' + poiID +
                    '&qryCatCode=' + categoryID +
                    '&qryCatTitle=' + categoryTitle +
                    '&qryLat_POI=' + lat_POI +
                    '&qryLong_POI=' + long_POI +
                  "&qryPathFile=" + pathFile;

    //$('a[id|=MapDirections]').attr('href', 'MapDirections.html' + buttonQuerystring);
    $('a[id|=icon-directions]').attr('href', 'ListDirections.html' + buttonQuerystring);
    $('a[id|=map-page]').attr('href', 'poi_Map.htm' + buttonQuerystring);

    //Add the title to the header and the info area
    $('#placeTitle').text(title);
    $('#top-left #placeURL').html('<a href="' + url1 + ' " target="_blank">Website</a>');
    var lengthInfo = '<b>Length:</b> ' + length;
    $('#length').html(lengthInfo);
    var diffInfo = '<b>Difficulty:</b> ' + difficulty;
    $('#difficulty').html(diffInfo);
    var descInfo = '<b>Description:</b> ' + desc;
    $('#desc').html(descInfo);
    var urlInfo = url1;
    $('#url').html('<a href="' + urlInfo + ' "target="_blank">External Website</a>');

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
        $('ul[id|=Gallery] li[id|=1]').html('<a rel="external" id="image1"  href="Images/' + image1 + '"><img id="mainImage" src="Images/' + image1 + '" /></a>');
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

    //Build and display third image (if any)
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

    //Build and display sixth image (if any)
    if (image6 != "") {
        $('ul[id|=Gallery] li[id|=6]').html('<a rel="external" href="Images/' + image6 + '"><img class="extra" src="Images/' + image6 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=6]').remove();
    }

    //Photoswipe function
    var myPhotoSwipe = $("#Gallery a").photoSwipe({ enableMouseWheel: false, enableKeyboard: false });
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