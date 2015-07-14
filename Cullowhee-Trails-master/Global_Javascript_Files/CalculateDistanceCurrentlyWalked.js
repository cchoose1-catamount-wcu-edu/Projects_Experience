/*
* Author: Cavan Hoose
* Date: 3/8/15
* Description: Calculates the distance the user has walked in their route
*/

var CurrentPositionLatLongObject, googleCurrentObject, doc, RouteObject, closestColor;
var GlobalReturnObject;
var circle;
var progressObject, updatedProgressObject;

//TODO: Test the update object function
//      Get the distances of all the completed trails
//      Add and return the completed distances

//TODO in future: What if user decides to turn back without completing the trail?
//                Trail will say completed and will add to distance even though they didn't complete it


function DistanceWalked(parLatLongCPosObject, parGeoDoc, parRouteIndexesObject) {
    //get info from parameters
    CurrentPositionLatLongObject = parLatLongCPosObject;
    doc = parGeoDoc;
    RouteObject = parRouteIndexesObject;
    googleCurrentObject = new google.maps.LatLng(CurrentPositionLatLongObject[0].lat, CurrentPositionLatLongObject[0].long);
    getClosestSegment();
    CreateTrailProgressObject();
    UpdateTrailProgressObject(progressObject);
    

    return GlobalReturnObject;
}
//---------------------------GETTER FUNCTIONS----------------------------------------------------
//use getter function to return info on the trail the the user is closest to
function getClosestSegmentInfo() {
    return GlobalReturnObject;
}
//------------------------------------------------------------------------------------------------

function getClosestSegment() {
    var closestName, closestIndex, closestDistance;

    for (var i = 0; i < RouteObject.length; i++) {
        for (var j = 0; j < doc[0].placemarks[RouteObject[i]].LineString[0].coordinates.length; j++) {
            var googleKMLCoordsObjectLat = doc[0].placemarks[RouteObject[i]].LineString[0].coordinates[j].lat;
            var googleKMLCordsObjectLong = doc[0].placemarks[RouteObject[i]].LineString[0].coordinates[j].lng;
            var googleCoordsObjectTest = new google.maps.LatLng(googleKMLCoordsObjectLat, googleKMLCordsObjectLong);

            if (pointInCircle(googleCoordsObjectTest, 6, googleCurrentObject)) {
                closestName = doc[0].placemarks[RouteObject[i]].name;
                closestIndex = RouteObject[i];
                break;
            }
        }
    }

    var ReturnObject;

    //The object to be returned
    if (closestName != null) {
       ReturnObject = [{ "Name": closestName, "Index": closestIndex }];
    }
    else {
        ReturnObject = [{ "Name": "None", "Index": null }];
    }
    GlobalReturnObject = ReturnObject;
    console.log("Return Object: " + JSON.stringify(ReturnObject));

    //call method to calculate how far the user has trveled within the given closest trail
    getDistanceWalkedInSegment(GlobalReturnObject[0].Index);

}

function getDistanceWalkedInSegment(parSegmentIndex) {
    var index = GlobalReturnObject[0].Index;

    if (index == null) {
        return 0;
    }

    //turn coords to google map cords object
    var centerCoords = new google.maps.LatLng(CurrentPositionLatLongObject[0].lat, CurrentPositionLatLongObject[0].long);
    var coordsLat, coordsLong;

    //For testing purposes only: Circle will be invisible in final version
    var circleOptions = {
        strokeColor: '#cbd4f3',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#cbd4f3',
        fillOpacity: 0.15,
        map: map,
        center: centerCoords,
        radius: 6
    };

    var KMLCoordsIndex, isInside = false;
    var walkedDistanceInSegment = 0;

    //display circle: For testing only
    circle = new google.maps.Circle(circleOptions);

    //contruct google map coords from KML coords in given trail
    //test if coords is inside circle until returns true or goes through all of them
    for (var i = 0; i < doc[0].placemarks[index].LineString[0].coordinates.length; i++) {
        coordsLat = doc[0].placemarks[index].LineString[0].coordinates[i].lat;
        coordsLong = doc[0].placemarks[index].LineString[0].coordinates[i].lng;

        var googleCoordsObject = new google.maps.LatLng(coordsLat, coordsLong);

        if (pointInCircle(googleCoordsObject, 6, centerCoords)) {
            KMLCoordsIndex = i;
            isInside = true;
            break;
        }
    }

    //execute this code only is a point in the trail was also found inside the circle
    if (isInside) {
        var coordFrom, coordTo;
        coordFrom = 0;
        coordTo = coordFrom + 1;

        //calculate the distance between all of the cords in the KML file up to the given coord
        for (var i = 0; i < KMLCoordsIndex; i++) {

            var lat1, long1, lat2, long2;
            lat1 = doc[0].placemarks[index].LineString[0].coordinates[coordFrom].lat;
            long1 = doc[0].placemarks[index].LineString[0].coordinates[coordFrom].lng;

            lat2 = doc[0].placemarks[index].LineString[0].coordinates[coordTo].lat;
            long2 = doc[0].placemarks[index].LineString[0].coordinates[coordTo].lng;

            walkedDistanceInSegment += CalculateDistanceInFeet(lat1, long1, lat2, long2);
            coordFrom++;
            coordTo++;
        }
    }

    console.log("Walked Distance in segment: " + walkedDistanceInSegment.toFixed(2) + " Feet");

    //return the distance walked in the closest segment
    //This is NOT the entire distance walked neccessarily
    return walkedDistanceInSegment.toFixed(2);
}

function CreateTrailProgressObject() {
    var objectFill = "[";
    //Example {"Name": Green, "Current": false, "Completed": true}

    for (var i = 0; i < RouteObject.length; i++) {
        objectFill += '{"Name" : "' + doc[0].placemarks[RouteObject[i]].name;
        objectFill += '", "Current" : ' + false;
        objectFill += ', "Completed" : ' + false + '}';

        if ((i + 1) < RouteObject.length) {
            objectFill += ", ";
        }
    }

    objectFill += ']';
    progressObject = JSON.parse(objectFill);
}

function UpdateTrailProgressObject(parProgressObject) {
    var objectToUpdate = parProgressObject;

    var objectFill = "[";
    //Example {"Name": Green, "Current": false, "Completed": true}

    for (var i = 0; i < RouteObject.length; i++) {

        var isCurrent = false, isCompleted = false;

        if (GlobalReturnObject[0].Name != doc[0].placemarks[RouteObject[i]].name && isCurrent != true) {
            isCurrent = false;
        } else {
            isCurrent = true;
        }

        if (objectToUpdate[0].Current == true && GlobalReturnObject.Name != doc[0].placemarks[RouteObject[i]].name) {
            isCompleted = true;
        }


        objectFill += '{"Name" : "' + doc[0].placemarks[RouteObject[i]].name;
        objectFill += '", "Current" : ' + isCurrent;
        objectFill += ', "Completed" : ' + isCompleted + '}';

        if ((i + 1) < RouteObject.length) {
            objectFill += ", ";
        }
    }

    objectFill += ']';

    updatedProgressObject = JSON.parse(objectFill);

}

// ---------------------------------------------------------------------------------------
// name: CalculateDistanceInFeet
// source: http://www.codecodex.com/wiki/Calculate_distance_between_two_points_on_a_globe
// ---------------------------------------------------------------------------------------
function CalculateDistanceInFeet(lat1, lon1, lat2, lon2) {

    var R = 6371; // km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c; //kilometers

    d = d * 1000;

    //Convert to yards
    var distanceInFeet = d * 1.093 * 3;
    //var distanceInYards = d * 1.093;

    return distanceInFeet;
    //return distanceInYards;
}

function pointInCircle(point, radius, center) {
    return (google.maps.geometry.spherical.computeDistanceBetween(point, center) <= radius)
}

