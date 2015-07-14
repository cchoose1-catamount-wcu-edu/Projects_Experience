var myMap;
var currentPositionMarker;
var currentPositionAccuracyCircle;
var listOfPaths = [];
var geoXmlDoc;

//The ready function
$(document).ready(function () {

    console.log("Inside ready function");

    drawScreen();
    StartCurrentPositionWatcher();

});

//Name: drawScreen()
function drawScreen() {
    var trailType = getQuerystring("qryTrailType");
    var system = getQuerystring("qryCatTitle");
    var route = getQuerystring("qryPathFile");

    console.log("Insise drawScreen function");
    var lat = 35.310581;
    var long = -83.193939;

    myMap = CreateMap(lat, long);

    RenderRequestedKMLPolylines(trailType, system, route, myMap);
    myMap = ShowMapWithPolylines();
   
}




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