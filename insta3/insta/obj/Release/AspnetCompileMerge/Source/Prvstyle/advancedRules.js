/*
 
    Replay - onLoad.js
 
    Script for load functions.
 
*/

/// <reference path = "mainControls.js" />




/*
Summary
 Loads up advanced modal.
Params
 [None]
Returns
 Advanced Modal.
*/
function loadAdvanced() {

    // Refresh map
    $('#btnRefreshMap').click();

    var geoExists = false; // variable to state if a geo rule exists

    // if termBox val exists populate termBox slide
    if ($('#termBox').val()) {
        $('#termBox2').val($('#termBox').val());
    }

    // check each tag that has been created, if type of geo exists set geoExists to true
    $("#rulesBox .tm-tag").each(function () {

        var typeD = $(this).data('data-type');

        if (typeD == 'geo') {
            geoExists = true;
        }

    });

    // else null and instance of bounding box then reload
    if (geoExists == false) {

        if (newRect) {
            newRect.setMap(null);
            newRect = null;
        }

        DoGeo(this);
    }

    // if no tags present set stage to 1 and hide rules box
    if ($('.tm-tag').length == 0) {

        $('#rulesBox').hide();

        stageOn(1);
        $('#btnSubmitAdv').prop("disabled", true);
        //$('#btnSum').prop("disabled", true);

        var slideW = $('#slides').width() + 3.5;
        $('#slides').animate({ scrollLeft: -slideW }, 200);

        MG.existingTags = false;
    } else {
        $('#rulesBox').show();
        MG.existingTags = true;
    }

    // Fade in the page dimmer and then the map modal.
    $('#panelOverlay').fadeIn(150, function () {
        $('#gMapModal').fadeIn(150, function () {


        });
    });

}





/*
Summary
 Button slider controls.
Params
 [None]
Returns
 Selected slide.
*/
$('#btnTerm').click(function () {

    MG.slideOn = 1; // we are on stage 1

    stageOn(MG.slideOn);

    var tagCount = 0;

    // count tags and increment tagCounts
    $("#rulesBox .tm-tag").each(function () {
        tagCount++;
    });

    if (tagCount > 0) {
        $('#clearAdvanced').show(); // clear advanced show btn
    } else {
        $('#clearAdvanced').hide();
    }

    // move slides
    var slideW = $('#slides').width() + 3.5;


    $('#slides').animate({ scrollLeft: -slideW }, 200);

});

// DEPRICATED
//$('#btnEx').click(function () {

//    MG.slideOn = 2;

//    stageOn(MG.slideOn);

//    var slideW = $('#slides').width() + 3.5;


//    $('#slides').animate({ scrollLeft: slideW }, 200);
//});

// Show POI slide
$('#btnPOI').click(function () {

    MG.slideOn = 2;

    stageOn(MG.slideOn);

    // move the slide
    var slideW = $('#slides').outerWidth() + 3.5;


    $('#slides').animate({ scrollLeft: slideW + slideW }, 200);
});

// Show MAP slide
$('#btnMap').click(function () {

    MG.slideOn = 3;

    stageOn(MG.slideOn);

    // move slide
    var slideW = $('#slides').width() + 3.5;


    $('#slides').animate({ scrollLeft: slideW + slideW + slideW }, 200);
});

// Show ACCOUNT slide
$('#btnAcc').click(function () {

    MG.slideOn = 4;

    stageOn(MG.slideOn);

    // move slides
    var slideW = $('#slides').width() + 3.5;


    $('#slides').animate({ scrollLeft: slideW + slideW + slideW + slideW }, 200);
});

// Show OPTIONS slide
$('#btnOp').click(function () {

    MG.slideOn = 5;

    stageOn(MG.slideOn);

    // move slides
    var slideW = $('#slides').width() + 3.5;



    $('#slides').animate({ scrollLeft: slideW + slideW + slideW + slideW + slideW }, 200);

});

//$('#btnSum').click(function () {

//    MG.slideOn = 6;

//    stageOn(MG.slideOn);

//    var tagCount = 0;

//    $("#rulesBox .tm-tag").each(function () {
//        tagCount++;
//    });

//    if (tagCount > 0) {
//        $('#clearAdvanced').show();
//    } else {
//        $('#clearAdvanced').hide();
//    }

//    // move slides
//    var slideW = $('#slides').width() + 3.5;


//    $('#slides').animate({ scrollLeft: slideW + slideW + slideW + slideW + slideW }, 200);

//});




/*
Summary
 Functios that controls the css of the slider buttons depending on what slideID is passed in.
Params
 [None]
Returns
 Selected slide.
*/
function stageOn(slideID) {

    var ruleCount = 0;

    // Hide non displayed slides
    $('#slides').children().css("display", "none");

    switch (slideID) {
        case 1:
            //$('#summarySlide').show('slide', { direction: 'right' }, 200);
            $('#summarySlide').css("display", "inline-block");
            break;
        case 2:
            $('#poiSlide').css("display", "inline-block");
            break;
        case 3:
            $('#mapSlide').css("display", "inline-block");
            $('#btnRefreshMap').click();
            break;
        case 4:
            $('#accountSlide').css("display", "inline-block");
            break;
        case 5:
            $('#optionSlide').css("display", "inline-block");
    }

    // show we are on stage 1
    if (slideID == 1) {
        $('#btnBackAdv').prop("disabled", true);
        //$('#btnBackAdv').hide();
    } else {
        $('#btnBackAdv').prop("disabled", false);
        //$('#btnBackAdv').show();
    }

    if (slideID == 5) {
        $('#btnForwardAdv').prop("disabled", true);
        //$('#btnForwardAdv').hide();
    } else {
        $('#btnForwardAdv').prop("disabled", false);
        //$('#btnForwardAdv').show();
    }

    $(".tm-tag").each(function () {
        ruleCount++;
    });


    // either clear of set the css background of each buttons
    $('.advBtnSlider').each(function () {
        if ($(this).attr('data-Btn') != slideID) {
            $(this)[0].style.background = "";
        } else {
            $(this)[0].style.background = "#c3c3c3";
        }
    });

}








/*
Summary
 Button slider controls.
Params
 [None]
Returns
 Selected slide.
*/
$('#gMapModal').on('click', '#btnAddTermEx', function () {

    if ($("#exclusionBox").val() || $("#termBox2").val()) {

        // Check for special charachters to make sure no injection attacks can be made
        if (($('#exclusionBox').val().indexOf('<') > -1) || ($('#exclusionBox').val().indexOf('>') > -1) || ($('#exclusionBox').val().indexOf(';') > -1) || ($('#termBox2').val().indexOf('<') > -1) || ($('#termBox2').val().indexOf('>') > -1) || ($('#termBox2').val().indexOf(';') > -1)) {
            var alertBodyTexts = ['Invalid rule.'];
            DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
        } else {

            var Html = '';
            var HtmlEx = '';
            var spanText = '';
            var spanTextEx = '';

            var termText = '' + $('#termBox2').val() + '';
            var termTextEx = '' + $('#exclusionBox').val() + '';
            var termRule = '';
            var termRuleEx = '';


            var $tag = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
            $divs = $tag.find('div');
            $imgs = $tag.find('img');
            $spans = $tag.find('span');

            var $imgs0 = $($imgs[0]);
            $imgs0.prop({ 'src': 'Images/applix.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });



            spanText += ' '; // ' + termText + ' 

            if (!$('#inUrlsCB').is(':checked')) {
                termRule = ' ' + termText + ' ';
            } else {
                termRule = ' url_contains:' + termText + ' ';
            }

            if (termTextEx != "") {

                spanTextEx += ' '; //' + termTextEx + ' 

                if (!$('#inUrlsCBex').is(':checked')) {
                    termRuleEx = ' -' + termTextEx + ' ';
                } else {
                    termRuleEx = ' -url_contains:' + termTextEx + ' ';
                }

            }



            var $tag3 = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
            $divs2 = $tag3.find('div');
            $imgs2 = $tag3.find('img');
            $spans2 = $tag3.find('span');

            var $imgs20 = $($imgs2[0]);
            $imgs20.prop({ 'src': 'Images/exclusion.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });


            // set up tag html and data
            $tag.prop({ 'class': 'tm-tag' }).data({ 'data-rule': termRule, 'data-type': 'term' });

            var $spans0 = $($spans[0]);
            $spans0.text(' ' + termText + ' ').css({ 'font-weight': 'bold' });

            var $spans1 = $($spans[1]);
            $spans1.text(spanText);

            var $divs1 = $($divs[1]);

            $divs1.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag2 = $tag.clone(); // clone original
            $tag2.data({ 'data-rule': termRule, 'data-type': 'term' });


            // Exclusion
            $tag3.prop({ 'class': 'tm-tag' }).data({ 'data-rule': termRuleEx });

            var $spans20 = $($spans2[0]);
            $spans20.text(' ' + termTextEx + ' ').css({ 'font-weight': 'bold' });

            var $spans21 = $($spans2[1]);
            $spans21.text(spanTextEx);

            var $divs21 = $($divs2[1]);
            $divs21.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag4 = $tag3.clone(); // clone for rulesBox
            $tag4.data({ 'data-rule': termRuleEx });




            // append accordingly
            if (termRule != '') {

                if ($('#termBox2').val() != "") {
                    $('#termsBox').append($tag);
                    $('#rulesBox').append($tag2); // append to divs
                }
            }

            if (termTextEx != '') {
                if ($('#exclusionBox').val() != "") {
                    $('#termsBox').append($tag3);
                    $('#rulesBox').append($tag4); // append to divs
                }
            }

            $('#btnSubmitAdv').prop("disabled", false);
            $('#btnForwardAdv').prop("disabled", false);

            ruleBuilder();  // pass through rulebuilder

            // reset controls
            $('#exclusionBox').val('');
            $('#termBox2').val('');
            $('#inUrlsCB').prop('checked', false);
            $('#inUrlsCBex').prop('checked', false);
        }
    } else {

        var alertBodyTexts = ['Please enter a new exclusion or term.'];
        DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
    }

});




/*
Summary
 Add poi button.
Params
 [None]
Returns
 Creates poi tag and adds selection to rules.
*/
$('#gMapModal').on('click', '#btnAddPOI', function () {

    $('#poiMenCB').prop('checked', true);

    // add selected attributes to array
    var selected = [];
    $('#gMapModal #poiSlide input:checked').each(function () {
        selected.push($(this).attr('id'));
    });

    // check value exists
    if (($("#poiBox").val() || $("#poiExBox").val()) && selected.length > 0) {

        if ($('#poiBox').val().indexOf('"') > -1) {
            $('#poiBox').val($('#poiBox').val().replace(/"/g, ""));// replace any quotes as this is handle further down the line
        }
        // check for special charachters
        if (($('#poiBox').val().indexOf('<') > -1) || ($('#poiBox').val().indexOf('>') > -1) || ($('#poiBox').val().indexOf(';') > -1) || ($('#poiExBox').val().indexOf('<') > -1) || ($('#poiExBox').val().indexOf('>') > -1) || ($('#poiExBox').val().indexOf(';') > -1)) { //  || ($('#poiBox').val().indexOf(')') > -1) || ($('#poiBox').val().indexOf('(') > -1)  || ($('#poiExBox').val().indexOf(')') > -1) || ($('#poiExBox').val().indexOf('(') > -1)
            var alertBodyTexts = ['Invalid rule.'];
            DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);

        } else {

            var Html = '';
            var HtmlEx = '';
            var spanText = '';
            var spanTextEx = '';

            var poiText = '' + $('#poiBox').val() + '';
            var poiTextEx = '' + $('#poiExBox').val() + '';
            var poiRule = '';
            var poiRuleEx = '';

            // set up div html

            var $tag = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
            $divs = $tag.find('div');
            $imgs = $tag.find('img');
            $spans = $tag.find('span');

            var $imgs0 = $($imgs[0]);
            $imgs0.prop({ 'src': 'Images/redMarker.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });


            var $tag3 = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
            $divs2 = $tag3.find('div');
            $imgs2 = $tag3.find('img');
            $spans2 = $tag3.find('span');

            var $imgs20 = $($imgs2[0]);
            $imgs20.prop({ 'src': 'Images/redMarkerEx.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });


            if (poiText != '') {
                var classInput = [['#mentionedCB', 'Mentioned', ''], ['#localityCB', 'Bio', 'profile_locality:'], ['#localityCB', '', 'profile_region:']];
                var dataReturn = accountBuildRule('"' + poiText + '"', '', classInput);
                poiRule = dataReturn[0];
                spanText = dataReturn[1];
            }

            if (poiTextEx != '') {
                var classInput = [['#exMentionedCB', 'Mentioned', ''], ['#exLocalityCB', 'Bio', 'profile_locality:'], ['#exLocalityCB', '', 'profile_region:']];
                var dataReturn = accountBuildRule('"' + poiTextEx + '"', 'ex', classInput);
                poiRuleEx = dataReturn[0];
                spanTextEx = dataReturn[1];
            }


            // set up tag html
            $tag.prop({ 'class': 'tm-tag' }).data({ 'data-rule': poiRule, 'data-type': 'poi' });

            var $spans0 = $($spans[0]);
            $spans0.text(' ' + poiText + ' ').css({ 'font-weight': 'bold' });

            var $spans1 = $($spans[1]);
            $spans1.text(spanText);

            var $divs1 = $($divs[1]);
            $divs1.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag2 = $tag.clone(); // clone for rulesBox
            $tag2.data({ 'data-rule': poiRule, 'data-type': 'poi' });

            // poiEx
            $tag3.prop({ 'class': 'tm-tag' }).data({ 'data-rule': poiRuleEx });

            var $spans20 = $($spans2[0]);
            $spans20.text(' ' + poiTextEx + ' ').css({ 'font-weight': 'bold' });

            var $spans21 = $($spans2[1]);
            $spans21.text(spanTextEx);

            var $divs21 = $($divs2[1]);
            $divs21.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag4 = $tag3.clone(); // clone for rulesBox
            $tag4.data({ 'data-rule': poiRuleEx });


            //removeDataType('poi');



            // append accordingly
            if (poiText != '') {

                $('#poiBoxRule').append($tag);
                $('#rulesBox').append($tag2);
            }

            if (poiTextEx != '') {

                $('#poiBoxRule').append($tag3);
                $('#rulesBox').append($tag4);
            }

            $('#btnSubmitAdv').prop("disabled", false);
            $('#btnForwardAdv').prop("disabled", false);

            ruleBuilder();

            // reset controls
            $('#poiBox').val('');
            $('#poiExBox').val('');
            $('#bioCB').prop('checked', false);
            $('#gpsCB').prop('checked', true);
            $('#poiMenCB').prop('checked', false);
        }

    } else {

        var alertBodyTexts = ['Please enter a new POI with at least one option!'];
        DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
    }
    //} else {

    //    var alertBodyTexts = ['Please remomve previous POI rule - only one aloud.'];
    //    DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
    //}

});



// remove datatype funtion used to remove data if selected by user
function removeDataType(dataType) {


    $(".tm-tag").each(function () {
        if ($(this).data('data-type') != undefined) {
            var thisType = $(this).data('data-type').trim();
            if (thisType == dataType) {
                $(this).remove();

            }
        }
    });

}




/*
Summary
 The following set bounding box rule.
Params
 n/a
Returns
 Map tag.
*/
$('#btnGeoSave').click(function () {

    //if ($('#mapBoxRule').html().trim() === "") {

    var Html = '';
    var spanText = '';

    //spans += '<img src="Images/poi.png" class="tm-tag-pic" width="18" height="18"><b> BB </b> ';

    var $tag = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
    $divs = $tag.find('div');
    $imgs = $tag.find('img');
    $spans = $tag.find('span');

    var $imgs0 = $($imgs[0]);
    $imgs0.prop({ 'src': 'Images/poi.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });

    // set coordinate information
    var swLat = $("#sw-lat").val();
    spanText += ' [' + parseFloat(swLat).toFixed(2) + ' ';
    var swLon = $("#sw-lon").val();
    spanText += ' ' + parseFloat(swLon).toFixed(2) + ' ';
    var neLat = $("#ne-lat").val();
    spanText += ' ' + parseFloat(neLat).toFixed(2) + ' ';
    var neLon = $("#ne-lon").val();
    spanText += ' ' + parseFloat(neLon).toFixed(2) + '] ';

    var boundingCoords = ' bounding_box:[' + $('#sw-lon').val() + ' ' + $('#sw-lat').val() + ' ' + $('#ne-lon').val() + ' ' + $('#ne-lat').val() + '] ';

    $tag.prop({ 'class': 'tm-tag' }).data({ 'data-rule': boundingCoords, 'data-type': 'geo' });

    var $spans0 = $($spans[0]);
    $spans0.text(' BB ').css({ 'font-weight': 'bold' });

    var $spans1 = $($spans[1]);
    $spans1.text(spanText);

    var $divs1 = $($divs[1]);
    $divs1.prop({ 'class': 'tm-tag-remove', 'id': 'geoRemove' }).html('&#10006;');

    var $tag2 = $tag.clone();
    $tag2.data({ 'data-rule': boundingCoords, 'data-type': 'geo' });
    //Html += " <div class='tm-tag' data-type='geo' data-rule='" + boundingCoords + "'><div>" + spans + "<div class='tm-tag-remove' id='geoRemove'>&#10006;</div></div></div>";

    removeDataType('geo');

    //if ($('div[data-type="geo"]')) {
    //    $('div[data-type="geo"]').remove();
    //}

    $('#mapBoxRule').append($tag);
    $('#rulesBox').append($tag2);
    //$('#btnSum').prop("disabled", false);
    $('#btnSubmitAdv').prop("disabled", false);
    $('#btnForwardAdv').prop("disabled", false);

    ruleBuilder(); // pass through rule builder

    //} else {

    //    var alertBodyTexts = ['Please remomve previous map rule - only one aloud.'];
    //    DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
    //}

});




// remove bounding box if set
$('#gMapModal').on('click', '#geoRemove', function () {
    if (newRect) {
        newRect.setMap(null);
        newRect = null;
        $('#cbManualBound').prop('checked', false);
        $('#cbManualBounds').parent().prop('class', 'cb-wrapper');
    }

});


function accountBuildRule(input, type, classInput) {

    var rule = '';

    var spanText = '';

    $.each(classInput, function (index, value) {

        if ($(value[0]).is(':checked') && rule == '') {
            rule = value[2] + input;
            if (value.length > 3)
            {
                rule += value[3];
            }
            spanText += ' ' + value[1];
        }
        else if ($(value[0]).is(':checked') && rule != '') {
            rule += ' OR ' + value[2] + input;
            if (value.length > 3)
            {
                rule += value[3];
            }
            spanText += ' ' + value[1];
        }
    });    

    if (rule.indexOf("OR") >= 0) {
        rule = '(' + rule + ')';
    }

    if(type == 'ex')
    {
        rule = ' -' + rule;
    }

    return [rule,spanText];
}


/*
Summary
 Add Twitter account btn.
Params
 [None]
Returns
 Rule to monitor user accounts.
*/
$('#gMapModal').on('click', '#btnAddAccount', function () {

    // check for selected options (checkboxes)
    var selected = [];
    $('#gMapModal #accountSlide input:checked').each(function () {
        selected.push($(this).attr('id'));
    });

    // make sure name has length
    if (($("#accountBox").val() || $("#accountEx").val()) && selected.length > 0) {
        // check for special charachters
        if (($('#accountBox').val().indexOf('<') > -1) || ($('#accountBox').val().indexOf('>') > -1) || ($('#accountBox').val().indexOf(';') > -1) || ($('#accountEx').val().indexOf('<') > -1) || ($('#accountEx').val().indexOf('>') > -1) || ($('#accountEx').val().indexOf(';') > -1)) { //  || ($('#accountBox').val().indexOf(')') > -1) || ($('#accountBox').val().indexOf('(') > -1)  || ($('#accountEx').val().indexOf(')') > -1) || ($('#accountEx').val().indexOf('(') > -1)
            var alertBodyTexts = ['Invalid account name.'];
            DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);

        } else {

            var Html = '';
            var HtmlEx = '';
            var spanText = '';
            var spansTextEx = '';
            var account = '' + $('#accountBox').val().replace('@', '') + '';
            var accountRule = '';
            var accountEx = '' + $('#accountEx').val().replace('@', '') + '';
            var accountExRule = '';


            // set up html tag
            var $tag = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
            $divs = $tag.find('div');
            $imgs = $tag.find('img');
            $spans = $tag.find('span');

            var $imgs0 = $($imgs[0]);
            $imgs0.prop({ 'src': 'Images/account.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });

            var $tag2 = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
            $divs2 = $tag2.find('div');
            $imgs2 = $tag2.find('img');
            $spans2 = $tag2.find('span');

            var $imgs20 = $($imgs2[0]);
            $imgs20.prop({ 'src': 'Images/accountEx.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });

            if(account != '')
            {
                var classInput = [['#accFromCB', 'From', 'from:'], ['#accToCB', 'To', 'to:'], ['#accAtCB', '@', '@']];
                var dataReturn = accountBuildRule(account, '', classInput);
                accountRule = dataReturn[0];
                spanText = dataReturn[1];
            }

            if(accountEx != '')
            {
                var classInput = [['#exAccFromCB', 'From', 'from:'], ['#exAccToCB', 'To', 'to:'], ['#exAccAtCB', '@', '@']];
                var dataReturn = accountBuildRule(accountEx, 'ex', classInput);
                accountExRule = dataReturn[0];
                spansTextEx = dataReturn[1];
            }



            // create tag
            $tag.prop({ 'class': 'tm-tag' }).data({ 'data-rule': accountRule, 'data-type': 'account' });

            var $spans0 = $($spans[0]);
            $spans0.text(' ' + account + ' ').css({ 'font-weight': 'bold' });

            var $spans1 = $($spans[1]);
            $spans1.text(spanText);

            var $divs1 = $($divs[1]);
            $divs1.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag3 = $tag.clone();
            $tag3.data({ 'data-rule': accountRule, 'data-type': 'account' });


            $tag2.prop({ 'class': 'tm-tag' }).data({ 'data-rule': accountExRule });

            var $spans20 = $($spans2[0]);
            $spans20.text(' ' + accountEx + ' ').css({ 'font-weight': 'bold' });

            var $spans21 = $($spans2[1]);
            $spans21.text(spansTextEx);

            var $divs21 = $($divs2[1]);
            $divs21.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag4 = $tag2.clone();
            $tag4.data({ 'data-rule': accountExRule });

            // append accordingly
            if (account != '') {
                //Html += " <div class='tm-tag' data-type='account' data-rule='" + accountRule + "'><div>" + spans + "<div class='tm-tag-remove'>&#10006;</div></div></div>";
                $('#accountBoxRule').append($tag);
                $('#rulesBox').append($tag3);
            }

            if (accountEx != '') {
                //HtmlEx += " <div class='tm-tag' data-type='account' data-rule='" + accountExRule + "'><div>" + spansEx + "<div class='tm-tag-remove'>&#10006;</div></div></div>";
                $('#accountBoxRule').append($tag2);
                $('#rulesBox').append($tag4);
            }

            //$('#btnSum').prop("disabled", false);
            $('#btnSubmitAdv').prop("disabled", false);
            $('#btnForwardAdv').prop("disabled", false);

            ruleBuilder(); // pass through rulebuilder

            // reset controls
            $('#accountBox').val('');
            $('#accountEx').val('');
            //$('#accFromCB').prop('checked', true);
            //$('#accToCB').prop('checked', false);
            //$('#accAtCB').prop('checked', false);
        }

    } else {

        var alertBodyTexts = ['Please enter an account with at least one option!'];
        DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
    }

});





/*
Summary
 Button to add extra options.
Params
 [None]
Returns
 creates option rule and tag
*/
$('#gMapModal').on('click', '#btnAddOption', function () {


    var extraChosen = false; // variable to say if optin has been selected

    // gather attributes for selected options
    var selected = [];
    $('#gMapModal #optionSlide input:checked').each(function () {
        selected.push($(this).attr('id'));
    });


    var Html = '';
    var spanText = '';
    var mediaRule = '';
    // set up html for tag
    var $tag = $('<div>  <div>  <img />  <span />  <span />  <div>  </div>    </div>  </div>');
    $divs = $tag.find('div');
    $imgs = $tag.find('img');
    $spans = $tag.find('span');

    var $imgs0 = $($imgs[0]);
    $imgs0.prop({ 'src': 'Images/optionsCog.png', 'height': 18, 'width': 18, 'class': 'tm-tag-pic' });


    if ($('#geoCB_clearCB').is(':checked'))
    {      
        mediaRule += 'has:geo';
        spanText += 'Geo ';
    }

    if ($('#mediaCB_clearCB').is(':checked')) {

        if (mediaRule != '') {
            mediaRule = '(' + mediaRule + ' OR has:media)';
            spanText += '& ';
        }
        else
        {
            mediaRule = 'has:media';
        }
        spanText += 'Media ';
    }

    if ($('#Checkbox1_clearCB').is(':checked'))
    {
        if (mediaRule != '') {
            spanText += '& ';
        }
        spanText += ' RT ';
    }

    //if ($("#languageSelect option:selected").val() != 'all') {

    extraChosen = true;

    var selectLang = $("#languageSelect option:selected").val();

    // add language if selected
    lang = ' lang:' + selectLang + ' ';

    var fullLnag = $("#languageSelect option:selected").text();

    if (spanText != '')
    {
        spanText += '&'
    }

    if (fullLnag != "All")
    {
        spanText += ' ' + fullLnag + ' ';
    }
    else
    {
        spanText = spanText.slice(0, -1);
    }
    

    if ((lang === " lang:All ") || lang === " lang:all ") {

        MG.$hiddenRule = MG.$hiddenRule.replace('lang:en', '');

    } else {

        mediaRule += lang;
    }
    //}

    if (spanText != "") {

        if (extraChosen == true) { // extra has been chosen so add tag and add to rule

            $tag.prop({ 'class': 'tm-tag' }).data({ 'data-rule': mediaRule, 'data-type': 'extra' });

            var $spans0 = $($spans[0]);
            $spans0.text(' ').css({ 'font-weight': 'bold' });
            //$spans0.text(' Extra ').css({ 'font-weight': 'bold' });

            var $spans1 = $($spans[1]);
            $spans1.text(spanText);

            var $divs1 = $($divs[1]);
            $divs1.prop({ 'class': 'tm-tag-remove' }).html('&#10006;');

            var $tag2 = $tag.clone();
            $tag2.data({ 'data-rule': mediaRule, 'data-type': 'extra' });

            //Html += " <div class='tm-tag' data-type='extra' data-rule='" + mediaRule + "'><div>" + spans + "<div class='tm-tag-remove'>&#10006;</div></div></div>";

            removeDataType('extra');

            //if ($('div[data-type="extra"]')) {
            //    $('div[data-type="extra"]').remove();
            //}

            $('#optionsBoxRule').append($tag);
            $('#rulesBox').append($tag2);
            //$('#btnSum').prop("disabled", false);
            $('#btnSubmitAdv').prop("disabled", false);
            $('#btnForwardAdv').prop("disabled", false);

            ruleBuilder(); // pass through rule builder

            // reset controls
            //$('#languageSelect').val('');
            //$('#geoCB').prop('checked', false);
            //$('#mediaCB').prop('checked', false);
        } else {
            var alertBodyTexts = ['Please select at least one option!'];
            DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
        }
    }
    else {
        removeDataType('extra');
    }

    


    //} else {

    //    var alertBodyTexts = ['Only one extra option allowed.'];
    //    DisplayAlertBox('alert_edit_single', 'Warning', alertBodyTexts, this);
    //}

});




/*
Summary
 The following removes tag affiliated with being closed by user, if no tags then box is cleared.
Params
 [Object] sender - The HTML element that triggered the function i.e. the tag selected close button.
Returns
 Removes tag from HTML.
*/
$('#gMapModal').on('click', '[class^=tm-tag-remove]', function () {

    //var ruleToRemove = $(this).parent().parent()[0].attributes['data-rule'].value.trim();
    var ruleToRemove = $(this).parent().parent().data()['data-rule'].trim();
    $(this).parent().parent().remove();

    // reset includeRetweets boolean
    //if ($(this).parent().parent()[0].innerText.indexOf('Extra Options') > 0) {
    //    MG.includRetweets = false;
    //}

    // check each tag if it meets the criteria remove from the UI
    $(".tm-tag").each(function () {
        if ($(this).data('data-rule') != undefined) {
            var thisDdata = $(this).data('data-rule').trim();

            if (thisDdata == ruleToRemove) {

                if (($(this).data('data-id') == 'term1') || ($(this).data('data-id') == 'term2')) {
                    $('#termBox').val('');
                    $('#termBox2').val('');
                }

                $(this).remove();

            }
        }
    });

    if ($('.tm-tag').length == 0) {

        MG.existingTags = false;
        $('#clearAdvanced').hide();
        //$('#btnSum').prop("disabled", true);
        //$('#btnSubmitAdv').prop("disabled", true);

        // reset to slide 1
        if (MG.slideOn == 6) {
            var slideW = $('#slides').width() + 3.5;
            $('#slides').animate({ scrollLeft: -slideW }, 200);
            MG.slideOn = 1;
            stageOn(MG.slideOn);

        }
    }


    $('#ruleLabel').empty();

    ruleBuilder(); // reset rule to new tag rules
});




/*
Summary
 Builds the rule based on the users selected items.
Params
 [None]
Returns
 Valid rule string to be sent to Gnip
*/
function ruleBuilder() {

    MG.$hiddenRule = '';

    var tagCount = 0;
    var seedTerm = $('#termBox').val();
    var accounts = [];
    var accountsRule = '';
    var pois = [];
    var poisRule = '';
    var terms = [];
    var termsRule = '';
    var extras = [];
    var extrasRule = '';

    // check for tags
    $("#rulesBox .tm-tag").each(function () {

        tagCount++;

        var typeD = $(this).data('data-type');

        if (typeD == 'account') {
            accounts.push($(this).data('data-rule')); // acoutns can deal with multiples so check for this

        } else if (typeD == 'poi') {

            pois.push($(this).data('data-rule')); // acoutns can deal with multiples so check for this

        }
        else if (typeD == 'term') {

            if (($(this).data('data-id') != 'term1') && ($(this).data('data-id') != 'term2')) {
                terms.push($(this).data('data-rule')); // acoutns can deal with multiples so check for this
            }

        }
        else if (typeD == 'extra') {

            extras.push($(this).data('data-rule')); // acoutns can deal with multiples so check for this

        }

    });

    // use regex to make sure accounts are wrapped in brackets accordingly
    //if (accounts != '') {

    //    accounts = accounts.replace(/\ OR /g, ' ');
    //    accounts = accounts.replace(/\(/g, '');
    //    accounts = accounts.replace(/\)/g, '');
    //    accounts = accounts.replace(/ /g, ' ');
    //    accounts = accounts.replace(/  /g, ' ');
    //    accounts = $.trim(accounts);
    //    accounts = accounts.replace(/ /g, ' OR ');
    //    accounts = ' (' + accounts + ') ';

    //    MG.$hiddenRule += accounts;
    //}

    // use regex to make sure accounts are wrapped in brackets accordingly
    if (pois.length) {

        var total = pois.length;
        var poiCount = 1;

        pois.forEach(function (poi) {

            if (total === 1) {

                poisRule += poi;
            }
            else if (poiCount === total) {

                poisRule += poi;
            } else {
                poisRule += poi + ' OR ';
            }

            poiCount++;
        });

        if (total === 1) {

            MG.$hiddenRule += ' ' + poisRule + ' ';
        } else {
            MG.$hiddenRule += ' (' + poisRule + ') ';
        }

    }

    if (accounts.length) {

        var total = accounts.length;
        var accountCount = 1;

        accounts.forEach(function (account) {

            if (total === 1) {

                accountsRule += account;
            }
            else if (accountCount === total) {

                accountsRule += account;
            } else {
                accountsRule += account + ' OR ';
            }

            accountCount++;
        });

        if (total === 1) {

            MG.$hiddenRule += ' ' + accountsRule + ' ';
        } else {
            MG.$hiddenRule += ' (' + accountsRule + ') ';
        }

    }

    if (terms.length) {

        var total = terms.length;
        var termCount = 1;

        terms.forEach(function (term) {

            if (total === 1) {

                termsRule += term;
            }
            else if (termCount === total) {

                termsRule += term;
            } else {
                termsRule += term + ' OR ';
            }

            termCount++;
        });

        if (total === 1) {

            MG.$hiddenRule += ' ' + termsRule + ' ';
        } else {
            MG.$hiddenRule += ' (' + termsRule + ') ';
        }
    }

    if (extras.length) {

        var total = extras.length;
        var extraCount = 1;

        extras.forEach(function (extra) {

            if (total === 1) {

                extrasRule += extra;
            }
            else if (termCount === total) {

                extrasRule += extra;
            } else {
                extrasRule += extra + ' OR ';
            }

            extraCount++;
        });

        if (total === 1) {

            MG.$hiddenRule += ' ' + extrasRule + ' ';
        } else {
            MG.$hiddenRule += ' (' + extrasRule + ') ';
        }

    }

    // now check tags again to append everything to rule
    $("#rulesBox .tm-tag").each(function () {


        tagCount++;

        var typeD = $(this).data('data-type');

        if ((typeD != 'term') && (typeD != 'account') && (typeD != 'poi') && (typeD != 'extra')) {
            var testdata = $(this).data('data-rule');
            MG.$hiddenRule += testdata;


        }

    });

    //if ($('#reTweetsCB').is(':checked')) {
    //    MG.includRetweets = true;
    //} else {
    //    MG.includRetweets = false;
    //}

    // append -is:retweet if ALLTWEETS is not present
    //if (MG.includRetweets == true) {
    //    MG.$hiddenRule = MG.$hiddenRule.replace(" -is:retweet ", "");
    //} else {
    //    MG.$hiddenRule += " -is:retweet ";
    //}

    // check for hashtags and accoutn exclusions

    if ($('#hashTagCB').is(':checked')) {
        MG.excludeHashtags = true;
    } else {
        MG.excludeHashtags = false;
    }

    if ($('#accountCB').is(':checked')) {
        MG.excludeUsernames = true;
    } else {
        MG.excludeUsernames = false;
    }
    // append lang:en (english) as default if no other language specified
    //if (MG.$hiddenRule.indexOf('lang:') <= 0) {
    //    MG.$hiddenRule = MG.$hiddenRule + ' lang:en ';
    //}

    // populate rule label in frontend
    var $reuleText = $('<span></span>');
    $reuleText.text('Rule: ' + MG.$hiddenRule);
    $('#ruleLabel').html($reuleText);

    if (tagCount == 0) {
        $('#rulesBox').hide();
    } else {
        $('#rulesBox').show();
    }

};




/*
Summary
 Clears advanced options.
Params
 [None]
Returns
 n/a
*/
$('#clearAdvanced').click(function () {

    clearAdvanced();

});




/*
Summary
 Clears advanced options.
Params
 [None]
Returns
 n/a
*/
function clearAdvanced() {


    //if (MG.existingTags == false) {
    $('#clearAdvanced').hide();

    $(".tm-tag").each(function () {

        $(this).remove();

    });




    // clear bounding box
    if (newRect) {
        newRect.setMap(null);
        newRect = null;
    }

    //$('#btnSum').prop("disabled", true);
    $('#btnSubmitAdv').prop("disabled", true);

    var slideW = $('#slides').width() + 3.5;
    $('#slides').animate({ scrollLeft: -slideW }, 200);


    $('#ruleLabel').empty();

    // reset slide stage
    MG.slideOn = 1;
    stageOn(MG.slideOn);
    ruleBuilder();
    //}
    // reset date variables
    var untilDate = new Date();

    var fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    fromDate.setDate(untilDate.getDate() - 29);

    $('#fromDateBox').val(SetInitialDateTime(fromDate));
    $('#untilDateBox').val(SetInitialDateTime(untilDate));



};




/*
Summary
Search box filter.
*/
$('#main').on('input keyup', '#searcher', function () {


    var searchText = $('#searcher').val();

    $("#tweetGridView tbody tr").each(function () {


        var entryText = $(this)[0].innerText.trim();

        if (entryText.toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
            $(this).show();
        } else {
            $(this).hide();
        }


    });

});




/*
Summary
ajax call to add data to queue.
*/
$('#main').on('click', '#addToQ', function () {

    $('#SnapLoadingOverlay').fadeIn(200);


    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: "default.aspx/addToQ",
        data: "",
        dataType: "json",
        success: function (data) {

            setTimeout(function () {

                var alertBodyTexts = ["Data added to database."];
                DisplayAlertBox('alert_edit_single', 'success', alertBodyTexts, this);

                $('#SnapLoadingOverlay').fadeOut(200);
            }, 2000);


        },
        error: function (err) {

            $('#SnapLoadingOverlay').fadeOut(200);
            var alertBodyTexts = ["Error adding to database - contact administrator."];
            DisplayAlertBox('alert_edit_single', 'Error', alertBodyTexts, this);

        }
    });

});


/*
Summary
 Moves slide forward.
Params
 [None]
Returns
 n/a
*/
$('#btnForwardAdv').click(function () {

    if (MG.slideOn != 5) {
        $('#btnForwardAdv').prop("disabled", false);
        var slideW = $('#slides').width() + 3;
        $('#slides').animate({ scrollLeft: '+=' + slideW }, 200);

        MG.slideOn++;

        stageOn(MG.slideOn);

        if (MG.slideOn == 5) {
            $('#btnForwardAdv').prop("disabled", true);
        } else {
            $('#btnForwardAdv').prop("disabled", false);
        }

    }

});




/*
Summary
 Moves slide back.
Params
 [None]
Returns
 n/a
*/
$('#btnBackAdv').click(function () {

    var slideW = $('#slides').width() + 3;
    $('#slides').animate({ scrollLeft: '-=' + slideW }, 200);

    MG.slideOn--;

    stageOn(MG.slideOn);

});




/*
Summary
 Closes modal.
Params
 [None]
Returns
 n/a
*/
$('#btnCancelAdv').click(function () {

    //if (newRect) {
    //    newRect.setMap(null);
    //    newRect = null;
    //}
    var ruleCount = 0;
    $("#rulesBox .tm-tag").each(function () {

        ruleCount++;

    });

    if (ruleCount == 0) {
        MG.slideOn = 1;
        stageOn(MG.slideOn);
    }

    gMapClose(this);
    //clearAdvanced();
});




/*
Summary
 Submits all advanced entries.
Params
 [None]
Returns
 n/a
*/
$('#btnSubmitAdv').click(function () {

    MG.slideOn = 1;
    stageOn(MG.slideOn);

    gMapClose(this);

    $('#searchButton').click();
});


function conversation() {
    var a = ["tom","paul","sam"];


    // ajax call to go and retireve data from gnip
    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: "default.aspx/conversation",        
        dataType: "json",
        data: { a: a },
        success: function (data) {

            DisplayAlertBox('alert_edit_single', 'Error', 'Success', this);
        },
        error: function (err) {

            DisplayAlertBox('alert_edit_single', 'Error', "Error", this);
            
        }
    });
}