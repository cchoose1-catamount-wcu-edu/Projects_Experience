/*
* Author: Cavan Hoose
* Date: 2/5/15
* Description: Creates a map based on given info
*/
var map;

/*
* Parameter: (int or decimal) parLat (Required) - The Latitude center point of the map
* Parameter: (int or decimal) parLong (Required) - The Longitude center point of the map
* Parameter: (string) parDivToDisplay (Optional) - The div to display the map. WARNING: defaults to divMapCanvas
* Parameter: (int) parZoon (Optional) - The zoom level for the map - Defaults to 12
* Parameter: (int or string) parMapOptions (Optional) - displays the selected type of map - Defaults to 2 or "SATELLITE"
*/

// This is the function that will be called from another page

function CreateMap(parLat, parLong, parDivToDisplay, parZoom, parMapOptions) {

    //Test to make sure that given lat and long are numbers
    if (isNaN(parLat) || isNaN(parLong)) {
        console.log("----------------------------------");
        console.log("ERROR: PARLAT AND/OR PARLONG ARE NOT NUMBERS");
        return;
    }

    //set lat and long
    var mapCenterCoords = new google.maps.LatLng(parLat, parLong);

    //Test to make sure that given div exists
    if ($("#" + parDivToDisplay).length <= 0 && parDivToDisplay != undefined) {
        console.log("----------------------------------");
        console.log("ERROR: DIV NAME DOES NOT EXIST");
        console.log("----------------------------------");
    }

    //set div

    // WARNING: Only setting this optional parameter for this project since all divs have the same name. Will be required for most instances outside Cullowhee Trails
    parDivToDisplay = parDivToDisplay || "divMapCanvas";
    var div = parDivToDisplay;


    //Test to make sure that zoom level is valid
    if (!isNaN(parZoom) || parZoom == undefined) {
        parZoom = parZoom || 12;
    } else {
        console.log("-----------------------------");
        console.log("ERROR: Could not load Zoom level!");
        console.log("-----------------------------");

        alert("There was an error loading the map!");
        return;

    }

    //set zoom
    var zoom = parZoom;

    var mapOptions;

    //test to make sure that map type is either an int or valid type    
    if (parMapOptions == 1 || parMapOptions == "ROADMAP") {

        mapOptions = {
            center: mapCenterCoords,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        }
    else if (parMapOptions == 2 || parMapOptions == "SATELLITE"
        || parMapOptions == undefined || parMapOptions == null
        || parMapOptions == "") {

        mapOptions = {
            center: mapCenterCoords,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };

        }
    else if (parMapOptions == 3 || parMapOptions == "HYBRID") {

        mapOptions = {
            center: mapCenterCoords,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };

        }
    else if (parMapOptions == 4 || parMapOptions == "TERRAIN") {

        mapOptions = {
            center: mapCenterCoords,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

    }
    else {
        console.log("--------ERROR REPORT-------------");
        console.log("ERROR LOADING REQUESTED MAP TYPE");
        console.log("Map type must either be a string or int");
        console.log("INTS represent the following");
        console.log("1: RAODMAP");
        console.log("2: SATELLITE");
        console.log("3: HYBRID");
        console.log("4: TERRAIN");
        console.log("STRINGS must be either: RAODMAP, SATTELITE, HYBRID, or TERRAIN");
        console.log("---------------------------------");

        alert("There was an error loading the map!");
        return;
    }

    console.dir(mapOptions);


    //Create the map
    map = new google.maps.Map(document.getElementById(div),
                                            mapOptions);

    console.log("This is the map inside of the create map function");
    console.dir(map);
    return map;

}