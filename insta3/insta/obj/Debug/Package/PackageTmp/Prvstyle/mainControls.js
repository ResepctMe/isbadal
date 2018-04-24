/*

    SixDos - mainControls.js

    Repository of functions and references considered global
    through this application.

*/

/// <reference path = "jquery/jquery-1.9.1.min.js" />
/// <reference path = "jquery/jquery-ui-1.9.2.custom.min.js" />
/// <reference path = "alerts.js" />
/// <reference path = "dateControls.js" />
/// <reference path = "filtering.js" />
/// <reference path = "onLoad.js" />
/// <reference path = "advancedRules.js" />
/// <reference path = "Copy.js" />



// create namespace for term validation code
var MAIN = MAIN || {};

// global variables
MAIN.Globals = function () {

    // Global variables used throughout the application
    var excludedTerms = [], // Array of excluded terms not to be used in the pie data
        seed = '',  // original search term
        originalNextSearches = [], // original next search term (used if user closes a pie section to revert back)
        $hiddenRule = ' -is:retweet -RT lang:en',
        includRetweets = false, // hidden rule for aditional rules to be added to search term
        excludeHashtags = false, // hidden rule for aditional rules to be added to search term
        sourceJson = '', // Json returned from api call
        slideOn = 1, // set initial slide to 1
        existingTags = false;

    return {

        excludedTerms: excludedTerms, 
        seed: seed,  
        originalNextSearches: originalNextSearches,
        $hiddenRule: $hiddenRule,
        includRetweets: includRetweets,
        excludeHashtags: excludeHashtags,
        sourceJson: sourceJson,
        slideOn: slideOn,
        existingTags: existingTags

    };
};

var MG = MAIN.Globals();

var JSONString = "";
var JSONTweets = "";
var offsettest = 0;

/**
 * Substitute the nasties
* Call .xval() in place of .val() to READ values
 */
/*
Summary
 Validation function to prevent cross scripting
Params
 [Object] Sender.
Returns
 Validated input
*/
$.fn.xval = function () {
    return ($(this).val()) ? $(this).val().replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
}

$("#termBox").focus(function () {
    $("#termBox").keydown(function (event) {
        var $tag = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
        var termRule = $("#termBox").val;
        $tag.data({ 'data-rule': termRule });
        $('#rulesBox').append($tag);
    });
});


/*
Summary
 Button click to send INITIAL rule to gnip
Params
 [Object] Sender.
Returns
 Gnip Tweet search.
*/
$('#searchButton').click(function () {

    if (($('#termBox').val().indexOf('<') > -1) || ($('#termBox').val().indexOf('>') > -1) || ($('#termBox').val().indexOf(';') > -1) || ($('#termBox').val().indexOf(';') > -1) || ($('#termBox').val().indexOf(';') > -1)) {
        var alertBodyTexts = ['Invalid search term.'];
        DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
    } else {

        // clear any previous searches
        clearScreen('searchButton');

        if ($('#termBox').val()) {

            // check for tags
            $("#rulesBox .tm-tag").each(function () {


                var typeD = $(this).data('data-id');

                if (typeD == 'term2') {
                    $(this).remove();

                }

            });

            // check for tags
            $("#termsBox .tm-tag").each(function () {


                var typeD = $(this).data('data-id');

                if (typeD == 'term1') {
                    $(this).remove();

                }

            });

            var Html = '';
            var spanText = '';

            var termText = '' + $('#termBox').val() + '';
            var termRule = '';


            var $tag = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
            $divs = $tag.find('div');
            $imgs = $tag.find('img');
            $spans = $tag.find('span');

            var $imgs0 = $($imgs[0]);
            $imgs0.prop({ 'src': 'Images/applix.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });

            spanText += ' '; // ' + termText + ' 

            termRule = ' "' + termText + '" ';

            // set up tag html and data
            $tag.prop({ 'class': 'tm-tag' }).data({ 'data-rule': termRule, 'data-type': 'term', 'data-id': 'term1' });

            var $spans0 = $($spans[0]);
            $spans0.text(' ' + termText + ' ').css({ 'font-weight': 'bold' });

            var $spans1 = $($spans[1]);
            $spans1.text(spanText);

            var $divs1 = $($divs[1]);

            $divs1.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag2 = $tag.clone(); // clone original
            $tag2.data({ 'data-rule': termRule, 'data-type': 'term', 'data-id': 'term2' });

            $('#termsBox').append($tag);
            $('#rulesBox').append($tag2); // append to divs


        }

        // send seed to api call
        getCounts($('#termBox').val());
    }

});




/*
Summary
 Button click to send INITIAL rule to gnip
Params
 [Object] Sender.
Returns
 Gnip Tweet search.
*/
$('#btnGetTweets').click(function () {

    // send seed to api call
    getTweets(MG.$hiddenRule);
});




/*
Summary
 function to get timezone offset.
Params
 [Object] Sender.
Returns
 Get timezone offset.
*/
function get_time_zone_offset() {
    var current_date = new Date();
    return parseInt(-current_date.getTimezoneOffset());
}

var offSet = get_time_zone_offset();



/*
Summary
 Call api function to send data request to Gnip Api
Params
 [Object] Sender. Search ter string variable.
Returns
 Gnip Tweet search.
*/
function getCounts(searchTerm) {

    var d = new Date()
    var n = d.getTimezoneOffset();
    offsettest = n / 60;

    var urlFull = false;

    if ($("#fullArchiveCbx").is(':checked')) {
        urlFull = true;
    }

    // aquire date range to send to api
    var dateTimeFrom = $('#fromDateBox').val();
    var dateTimeUntil = $('#untilDateBox').val();

    var postedFrom = dateTimeFrom;
    var postedUntil = dateTimeUntil;

    // check what tie zone we are in 
    if (!IsInUSTimezone()) {
        var postedFromDate = postedFrom.split(' ')[0];
        var postedFromTime = postedFrom.split(' ')[1];

        var day = postedFromDate.split('/')[0];
        var month = postedFromDate.split('/')[1];
        var year = postedFromDate.split('/')[2];
        postedFrom = new Date(month + "/" + day + "/" + year + " " + postedFromTime);

        var postedUntilDate = postedUntil.split(' ')[0];
        var postedUntilTime = postedUntil.split(' ')[1];

        var day = postedUntilDate.split('/')[0];
        var month = postedUntilDate.split('/')[1];
        var year = postedUntilDate.split('/')[2];
        postedUntil = new Date(month + "/" + day + "/" + year + " " + postedUntilTime);
    } else {
        postedFrom = new Date(postedFrom);
        postedUntil = new Date(postedUntil);
    }

    var dif = dateDiffInDays(postedFrom, postedUntil);

    if (postedFrom < postedUntil && dif <= 30) { // calculate difference in days between from and until

        ruleBuilder(); // pass through rulebuilder

        // Convert to UK standard format for Gnip regulations
        dateTimeFrom = ProcessDateTime(dateTimeFrom, 'uk', true);
        dateTimeUntil = ProcessDateTime(dateTimeUntil, 'uk', true);

        var offSet = get_time_zone_offset(); // check server offset

        var rowArray = [];
        var fullArray = [];

        // size of dataset to bring back (max 500)
        var urlInt = 500;

        // actual amount returned from api
        var tweetCount = 0;

        // currently hard coded to not bring back reTweets and default language is English only
        MG.$hiddenRule += ' -is:retweet -RT ';
        searchTerm += MG.$hiddenRule;
        var termCount = 0;

        // check tags if they want retweets included then remove -is:retweets from rule 
        $(".tm-tag").each(function () {
            if ($(this).data('data-type') == 'extra') {

                if ($(this)[0].innerText.indexOf('RT') > -1) {
                    searchTerm = searchTerm.replace('-is:retweet -RT', '');

                } else {
                    if (searchTerm.indexOf(' -is:retweet -RT ') == -1) {
                        searchTerm = searchTerm + ' -is:retweet -RT ';
                    }
                }
            }
            
        });


        $('#ruleLabel').text('Rule: ' + searchTerm);

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
            url: "default.aspx/getSearch",
            data: JSON.stringify({ searchTerm: searchTerm, dateTimeFrom: dateTimeFrom, dateTimeUntil: dateTimeUntil, offsettest: offsettest, urlInt: urlInt, timeOffset: offSet, urlFull: urlFull }),
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
    } else {

        var errMsg = '';

        if (postedFrom > postedUntil) {

            errMsg = 'From date cannot be after Until date.';
        } else {
            errMsg = 'Maximum date range has to be 30 days, please reduce';
        }

        var alertBodyTexts = [errMsg];
        DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
        $('#chartDiv').hide();
        $('#getTweetDiv').hide();
    }
}

function updateMap(searchTerm, dateTimeFrom, dateTimeUntil, data)
{
    // as long as json is not an error message parse json
    if (data.d.indexOf('{\r\n  \"error\": {\r\n') === -1) {

        setTimeout(function () {

            var gnipJSON = JSON.parse(data.d);

            if (gnipJSON["output"].indexOf('Error') === -1)
            {
                var totalCount = gnipJSON["totalCount"];

                JSONString = searchTerm + "\n";
                JSONString += "Date\tTime\tCount\n";

                var chartTitle = '';

                if ($('#termBox').val()) {
                    chartTitle = 'Tweets per day for: ' + $('#termBox').val();
                } else {
                    chartTitle = 'Tweets per day from: ' + dateTimeFrom + ' to ' + dateTimeUntil;
                }

                // --------------------------------------------------------------------------------------------------------------------------------------------------------------
                JSONString += gnipJSON["output"];

                var arrOfCounts = [];

                var startYear = gnipJSON["startYear"];
                var startMonth = gnipJSON["startMonth"]; // months starting at January equal to 0
                var startDay = gnipJSON["startDay"];
                var startHour = gnipJSON["startHour"]; // to account for time difference
                var startMinute = gnipJSON["startMinute"];

                var jsonResultArray = gnipJSON["arrOfCounts"];


                chart(startYear, startMonth, startDay, startHour, startMinute, chartTitle, jsonResultArray, totalCount);

                $('#getTweetDiv').show();
                $('#SnapLoadingOverlay').hide();

            } else {

                var alertBodyTexts = ['Error with rule please check and try again.'];
                DisplayAlertBox('alert_edit_single', 'Error', alertBodyTexts, this);
                $('#chartDiv').hide();
                $('#getTweetDiv').hide();
            }


            
        }, 0);

        $('#btnGetTweets').show();

    } else {


        var alertBodyTexts = ['Error with rule please check and try again.'];
        DisplayAlertBox('alert_edit_single', 'Error', alertBodyTexts, this);
        $('#chartDiv').hide();
        $('#getTweetDiv').hide();
    }
}


/*
Summary
 Call api function to send data request to Gnip Api
Params
 [Object] Sender. Search ter string variable.
Returns
 Gnip Tweet search.
*/
function getTweets(searchTerm) {

    var urlFull = false;

    var searchTerm = $('#termBox').val() + ' ' + searchTerm;

    // check tags if they want retweets included then remove -is:retweets from rule 
    $(".tm-tag").each(function () {
        if ($(this).data('data-type') == 'extra') {

            if ($(this)[0].innerText.indexOf('RT') > -1) {
                searchTerm = searchTerm.replace('-is:retweet -RT', '');

             
            }
        }

    });

    if ($("#fullArchiveCbx").is(':checked')) {
        urlFull = true;
    }

    $('#addToQ').prop('disabled', false);
    $('#ExportToClipboard').prop('disabled', false);
    $('#addDataLabel').empty();
    $('#addDataLabelResp').empty();
    $('#addToQ').hide();
    $('#ExportToClipboard').hide();

    $('#tweetGridView').empty();
    $('#SnapLoadingOverlay').show();

    var returnedJson = '';

    var urlInt = '500';
    var dateTimeFrom = $('#fromDateBox').val();
    var dateTimeUntil = $('#untilDateBox').val();

    dateTimeFrom = ProcessDateTime(dateTimeFrom, 'uk', true);
    dateTimeUntil = ProcessDateTime(dateTimeUntil, 'uk', true);

    if (dateTimeFrom === undefined) {

        var untilDate = new Date();

        var fromDate = new Date();
        fromDate.setHours(0, 0, 0, 0);

        fromDate.setDate(untilDate.getDate() - 29);

        dateTimeFrom = SetInitialDateTime(fromDate);
        dateTimeUntil = SetInitialDateTime(untilDate);
    }

    // get tweets to fill tweet table

    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: "default.aspx/getTweets",
        data: JSON.stringify({ searchTerm: searchTerm, dateTimeFrom: dateTimeFrom, dateTimeUntil: dateTimeUntil, offsettest: offsettest, timeOffset: offSet, urlInt: urlInt, urlFull: urlFull }),
        dataType: "json",
        success: function (data) {

            returnedJson = JSON.stringify(data.d);
            MG.sourceJson = JSON.parse(returnedJson);          

            if ((data.d !== "") && (data.d !== '{"results":[]}') && (data.d.indexOf('{"error":{"message":') < 0)) {

                setTimeout(function () {

                    var $headerTable = $('<tr> <th><span></span></th> <th><span></span></th> <th><span></span></th> <th><span></span></th> <th><span></span></th> <th><span></span></th> <th><span></span></th></tr>');
                    $headerTable.prop({ 'class': 'gv' });
                    $headerTrs = $headerTable.find('tr');
                    $headerThs = $headerTable.find('th');
                    $headerSpans = $headerTable.find('span');

                    // header containers ===============================================================================================================

                    var $headerTrs0 = $($headerTrs[0]);
                    $headerTrs0.prop({ 'class': 'gvRowHead' });

                    var $headerThs0 = $($headerThs[0]);
                    $headerThs0.prop({ 'class': 'source' });

                    var $headerSpans0 = $($headerSpans[0]);
                    $headerSpans0.text('source');

                    var $headerThs1 = $($headerThs[1]);
                    $headerThs1.prop({ 'class': 'avatar' });
                    var $headerSpans1 = $($headerSpans[1]);
                    $headerSpans1.text('account');

                    var $headerThs2 = $($headerThs[2]);
                    $headerThs2.prop({ 'class': 'timePosted' });

                    var $headerSpans2 = $($headerSpans[2]);
                    $headerSpans2.text('time posted');

                    //var $headerThs3 = $($headerThs[3]);
                    //$headerThs3.prop({ 'class': 'account' });

                    //var $headerSpans3 = $($headerSpans[3]);
                    //$headerSpans3.text('account');

                    var $headerThs3 = $($headerThs[3]);
                    $headerThs3.prop({ 'class': 'content' });

                    var $headerSpans3 = $($headerSpans[3]);
                    $headerSpans3.text('content');

                    var $headerThs4 = $($headerThs[4]);
                    $headerThs4.prop({ 'class': 'location' });

                    var $headerSpans4 = $($headerSpans[4]);
                    $headerSpans4.text('location');

                    var $headerThs5 = $($headerThs[5]);
                    $headerThs5.prop({ 'class': 'klout' });

                    var $headerSpans5 = $($headerSpans[5]);
                    $headerSpans5.text('klout');

                    var $headerThs6 = $($headerThs[6]);
                    $headerThs6.prop({ 'class': 'follow' });

                    var $headerSpans6 = $($headerSpans[6]);
                    $headerSpans6.text('follow');

                    // ===================================================================================================================================

                    //$('#tweetGridView').append('<tr class="gvRowHead"><th scope="col"> source </th> <th scope="col"> avatar </th> <th scope="col"> time posted </th> <th scope="col"> account </th>  <th scope="col"> content </th> <th scope="col"> location </th> <th scope="col"> klout </th> <th scope="col"> follow </th></tr>');
                    $('#tweetGridView').append($headerTable);

                    gnipTweetJSON = JSON.parse(data.d);
                    // parse response
                    if (gnipTweetJSON != null) {

                        JSONTweets = searchTerm + "\n";

                        $.each(gnipTweetJSON.results, function (i, item) {                         

                            var avatar = gnipTweetJSON.results[i].actor.image;

                            var userSource = gnipTweetJSON.results[i].actor.link;
                            var tweetSource = gnipTweetJSON.results[i].link;

                            // set date
                            var postedTime = new Date(gnipTweetJSON.results[i].postedTime);
                            var datePosted = new Date();

                            var day = postedTime.getDate();
                            var month = postedTime.getMonth() + 1; //Months are zero based
                            var year = postedTime.getFullYear();
                            var hour = postedTime.getHours(); // + offSet;
                            var min = postedTime.getMinutes();
                            var sec = postedTime.getSeconds();

                            if (day < 10)
                                day = "0" + day;
                            if (month < 10)
                                month = "0" + month;
                            if (hour < 10)
                                hour = "0" + hour;
                            if (min < 10)
                                min = "0" + min;
                            if (sec < 10)
                                sec = "0" + sec;

                            if (IsInUSTimezone()) {
                                datePosted = month + "/" + day + "/" + year + " " + hour + ":" + min + ":" + sec;
                            } else {
                                datePosted = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
                            }

                            var newTimePeriod = datePosted;
                            //var newTimePeriod = ProcessDateTime(datePosted, 'local', true);

                            var displayName = gnipTweetJSON.results[i].actor.preferredUsername;
                            var body = gnipTweetJSON.results[i].body;

                            if (!gnipTweetJSON.results[i].actor.location) {
                                var location = '';
                            } else {
                                var location = gnipTweetJSON.results[i].actor.location.displayName;
                            }
                            var klout = gnipTweetJSON.results[i].gnip.klout_score;
                            var followersCount = gnipTweetJSON.results[i].actor.followersCount;

                            var userURL = gnipTweetJSON.results[i].link;

                            var sourceApp = gnipTweetJSON.results[i].generator.displayName;

                            var rowClass = 'gvAltRow';

                            var displayBody = body.replace(/\t/g, "");
                            displayBody = displayBody.replace(/\n/g, "");
                            JSONTweets += sourceApp + "\t" + displayName + "\t" + newTimePeriod + "\t" + displayBody + "\t" + location + "\t" + klout + "\t" + followersCount + "\n";

                            if (i % 2 === 0) {
                                rowClass = 'gvRow';
                            }
                            // fill table accordingly looping over each row
                            var $row = $('<tr><td><a><img /><div /></a></td> <td><a><img /><div /></a></td> <td></td> <td></td> <td></td> <td></td> <td></td></tr>');
                            $row.prop({ 'class': rowClass });

                            // set up containers
                            $tds = $row.find('td');
                            $as = $row.find('a');
                            $imgs = $row.find('img');

                            // source
                            var $tds0 = $($tds[0]);
                            $tds0.prop({ 'class': 'source' });
                            $tds0.find('a')
                                .prop({ 'href': tweetSource, 'target': '_blank' });
                            $tds0.find('img')
                                .prop({ 'src': 'images/twitter32.png' });
                            $tds0.find('div')
                                .html(sourceApp);

                            // avatar
                            var $tds1 = $($tds[1]);
                            $tds1.prop({ 'class': 'avatar' });
                            $tds1.find('a')
                                .prop({ 'href': userSource, 'target': '_blank' });
                            $tds1.find('img')
                                .prop({ 'src': avatar });
                            $tds1.find('div')
                                .html(displayName);

                            // time
                            var $tds2 = $($tds[2]);
                            $tds2.prop({ 'class': 'timePosted' }).text(datePosted);

                            // account
                            //var $tds3 = $($tds[3]);
                            //$tds3.prop({ 'class': 'account' }).text(displayName);

                            // content
                            var $tds3 = $($tds[3]);
                            $tds3.prop({ 'class': 'content' }).text(body);

                            // location
                            var $tds4 = $($tds[4]);
                            $tds4.prop({ 'class': 'location' }).text(location);

                            // klout
                            var $tds5 = $($tds[5]);
                            $tds5.prop({ 'class': 'klout' }).text(klout);

                            // follow
                            var $tds6 = $($tds[6]);
                            $tds6.prop({ 'class': 'followCount' }).text(followersCount);

                            $('#tweetGridView').append($row);
                            //$('#tweetGridView').append('<tr class="' + rowClass + '"><td align="center"> <a href="' + tweetSource + '" target="_blank"> <img src="images/twitter32.png" > </a> <br /> ' + sourceApp + ' </td> <td> <a href="' + userSource + '" target="_blank"> <img src="' + avatar + '" > </a> </td> <td> ' + newTimePeriod + ' </td> <td> ' + displayName + ' </td> <td> ' + body + ' </td> <td> ' + location + ' </td> <td> ' + klout + ' </td> <td> ' + followersCount + ' </td></tr>');

                        })
                        // show relevant controls
                        $('#addDataLabel').show();
                        $('#addToQ').show();
                        $('#ExportToClipboard').show();
                        $('#tweetDiv').show();
                        $('#gridDiv').show();
                        $('#SnapLoadingOverlay').hide();

                    } else {

                        var $trEmpty = $('<tr><td></td></tr>');
                        $trEmpty.prop({ 'class': 'gvRow' });
                        $tds = $trEmpty.find('td');
                     
                        var $tds0 = $($tds[0]);
                        $tds0.text(' No results found ');

                        $('#tweetGridView').append($trEmpty);

                    }
                    /* Inserting jQuery to autoscroll to tweet table */
                    $('html, body').animate({ scrollTop: $("#tweetGridView").offset().top }, 1000);

                }, 2000);

                if ($('#termBox').val()) {
                    $('#addDataLabel').text("Most recent Tweets for: '" + $('#termBox').val() + "' from (" + dateTimeFrom + " - " + dateTimeUntil + ")");
                } else {
                    $('#addDataLabel').text("Most recent Tweets from (" + dateTimeFrom + " - " + dateTimeUntil + ")");
                }

                
            } else {

                var alertBodyTexts = ['No Tweets available at this time.'];
                DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
                $('#tweetDiv').hide();
                $('#gridDiv').hide();
                $('#SnapLoadingOverlay').hide();
            }

        },
        error: function (err) {

            var alertBodyTexts = [err.responseText];
            DisplayAlertBox('alert_edit_single', 'Error', alertBodyTexts, this);
            $('#SnapLoadingOverlay').hide();
        }
    });
}




/*
Summary
 Clears the Tweet table pop up (sender is Veiw Tweet button o each pieCard)
Params
 [Object] Sender. 
Returns
 -
*/
$('.tweetTable').on('click', '#searchclear', function () {
    
    $('.tweetTable').hide();
    $('.tweetTable').empty();

});




/*
Summary
 Clears all input and html
Params
 [Object] Sender. 
Returns
 -
*/
function clearScreen(sender) {

    $('#ruleLabel').empty();
    $('#chartDiv').empty();
    $('#getTweetDiv').hide();
    $('#tweetDiv').hide();
    $('#gridDiv').hide();
    
    $('.AccountCheckboxs input').prop("checked", true);

    //location.reload(true);
    MG.originalNextSearches = [];
    MG.$hiddenRule = '';

    //Clear checkboxes in advmenu
    $('input.clearCB').each(function () {

        $(this).prop({ 'checked': false });

    });
    // temp fix for full arch box not being clickable with clearCB class
    //$('#fullArchiveCbx').prop({ 'checked': true })

    if (sender != 'searchButton') {
        $('#termBox').val('');
        $('input[type=text]').val('');
        clearAdvanced();
    } 

};


// tabletorientation
/**
 * Detect tablet
 * Note - Nasty browser-sniff!
 */
function IsTablet() {
    var isMobile = false;
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;
    //return true;
    return isMobile;
}

/**
 * Display an overlay and image advising to rotate to portrait on mobile devices
 */
function EnforceLandscape() {
    var w = window,
        $w = $(w),
        x = $w.outerWidth(),
        y = $w.outerHeight(),
        ori = w.orientation,
        $plsrotate = $('#plsrotate');

    // window property-based
    // comment out the switch block for testing on desktop and uncomment if (y > x)
    switch (ori) {
        case 90:
        case -90:
            $plsrotate.fadeOut(150);
            break;
        default:
            $plsrotate.fadeInFlex(150, function () {
                $plsrotate.find('.modal-popup-flex').fadeInFlex(150);
            });
            break;
    };
}

/**
 * Short-hand function for fading-in a modal with 'flex' display property
 * @param d {number} delay in ms to apply to fadeIn animation
 * @param cb {function} callback function to execute on animation completion
 */
$.fn.fadeInFlex = function (d, cb) {
    if ($(this).is(':hidden')) {
        d = (!d) ? 150 : d; // default delay to 150ms if ommitted
        cb = (!cb) ? null : cb; // null callback if ommitted
        return this.each(function () {
            $(this).css('display', 'flex').hide().fadeIn(d, cb);
        });
    }
};


