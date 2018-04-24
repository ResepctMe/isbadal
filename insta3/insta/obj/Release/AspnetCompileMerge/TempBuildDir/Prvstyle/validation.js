/*
 
    Replay - validation.js
 
    Script for validation.
 
*/

/// <reference path = "validation.js" />

var storedTime = '';

$(window).load(function () {
    storedTime = $("#fromDateBox").val();

});

// 30 Day Validation POI
$("#fromDateBox").on("change", function (e) {

    var currentTime = new Date();

    var dateInput = $("#fromDateBox").val();
    var selectedTime = new Date(dateInput.substring(6, 10), dateInput.substring(3, 5) - 1, dateInput.substring(0, 2), dateInput.substring(11, 13), dateInput.substring(14, 16));

    var POIChecker = false;
    
    if ($(".tm-tag:contains('Bio')").length > 0)
    {
        POIChecker = true;
    }  

    if (selectedTime < new Date(currentTime.setDate(currentTime.getDate() - 365)) && POIChecker == true)
    {
        // Ask user if would like to proceed
        $("#panelOverlay").css('display', 'block');
        $("#close_confirm").css('display', 'inline');                   
    }
    else if (selectedTime < new Date(currentTime))
    {
        disablePOI();
    }
    else
    {
        // Enable locality
        $("#localityCB").prop('disabled', false);
        $("#exLocalityCB").prop('disabled', false);
        $("#localityCB").prop('checked', true);
        $("#exLocalityCB").prop('checked', true);
        $("#localityCB").parent().css('color', '#444');
        $("#exLocalityCB").parent().css('color', '#444');
    }
}); 

$(".fa-check").click(function () {
    disablePOI();
});

$(".fa-times").click(function () {
    // Revert date
    $("#fromDateBox").val(storedTime);

    // Enable locality
    $("#localityCB").prop('disabled', false);
    $("#exLocalityCB").prop('disabled', false);
    $("#localityCB").prop('checked', true);
    $("#exLocalityCB").prop('checked', true);
    $("#localityCB").parent().css('color', '#444');
    $("#exLocalityCB").parent().css('color', '#444');

    // Hide popup
    $("#panelOverlay").css('display', 'none');
    $("#close_confirm").css('display', 'none');
});

function disablePOI() {
    // Disable POI boxes
    $("#localityCB").prop('disabled', true);
    $("#localityCB").prop('checked', false);
    $("#localityCB").parent().css('color', 'lightgrey');
    $("#exLocalityCB").parent().css('color', 'lightgrey');

    $("#exLocalityCB").prop('disabled', true);
    $("#exLocalityCB").prop('checked', false);

    // Clear POI stuff
    $(".tm-tag").each(function () {
        if (this.innerHTML.indexOf("Bio") != -1)
        {
            this.children[0].children[3].click();
        }        
    });

    // Hide popup
    $("#panelOverlay").css('display', 'none');
    $("#close_confirm").css('display', 'none');
}