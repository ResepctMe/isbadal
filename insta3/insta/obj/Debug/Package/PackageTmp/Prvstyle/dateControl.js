/*
 
    SixDos - dateControl.js
 
    Script for date handling.
 
*/

/// <reference path = "mainControls.js" />




/*
Summary
 Ensures dates in timepicker control are handled in client-specific format.
Params
 [None]
Returns
 [None]
*/
function DoTimePickerSetup(daySpan) {
    if (IsInUSTimezone()) { // US date format. (Mid-endian)

        clearScreen();

        $('#fromDateBox').datepicker("destroy");
        $('#untilDateBox').datepicker("destroy");

        $('#fromDateBox').datetimepicker({ dateFormat: 'mm/dd/yy', minDate: daySpan, maxDate: 0 });
        $('#untilDateBox').datetimepicker({ dateFormat: 'mm/dd/yy', minDate: daySpan, maxDate: 0 });
    }
    else { // UK date format. (Little-endian)

        clearScreen();

        $('#fromDateBox').datepicker("destroy");
        $('#untilDateBox').datepicker("destroy");

        $('#fromDateBox').datetimepicker({ dateFormat: 'dd/mm/yy', minDate: daySpan, maxDate: 0 });
        $('#untilDateBox').datetimepicker({ dateFormat: 'dd/mm/yy', minDate: daySpan, maxDate: 0 });

    }
};



/*
Summary
 Sets the default initial values of the start and end date/time fieds.
Params
 [Date] dateTimeIn - new (current) Date object from which to derive initial date/time string.
Returns
 [string] dateTimeStringOut - Date/time string derived from date object input.
*/
function SetInitialDateTime(dateTimeIn) {
    // Determine which format the date is displayed as and reconstruct as required.
    var format = (IsInUSTimezone()) ? "us" : "uk";

    var dateTimeStringOut = "";

    if (dateTimeIn instanceof Date) {
        dateTimeStringOut = BuildDateString(dateTimeIn, format);
    }
    return dateTimeStringOut;
}



/*
Summary
 Handles all date/time string processing, including TZ adjustments and formatting.
Params
 [string] dateTimeIn - Date time string, in either dd/mm/yyyy hh:mm or mm/dd/yyyy hh:mm:ss.
 [string] convertTo - String to determine TZ conversion. Either "utc" or "local".
 [bool] toServer - Boolean flag indicating whether this value is being submitted to the server.
Returns
 [String] dateTimeOut - Adjusted and formatted date time string.
*/
function ProcessDateTime(dateTimeIn, convertTo, toServer) {
    // Date time string passed in is 1) from database, always dd/mm/yyyy, utc; 2) from cognos, always dd/mm/yyyy, utc; 3) from UI, either format, most likely not utc.

    // Determine which format the date is displayed as and reconstruct as required.
    var format = (IsInUSTimezone()) ? "us" : "uk";

    // If client is not in a US time zone, incoming date time string will be dd/mm/yyyy, so convert to mm/dd/yyyy.
    if (!IsInUSTimezone() || toServer === false)
        dateTimeIn = ConvertToJSDateString(dateTimeIn);

    // Cast in to new a JavaScript Date object, now that we have mm/dd/yyyy.
    var dtObject = new Date(dateTimeIn);

    // Adjust time value according to client's time zone offset from UTC.
    var dtAdjusted = AdjustBetweenUTCAndLocal(dtObject, convertTo);

    // toServer is true then we are sending this value to the server and it must be dd/mm/yyyy.
    if (toServer === true)
        format = "uk";

    var dateTimeOut = "";
    dateTimeOut = BuildDateString(dtAdjusted, format);

    return dateTimeOut;
};



/*
Summary
 Tests whether client is in a US timezone, based on string(s) within a Date().toString() call.
Params
 [none]
Returns
 [Boolean] true/false indicating whether client is in US time zone.
*/
function IsInUSTimezone() {
    // Create an array of strings that will act as patterns used to determine whether client is in a US time zone.
    var arrRxUs = ["EDT", "EST", "Eastern"];
    // Create a new regular expression consisting of all arrRxUs elements.
    var rxUSZones = new RegExp(arrRxUs.join("|"), "i");
    // Check the current date/time string for matches to any of the US time zone 'triggers' in arrRxUs.
    if (new Date().toString().match(rxUSZones) != null) {
        // If we get a match, return true.
        return true;
    }
    // Otherwise, return false.
    return false;
};



/*
Summary
 Converts a date time string of UK format to US format so that it can be manipulated by JavaScript.
Params
 [String] dateTime - Date time string of dd/mm/yyyy hh:mm:ss format.
Returns
 [String] Equivalent date time string as mm/dd/yyyy hh:mm:ss format.
*/
function ConvertToJSDateString(dateTime) {
    var datePart,
        timePart;

    if (dateTime != null) {
        datePart = dateTime.substring(0, 10);
        timePart = dateTime.substring(11, (dateTime.length));
        datePart = datePart.split('/');
        return datePart[1] + '/' + datePart[0] + '/' + datePart[2] + ' ' + timePart;
    }
};



/*
Summary
 Construct a date time string from a date object.
Params
 [Date] d - Date component to use for construction.
 [String] dateFormat - Determines dd/mm/yyyy or mm/dd/yyyy date format.
Returns
 [String] dateTimeString - Resultant constructed date time string.
*/
function BuildDateString(d, dateFormat) {
    //if (Object.prototype.toString.call(d) === "[object Date]") { }
    if (d instanceof Date) {
        // Create array of month 'indexes' since js .getMonth returns 0 - 11 for Jan - Dec.
        var m_index = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
        // Deconstruct date object passed in to individual components.
        var date = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        var hour = d.getHours();
        var mins = d.getMinutes();
        var secs = d.getSeconds();

        // New variable for date time string to be returned.
        var dateTimeString;

        // Rebuild date string, prefixing appropairate values with 0's where required, and arrange accotrding to UK or US format.
        if (dateFormat === "uk") {
            dateTimeString = ZeroPrefix(date) + "/" + m_index[month] + "/" + year + " " + ZeroPrefix(hour) + ":" + ZeroPrefix(mins);
        }
        else {
            dateTimeString = m_index[month] + "/" + ZeroPrefix(date) + "/" + year + " " + ZeroPrefix(hour) + ":" + ZeroPrefix(mins);
        }
        return dateTimeString;
    }
};



/*
Summary
 Prefixes single-digit values <= 9 with a '0'.
Params
 [Integer] tp - Date component to convert.
Returns
 [String] 0-prefixed string of input value, or input value if no prefix required.
*/
function ZeroPrefix(tp) {
    if (tp <= 9) {
        return "0" + tp.toString();
    }
    // Otherwise, it's already a 2-digit value (e.g. 10), so just return it.
    return tp.toString();
};



/*
Summary
 Adjust hour element of a Date object to either UTC or local time equivalent.
Params
 [Date] d - Date object to convert.
 [String] convertTo - Determines whether to convert UTC > local, or vice versa.
Returns
 [Date] d - Date object with hours component adjusted as required.
*/
function AdjustBetweenUTCAndLocal(d, convertTo) {
    if (d instanceof Date) {

        var offsetDate = new Date();

        // Get the minutes part of the date object passed in.
        var mins = d.getMinutes();

        // Check whether the passed date object has a UTC offset (DST, etc.).
        var tzOffsetMins = parseInt(d.getTimezoneOffset());

        // Convert to UTC from local time.
        if (convertTo === "utc") {
            mins = (mins + tzOffsetMins);
        }
            // Convert to local time from UTC.
        else if (convertTo === "local") {
            mins = (mins - tzOffsetMins);
        }
        d.setMinutes(mins);
    }
    return d;
};




var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}