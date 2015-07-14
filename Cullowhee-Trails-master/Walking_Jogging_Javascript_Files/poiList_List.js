//--------------------------------------------------------------------
//Program: poiList_List.js
//Date:
//Description:

//  displayListOfPOIs
//      sortArrayByDistance - conditionally
//          CalculateDistanceInFeet
//  buildListItem
//  sortArrayByTitle   

//--------------------------------------------------------------------

//--------------------------------------------------------------------
// Name: displayListOfPOIs
// Description: Display the locations by distance from the user
//(if available), or by title (if not available)
//--------------------------------------------------------------------
function displayListOfPOIs() {

    //alert("Inside displayListOfPOIs function");
    debugPrint("Inside displayListOfPOIs function");
    console.dir(mapListPageInfo.ArrayOfPOIData);

    var arrayOfPOIData = mapListPageInfo.ArrayOfPOIData;

    var poi_id, poi_lat, poi_long, poi_title, poi_listItem_URL, poi_length, poi_difficulty, pathFile, path_image;
    var distanceFromBase = null;
    var display = "";
    var distanceDisplay = "";
    var currentLat, currentLong;
    var length, difficulty;

    //Check for geolocation availability and current position info
    //If both are available, sort the POI array by distance from current position
    currentLat = mapListPageInfo.CurrentPosition_Lat;
    currentLong = mapListPageInfo.CurrentPosition_Long;

    if ((mapListPageInfo.GeoLocationAvailable) && (currentLat !== null) && (currentLong !== null)) {
        sortArrayByDistance(currentLat, currentLong)
    }

    //If no GeoLocation info available - show that
    if (!mapListPageInfo.GeoLocationAvailable) {
        display += '<div id="geoerror">No Geolocation Available</div>';
    }

    //Loop through the POI data array and build the POI list items string
    for (var arrayIndex = 0; arrayIndex < arrayOfPOIData.length; arrayIndex++) {

        poi_id = arrayOfPOIData[arrayIndex].Path_ID;
        poi_lat = arrayOfPOIData[arrayIndex].Path_Latitude;
        poi_long = arrayOfPOIData[arrayIndex].Path_Longitude;
        poi_title = arrayOfPOIData[arrayIndex].Path_Title;
        poi_length = arrayOfPOIData[arrayIndex].Path_Length;
        pathFile = arrayOfPOIData[arrayIndex].PathFile;
        poi_difficulty = arrayOfPOIData[arrayIndex].Path_Difficulty;
        path_image = arrayOfPOIData[arrayIndex].Path_Image1;


        console.log("PahFile: " + arrayOfPOIData[arrayIndex].PathFile);
        //Don't add a POI that has a lat or long value of zero
        if ((poi_lat != 0) && (poi_long != 0)) {

            //Don't calculate distance if there is a missing current position lat or long value
            //Otherwise calculate distance from current position
            if ((currentLat != null) && (currentLong != null)) {

                //Calculate the distance to each location from the user's current location
                var distanceFromBase = CalculateDistanceInFeet(currentLat, currentLong,
                                                                poi_lat, poi_long);
            }

            length = 'Length: ' + poi_length;
            difficulty = 'Difficulty: ' + poi_difficulty;

            //Build list item
            display = display + buildListItem(poi_id, poi_title, length, difficulty, poi_lat, poi_long, distanceFromBase, pathFile, path_image);

        }

    } //end of for loop

    //Display all items in the array
    $("#lstPOIs").html(display);
    $("#lstPOIs").listview('refresh');
}

//--------------------------------------------------------------------
// Name: buildListItem(parPOI_ID, parPOI_Title, parPOI_Length, parPOI_Difficulty, parPOI_Lat, parPOI_Long, parDistanceFromBase, parPathFile)
//--------------------------------------------------------------------
function buildListItem(parPOI_ID, parPOI_Title, parPOI_Length, parPOI_Difficulty, parPOI_Lat, parPOI_Long, parDistanceFromBase, parPathFile, parPathImage) {

    var display = "";
    var distanceDisplay = "";
    var trailType = getQuerystring("qryTrailType");


    //Build url string
    var poi_listItem_URL = "POI.htm?qryTrailType=" + trailType +
                      "&qryPOI=" + parPOI_ID +
                      "&qryCatCode=" + mapListPageInfo.CategoryCode +
                      "&qryCatTitle=" + mapListPageInfo.CategoryTitle +
                      "&qryLat_POI=" + parPOI_Lat +
                      "&qryLong_POI=" + parPOI_Long +
                      "&qryPathFile=" + parPathFile;

    //Build list item string -- with distance display if needed
    if ((parDistanceFromBase !== null)) {

        //If distance is greater than 1 mile, show as miles,
        // otherwise show as feet
        if (parDistanceFromBase > 5280) {
            distanceDisplay = parseInt(parDistanceFromBase / 5280) + " miles";
        }
        else {
            distanceDisplay = addCommas(parseInt(parDistanceFromBase)) + " feet";
        }

        //Build list item display string -- With Distance
        display += "<li>" + '<a rel="external" href="' + poi_listItem_URL + '"><span class="title">' +
                    parPOI_Title + '</span><br/><span class="subTitle">' + parPOI_Length + '; ' + parPOI_Difficulty + '</span><span class="distance">' + distanceDisplay + "</span></a>" + '<img alt="image" src="Images/' + parPathImage + '" class="imagesInListview" />' + "</li>";
    }
    else {
        //Build list item display string -- No Distance
        display += "<li>" + '<a rel="external" href="' + poi_listItem_URL + '"><span class="title">' +
                    parPOI_Title + '</span><br/><span class="subTitle">' + parPOI_Length + '; ' + parPOI_Difficulty + "</span></a></li>";
    }

    return display;
}

//--------------------------------------------------------------------
// Name: sortArrayByDistance
// Description: Sort the array by distance from the user's location
//--------------------------------------------------------------------
function sortArrayByDistance() {

    debugPrint("Inside sortArrayByDistance function");

    var arrayToSort = mapListPageInfo.ArrayOfPOIData;
    var currentLat = mapListPageInfo.CurrentPosition_Lat;
    var currentLong = mapListPageInfo.CurrentPosition_Long;

    //Sort the array by distance from the user
    var sortedArray = arrayToSort.sort(
                        function (a, b) {
                            var distanceTo_A = CalculateDistanceInFeet(currentLat, currentLong,
                                                         a.Path_Latitude, a.POI_Longitude);
                            var distanceTo_B = CalculateDistanceInFeet(currentLat, currentLong,
                                                         b.Path_Latitude, b.POI_Longitude);
                            return distanceTo_A - distanceTo_B;
                        });

    return sortedArray;
}

//--------------------------------------------------------------------
// Name: sortArrayByTitle
// Description: Sort the array by the Titles of the POIs
//--------------------------------------------------------------------
function sortArrayByTitle(parArrayToSort) {

    //alert("Inside sortArrayByTitle function");
    debugPrint("Inside sortArrayByTitle function");

    //Sort the array by distance from the user
    var sortedArray = parArrayToSort.sort(
                        function (a, b) {
                            var firstTitle = a.Path_Title.toLowerCase();
                            var secondTitle = b.Path_Title.toLowerCase();
                            if (firstTitle < secondTitle) { return -1 }
                            if (firstTitle > secondTitle) { return 1 }
                            return 0;
                        }
     );

    return sortedArray;
}

//----------------------------------------------------------------------------
// Name:        addCommas
// Description: Temporary.  
//              TODO:  simplify based on number never being larger than 5,280
// From:  http://www.logicfrog.net/2011/03/add-commas-large-numbers-javascript/
//-----------------------------------------------------------------------------
function addCommas(str) {
    amount = new String(str);
    amount = amount.split("").reverse();

    var output = "";

    for (var i = 0; i <= amount.length - 1; i++) {
        output = amount[i] + output;

        if ((i + 1) % 3 == 0 && (amount.length - 1) !== i) output = ',' + output;
    }
    return output;
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

