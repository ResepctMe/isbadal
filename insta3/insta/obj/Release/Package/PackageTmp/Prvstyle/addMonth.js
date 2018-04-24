/*
Summary
 Call api function to send data request to Gnip Api
Params
 [Object] Sender. Search ter string variable.
Returns
 Gnip Tweet search.
*/
function updateCountsBack(searchTerm) {
    
    clearScreen('searchButton');

    // aquire date range to send to api
    var dateTimeFrom = $('#fromDateBox').val();
    var dateTimeUntil = $('#untilDateBox').val();

    // Convert to UK standard format for Gnip regulations
    dateTimeFrom = ProcessDateTime(dateTimeFrom, 'uk', true);
    dateTimeUntil = ProcessDateTime(dateTimeUntil, 'uk', true);

    $('#SnapLoadingOverlay').show();
    // hide controls that are not relevant
    $('#chartDiv').show();
    $('#getTweetDiv').hide();
    $('#addToQ').hide();
    $('#ExportToClipboard').hide();
    $('#tweetDiv').hide();
    $('#gridDiv').hide();

    // ajax call to go and retireve data from gnip
    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: "default.aspx/updateSearchBack",
        data: null,
        dataType: "json",
        success: function (data) {

            updateMap(searchTerm, dateTimeFrom, dateTimeUntil, data);

        },
        error: function (err) {
            $('#SnapLoadingOverlay').hide();
            var alertBodyTexts = [err.responseText];
            DisplayAlertBox('alert_edit_single', 'Error', alertBodyTexts, this);
            $('#chartDiv').hide();
            $('#getTweetDiv').hide();
        }
    });
}

function updateCountsForward(searchTerm) {

    clearScreen('searchButton');

    // aquire date range to send to api
    var dateTimeFrom = $('#fromDateBox').val();
    var dateTimeUntil = $('#untilDateBox').val();

    // Convert to UK standard format for Gnip regulations
    dateTimeFrom = ProcessDateTime(dateTimeFrom, 'uk', true);
    dateTimeUntil = ProcessDateTime(dateTimeUntil, 'uk', true);

    $('#SnapLoadingOverlay').show();
    // hide controls that are not relevant
    $('#chartDiv').show();
    $('#getTweetDiv').hide();
    $('#addToQ').hide();
    $('#ExportToClipboard').hide();
    $('#tweetDiv').hide();
    $('#gridDiv').hide();

    // ajax call to go and retireve data from gnip
    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: "default.aspx/updateSearchForward",
        data: null,
        dataType: "json",
        success: function (data) {

            updateMap(searchTerm, dateTimeFrom, dateTimeUntil, data);

        },
        error: function (err) {
            $('#SnapLoadingOverlay').hide();
            var alertBodyTexts = [err.responseText];
            DisplayAlertBox('alert_edit_single', 'Error', alertBodyTexts, this);
            $('#chartDiv').hide();
            $('#getTweetDiv').hide();
        }
    });
}