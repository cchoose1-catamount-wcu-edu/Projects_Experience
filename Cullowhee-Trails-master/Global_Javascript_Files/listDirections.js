//--------------------------------------------------------------------
//Program: Dillsboro - ListDirections.js 
//Author: Scott Richmond, Scott Coffey, Justin Travis
//Date: 12/8/2011
//Description: Javascript file for the ListDirections.htm page
//--------------------------------------------------------------------

//
//Functions:
//      DrawScreen
//      
//          GetCurrentPosition
//              cb_GetCurrentPosition
//                  getDirections
//                      displayDirectionsTurnByTurn
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
var WANT_MAP_DIRECTIONS = false;
//--------------------------------------------------------------------
// Name:  Document Ready Function
//--------------------------------------------------------------------
$(document).ready(function () {
    DrawScreen();
});