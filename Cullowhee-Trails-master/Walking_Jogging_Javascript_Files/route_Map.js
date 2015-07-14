var myMap;
var currentPositionMarker;
var currentPositionAccuracyCircle;
var listOfSegments = [];
var listOfWayPoints = [];
var geoXmlDoc;
var selectedSystem;
var system;



//The ready function
$(document).ready(function () {

    console.log("Inside ready function");

    drawScreen();
    StartCurrentPositionWatcher();

});

//------------------
//name: drawScreen
//---------------------
function drawScreen() {
    var lattitude = 35.306164;
    var longitude = -83.20862;
    var trailType = getQuerystring("qryTrailType");
    system = decodeURI(getQuerystring("qryCatTitle"));
    var route = getQuerystring("qryRouteFile");



    myMap = CreateMap(lattitude, longitude);

    RenderRequestedKMLPolylines(trailType, system, route, myMap);
    myMap = ShowMapWithPolylines();

    loadListOfWayPoints();
}




//name: loadListOfWayPoints
function loadListOfWayPoints() {

    console.log("Inside loadListOfWayPoints");
    var routeCode, URL;
    routeCode = decodeURI(getQuerystring('qryPOI'));
    console.log("routeCode = " + routeCode);
    URL = ("Waypoints/" + system + "/wayPoint_" + routeCode + ".js").split(" ").join("_");
    console.log("url: " + URL);

    $.ajax({
        type: "GET",
        url: URL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: cb_LoadListOfWayPoints_Success,
        error: cb_LoadListOfWayPoints_Error
    })
}

//name: cb_LoadListOfWayPoints_Success
function cb_LoadListOfWayPoints_Success(parListOfWayPoints) {

    console.log("--------------------------------");
    console.log("Inside cb_LoadListOfWayPoints_Success CALLBACK function");
    console.log("--------------------------------");


    addMarkersToMap(parListOfWayPoints);
}

//----------------------------------------------------------------
// Name:  cb_LoadData_Error
//----------------------------------------------------------------
function cb_LoadListOfWayPoints_Error() {
    console.log("ERROR LOADING LIST OF WAYPOINTS DATA");
}

//----------------------------------------------------------------
// Name:  cb_LoadListOfTracks_Success
//----------------------------------------------------------------




//name: addMarkersToMap()
function addMarkersToMap(parListOfWayPoint) {

    console.log("Inside addMarkersToMap function");
    listOfWayPoints = parListOfWayPoint;
    var routeCode, WP_ID, WP_Lat, WP_Long, title, WP_desc;

    for (var i = 0; i < listOfWayPoints.length; i++) {
        routeCode = listOfWayPoints[i].RouteCode;
        WP_ID = listOfWayPoints[i].wayPoint_Code;
        WP_Lat = listOfWayPoints[i].wayPoint_Lat;
        WP_Long = listOfWayPoints[i].wayPoint_Long;
        WP_desc = listOfWayPoints[i].description;
        title = listOfWayPoints[i].wayPointName;

        var newMarker = AddMarker(WP_Lat, WP_Long, title, "icon5.png");

        

        addInfoWindowToMarker(newMarker, WP_ID, WP_Lat, WP_Long, title, WP_desc);
    }
}

//--------------------------------------------------------------------
// Name: AddMarker
//--------------------------------------------------------------------
function AddMarker(parLat, parLong, parTitle, parIcon) {

    var coords = new google.maps.LatLng(parLat, parLong);
    var marker;

    //Custom icon
    if (parIcon != "") {

        var pathToIconFile = "Images/" + parIcon;
        marker = new google.maps.Marker({
            position: coords,
            map: myMap,
            icon: pathToIconFile,
            title: parTitle
        });
    }
        //Default icon
    else {
        marker = new google.maps.Marker({
            position: coords,
            map: myMap,
            title: parTitle
        });
    }

    console.log("-------This is the Marker--------");
    console.log("BUG- Map for marker is undefined!!")
    console.dir(marker);

    return marker;
}

//name: addInfoWindowToMarker
function addInfoWindowToMarker(parMarker, parID, parLat, parLong, parTitle, parDesc) {

    //Set content of infoWindow
    var infoWindowContent = parDesc;
    var infoWindow = new google.maps.InfoWindow({ content: infoWindowContent });

    //Add event handler to display infoWindo when user clicks on marker
    google.maps.event.addListener(parMarker, 'click',
                                        function () {
                                            infoWindow.open(myMap, parMarker);
                                        });
}

//------------------------------
//Name: addTrackToMap()
//----------------------------
//function addTrackToMap(parTrackName) {

//    console.log("Inside addTrackToMap function");
//    console.log("parTrackName = " + parTrackName);

//    var myParser = new geoXML3.parser({ map: myMap, afterParse: cb_KMLDataParsed });
//    myParser.parse('WCUTrails.kml');
//    console.dir(myParser);
//    console.dir(myParser.options);
//    console.dir(myParser.docs);

//    }


//========================
//Name: StartCurrentPositionWatcher
//===================================
function StartCurrentPositionWatcher() {

    //Check that browser supports geolocation
    //If it doesn't, display message and stop any more current position code from running
    if (!navigator.geolocation) {
        alert("GeoLocation info not available");
        return;
    }

    //Get current position -- whenever position changes -- 
    //and pass it to callback function
    navigator.geolocation.watchPosition(cb_UpdateCurrentPositionMarker,
                                            cb_UpdateCurrentPositionMarker_Error,
                                            {
                                                enableHighAccuracy: true,
                                                maximumAge: 1000 //Retrieve new info if older than 5 seconds 
                                            }
                                            );
}


//=================================
// Name: cb_UpdateCurrentPositionMarker
//==================================
function cb_UpdateCurrentPositionMarker(positionObject) {

    var lat = positionObject.coords.latitude;
    var long = positionObject.coords.longitude;
    var myLatlng = new google.maps.LatLng(lat, long);
    var accuracy = positionObject.coords.accuracy;
    console.log("Current location: (" + lat + ", " + long + "), " +
                                 "Accuracy: " + accuracy + " meters");



    //Clear old marker (if exists)
    if (currentPositionMarker) {
        currentPositionMarker.setMap(null);
    }

    //Add marker to map
    currentPositionMarker = new google.maps.Marker({
        position: myLatlng,
        map: myMap,
        icon: 'Images/pin_red.png'
    });

    var displayContent = "Accuracy:  " + accuracy + " meters.";

    //Set content of infoWindow
    var infoWindow = new google.maps.InfoWindow({ content: displayContent });

    //Add event handler to display infoWindo when user clicks on marker
    google.maps.event.addListener(currentPositionMarker, 'click',
                                             function () {
                                                 infoWindow.open(myMap, currentPositionMarker);
                                             });

    // Construct the circle
    var currentPositionAccuracyCircleOptions = {
        strokeColor: "#3399FF",
        strokeOpacity: 0.7,
        strokeWeight: 1,
        fillColor: "#CCFFFF",
        fillOpacity: 0.35,
        map: myMap,
        center: myLatlng,
        radius: accuracy
    };

    //Clear old circle (if exists)
    if (currentPositionAccuracyCircle) {
        currentPositionAccuracyCircle.setMap(null);
    }
    currentPositionAccuracyCircle = new google.maps.Circle(currentPositionAccuracyCircleOptions);

}

//=====================================
// Name:            cb_UpdateCurrentPositionMarker_Error
// Description:     Callback function: 
//=====================================
function cb_UpdateCurrentPositionMarker_Error(err) {

    var errorMessage;

    if (err.code == 1) {
        errorMessage = "You chose not to share your location info.";
    }
    else if (err.code == 2) {
        errorMessage = "Location information currently unavailable!";
    }
    else if (err.code == 3) {
        errorMessage = "Timed out waiting to receive location information!";
    }
    else {
        errorMessage = "Unknown error occured";
    }
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