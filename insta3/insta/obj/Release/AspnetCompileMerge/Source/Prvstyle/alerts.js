/*
 
    SixDos - 

 
    Script for alert boxes.
 
*/

/// <reference path = "mainControls.js" />




/*
Summary
Display alert box notification providing user feedback.
Params
[Object] sender - The HTML element that triggered the function.
Returns
[None]
*/
function DisplayAlertBox(alertBoxId, alertBoxType, alertBodyTexts, sender) {


    var $alertBoxWrapper = $('#' + alertBoxId),
        $alertBox = $alertBoxWrapper.find('.alert-box'),
        newclass = 'alert-box ' + alertBoxType.toLowerCase(),
        alertHeaderHtml = '',
        alertBodyHtml = '',
        x,
        y;

    // set the alert-box class to determine colour
    $alertBox.prop('class', newclass);
    $alertBoxWrapper.prop('tabindex', '0');
    // define alert box header html
    //alertHeaderHtml = '<span class="alert-header">' + alertBoxType + '</span><span class="alert-close" onclick="AlertHide(this);">&#10006;</span>';
    var $alertHeaderHtml = $('<span></span>');
    var $alertHeaderCloseHtml = $('<span></span>');
    var $alertBodyTextsSpan = $('<span></span>');

    $alertHeaderHtml.prop({ 'class': 'alert-header' }).text(alertBoxType);
    $alertHeaderCloseHtml.prop({ 'class': 'alert-close' }).html('&#10006;').click(function () { AlertHide(this); });
    $alertBodyTextsSpan.prop({ 'class': 'alert-body' }).text(alertBodyTexts[0]);

    // define alert box body html
    //for (var i = 0; i < alertBodyTexts.length; i++) {
    //    alertBodyHtml += '<span class="alert-body">' + alertBodyTexts[i] + '</span>';
    //}

    // append html to alert box, set position, and display
    $alertBox.html(alertHeaderHtml).append($alertHeaderCloseHtml).append($alertBodyTextsSpan);
    x = Math.floor(window.innerWidth / 2);
    y = Math.floor(window.innerHeight / 2);
    $alertBoxWrapper.css({ 'top': y + 'px', 'left': x + 200 + 'px' }).fadeIn(150);

    $('#SnapLoadingOverlay').fadeOut(200);
};

/*
Summary
 Close (hide) alert-box notification.
Params
 [object] sender - The html control that called this function.
Returns
 [None]
*/
function AlertHide(sender) {
    $(sender).parents('.tooltip-wrapper').fadeOut(150);
};