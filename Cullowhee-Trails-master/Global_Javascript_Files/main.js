//--------------------------------------------------------------------
//Program: Dillsboro - Main.js 
//Author: Britt Cline
//Date: 12/1/2012
//Description: Javascript for all client-side pages in app. Allows for
//             quick javascript changes to be made across application.
//--------------------------------------------------------------------

$(document).ready(function () {
    $('.nav-bar').hide();
    $('.togglenav').click(function () {
        $('.shownav').toggle();
        $('.hidenav').toggle();
        $('.nav-bar').slideToggle();
    });

    $('a#icon-back').click(function () {
        parent.history.back();
        return false;
    });
});