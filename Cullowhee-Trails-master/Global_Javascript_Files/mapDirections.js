//--------------------------------------------------------------------
//Program: Dillsboro - MapDirections.js
//Author: Scott Richmond, Scott Coffey, Justin Travis
//Date: 12/8/2011
//Description: Javascript file for the MapDirections.htm page
//---------------------------------------------------------------------
//--------------------------------------------------------------------
//Program: Directions_Map.js
//Date: 3/13/12
//Description: Draws Map directions from current location to POI
//
//Functions:
//      DrawScreen
//          DrawMap
//          GetCurrentPosition
//              cb_GetCurrentPosition
//                  getDirections
//                      displayDirectionsOnMap
//
// Assumptions:
//  1. Using getCurrentPosition here assuming that the phone has already
//      retrieved position on List and/or Map pages.   
//        
//---------------------------------------------------------------------
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.pushStateEnabled = false;
});

//Variables page-level in scope
var map;

var WANT_MAP_DIRECTIONS = true;

$('#poi_map').live('pageinit', function (event) {

    $("#divMapCanvas").height($("#poi_map").height() - $(".ui-header").height() - $(".ui-footer").height());
    $(window).resize(function () {
        $("#divMapCanvas").height($("#poi_map").height() - $(".ui-header").height() - $(".ui-footer").height());
    });
});
$('#poi_map').live('pageshow', function (event) {

    //Draw initial map
    DrawMap();

    DrawScreen();

    $("#divMapCanvas").fadeIn()

    google.maps.event.trigger(map, 'resize');
});

//--------------------------------------------------------------------
// Name: DrawMap
//--------------------------------------------------------------------
function DrawMap() {

    //Starting center for map: Dillboro Center 
    var startingLatitude = 35.369523;
    var startingLongitude = -83.249044;

    debugPrint("Inside DrawMap()");

    //Coordinates for center of map (Dillsboro)
    var mapCenterCoordinates = new google.maps.LatLng(startingLatitude, startingLongitude);

    //Setting some map options, including controls
    var mapOptions = {
        zoom: 16,
        center: mapCenterCoordinates,
        mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        navigationControl: true,
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        backgroundColor: "#dddddd"
    };

    //Create and display map
    map = new google.maps.Map(document.getElementById("divMapCanvas"), mapOptions);
}

