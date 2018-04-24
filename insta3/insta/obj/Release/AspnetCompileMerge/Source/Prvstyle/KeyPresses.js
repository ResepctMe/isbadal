/*
 
    Replay - KeyPresses.js
 
    Script for key press functions.
 
*/

/// <reference path = "KeyPresses.js" />

// Enter when user has entered in search box
$("#termBox").focus(function () {
    $("#termBox").keydown(function (event) {
        if (event.which == 13) {
            $('#searchButton').click();
        }       
    });
});

// Enter from advanced menu

// Enter when user has entered in search box - Term
$("#termBox2").keydown(function (event) {
    if (event.which == 13) {
        $('#btnAddTermEx').click();
    }
});
$("#exclusionBox").keydown(function (event) {
    if (event.which == 13) {
        $('#btnAddTermEx').click();
        //$("#accountEx").focus();
    }
});

// Enter when user has entered in search box - POI
$("#poiBox").keydown(function (event) {
    if (event.which == 13) {
        $('#btnAddPOI').click();
    }
});
$("#poiExBox").keydown(function (event) {
    if (event.which == 13) {
        $('#btnAddPOI').click();
        //$("#accountEx").focus();
    }
});

// Enter when user has entered in search box - Map
$("*").keydown(function (event) {
    if (event.which == 13 && $("#mapSlide").css("display") === "inline-block" && !$('#btnGeoSave').is(":disabled")) {
        $('#btnGeoSave').click();
    }
    else if (event.which == 13 && $("#optionSlide").css("display") === "inline-block") {
        $('#btnAddOption').click();
    }
});

// Enter when user has entered in search box - Account
$("#accountBox").keydown(function (event) {
    if (event.which == 13) {
        $('#btnAddAccount').click();
        //$("#accountBox").focus();
    }
});
$("#accountEx").keydown(function (event) {
    if (event.which == 13) {
        $('#btnAddAccount').click();
        //$("#accountEx").focus();
    }
});