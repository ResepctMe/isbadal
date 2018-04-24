/// <reference path = "jQuery/jquery-1.9.1.min.js" />
/// <reference path = "jQuery/jquery-ui.js" />



// global map variables
var map;
var markers = [];
var drawingManager;
var tbSwLat = document.getElementById("sw-lat");
var tbSwLon = document.getElementById("sw-lon");
var tbNeLat = document.getElementById("ne-lat");
var tbNeLon = document.getElementById("ne-lon");
var newRect;
var newMarker;
var selectedShape;
var boundsChangedListener;
var areaMarkers = [];

// Hide the map modal and reload the page to refresh POI table
// -----------------------------------------------------------
function gMapClose(sender) {

    //if (newRect) {
    //    newRect.setMap(null);
    //}


    $('#gMapModal, #pac-input').fadeOut(150, function () {
        // Re-load page to refresh POI list.
        $('#panelOverlay').fadeOut(200);
        //window.location.reload();
    });
};



// Google maps script initialization
// ---------------------------------
function loadMapScript() {
    // Check if script is already present.
    var scriptCheck = document.getElementById("jsGoogleMaps");
    if (!scriptCheck) {
        var script = document.createElement("script");
        script.id = "jsGoogleMaps";
        script.type = "text/javascript";
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB1nExqnDL6cxJQCVb5bWP-4z1qic2Dpa8&callback=initMap&libraries=places,drawing";
        document.body.appendChild(script);

    }
    else {
        initMap();
    }
};



// Configure google map and associated objects
// -------------------------------------------
function initMap() {
    // Create & set some initialisation variables.
    // Fits whole UK map in to map pane.
    var initCenterLat = 59.368;
    var initCenterLon = -16.443;
    var initZoom = 5;


    // Create a new map LatLng object, which will be assigned to the map to set the center point.
    var initCenter = new google.maps.LatLng(initCenterLat, initCenterLon);

    // Create an options array for the new map object.
    var myOptions = {
        zoom: initZoom,
        center: initCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        mapTypeControlOptions: {

            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    };

    // Ensure the map doesn't already exist and create it, assigning it to the #mapPane div as a container.
    if (map == null || undefined)
        map = new google.maps.Map(document.getElementById('gMap'), myOptions);


    // Add an event listener to the map for bounds_changed, which fires when zooming or panning
    boundsChangedListener = google.maps.event.addListener(map, 'bounds_changed', function () {
        if (!newRect)
            DoAutoBounds(map);
    });


    // If the above fix fails, wire the same event to a button that can be clicked to 'force' the map to load.
    var btnRefreshMap = document.getElementById("btnRefreshMap");
    google.maps.event.addDomListener(btnRefreshMap, 'click', function () {
        google.maps.event.trigger(map, 'resize');
    });

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));

    // Add event listener to pan & zoom to the place selected from the SearchBox.
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        // Reference the places in the search box.
        var places = searchBox.getPlaces();
        // If there are none, do nothing and exit this function.
        if (places.length === 0)
            return;

        // Clear out the old markers.
        areaMarkers.forEach(function (marker) {
            marker.setMap(null);
        });
        areaMarkers = [];

        // Create a new LatLngBounds object to store the co-ordinates of the location to 'jump' to.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            var icon = {
                url: 'Images/redMarker.png',
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(50, 50),

            };

            // Create a marker for each place.
            areaMarkers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
        });
        for (var i = 0, place; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }
        // Move the map to the selected location and set the zoom level.
        map.fitBounds(bounds);
        map.setZoom(14);
    });




    // Properties to apply to all drawing rectangles.
    var drawingPolyOptions = {
        strokeWeight: 1,
        strokeColor: '#ae4040',
        fillColor: '#bf5050',
        strokeOpacity: 0.5,
        fillOpacity: 0.3,
        editable: true, // allows shape to be selected.
        draggable: true
    };

    // Assign drawing manager instance.
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false, // Don't display the drawing controls.
        //drawingControlOptions: drawingControlOptns,
        markerOptions: {
            draggable: true
        },
        rectangleOptions: drawingPolyOptions,
        map: map
    });

    // Add an event listener to detect when shapes are drawn on map and manage associated functionality.
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        // Get reference to newly drawn shape and it's type.
        newShape = event.overlay;
        newShape.type = event.type;
        // Set up event listeners for rectangles
        ManageDrawnShape(newShape, event.type);
    });

    // Add an event listener to the manual bounds checkbox that clears the checkboxes and sets other listeners accordigly.
    var cbManualBounds = document.getElementById("cbManualBounds");
    var manualBoundsChecked = cbManualBounds.checked;
    google.maps.event.addDomListener(cbManualBounds, 'change', function () {
        if (!$(cbManualBounds).is(":checked")) {

            $('#ruleLabel').empty();

            $(this).parent().prop('class', 'cb-wrapper');

            //clearScreen();

        } else {
            $(this).parent().prop('class', 'cb-wrapper-down');
        }
        DoManualBounds();
    });

    // Add an event listener to the pin point checkbox that
    //var cbPinPoint = document.getElementById("cbPinPoint");
    //var pinpointChecked = cbPinPoint.checked;
    //google.maps.event.addDomListener(cbPinPoint, 'change', function () {
    //    DoPinPoint();
    //});

    // Clear the current selection when the drawing mode is changed, or when the map is clicked.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
    google.maps.event.addListener(map, 'click', clearSelection);


};



// Allow non-marker map overlay shapes to be selected
// --------------------------------------------------
function setSelection(shape) {
    clearSelection();
    selectedShape = shape;
    if (shape.type != google.maps.drawing.OverlayType.MARKER) {
        selectedShape.setEditable(true);
    }
};



// Allow a selected map overley shape to be un-selected
// ----------------------------------------------------
function clearSelection() {
    if (selectedShape) {
        if (selectedShape.type != google.maps.drawing.OverlayType.MARKER) {
            selectedShape.setEditable(false);
        }
        selectedShape = null;
    }
};



// Set up event listeners for shapes drawn on map
// ----------------------------------------------
function ManageDrawnShape(shape, type) {
    // Rectangle
    if (type === "rectangle") {
        newRect = shape;
        // Set the coord textbox values to the coords of the new shape.
        DoAutoBounds(newRect);
        // Add an event listener that updates the textbox coord values if the bounds of the rect are changed.
        var rectBoundsChangdListener = google.maps.event.addListener(newRect, 'bounds_changed', function () {
            DoAutoBounds(newRect);
        });
        // Add event listener that selects the newly drawn shape when the user clicks it.
        google.maps.event.addListener(newRect, 'click', function () {
            setSelection(newRect);
        });
        // Remove the bounds_changed event listener that automatically populates the coord tetxboxes with the bounds of the map window.
        if (boundsChangedListener)
            google.maps.event.removeListener(boundsChangedListener);

        //SaveGeo();
    }

    shape.type = type;
    setSelection(shape);
    // Switch back to non-drawing mode after drawing
    drawingManager.setDrawingMode(null);
};






// Put lat/long values from a bounding box object in textboxes
// -----------------------------------------------------------
function DoAutoBounds(object) {
    // Get the lat/long bounds of the map's viewport
    var bounds = object.getBounds();
    // Get the northeast and southwest lat/long objects.
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    tbSwLat.value = sw.lat();
    tbSwLon.value = sw.lng();
    tbNeLat.value = ne.lat();
    tbNeLon.value = ne.lng();

    var horizontalDistance = calculateDistances(sw.lat(), sw.lat(), sw.lng(), ne.lng()) / 1000 * 0.621371192;
    var verticalDistance = calculateDistances(sw.lat(), ne.lat(), sw.lng(), sw.lng()) / 1000 * 0.621371192;

    var $horizontalDistanceText = $('<span></span>');
    var $verticalDistanceText = $('<span></span>');

    // check all the distances are correct otherwise show appropriate label prompt
    if (horizontalDistance >= 25 && verticalDistance >= 25) {

        $horizontalDistanceText.text('Horizontal distance cannot be over 25 miles.');

        $('#horizAlertLabel').html($horizontalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
        $('#horizontalDis').css({ 'color': '#9d3030' });

        $verticalDistanceText.text('Vertical distance cannot be over 25 miles.');

        $('#vertAlertLabel').html($verticalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
        $('#verticalDis').css({ 'color': '#9d3030' });
        //$('#btnGeoSave').hide();
        $('#btnGeoSave').prop("disabled", true);
    } else if (horizontalDistance >= 25) {
        //$('#btnGeoSave').hide();
        $('#btnGeoSave').prop("disabled", true);
        $horizontalDistanceText.text('Horizontal distance cannot be over 25 miles.');

        $('#horizAlertLabel').html($horizontalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
        $('#horizontalDis').css({ 'color': '#9d3030' });
        if (verticalDistance <= 25) {
            $('#vertAlertLabel').empty();
            $('#verticalDis').css({ 'color': 'black' });
        } else {
            $verticalDistanceText.text('Vertical distance cannot be over 25 miles.');
            $('#vertAlertLabel').html($verticalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
            $('#verticalDis').css({ 'color': '#9d3030' });
            //$('#btnGeoSave').hide();
            $('#btnGeoSave').prop("disabled", true);
        }

    } else if (verticalDistance >= 25) {
        //$('#btnGeoSave').hide();
        $('#btnGeoSave').prop("disabled", true);
        $verticalDistanceText.text('Vertical distance cannot be over 25 miles.');
        $('#vertAlertLabel').html($verticalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
        $('#verticalDis').css({ 'color': '#9d3030' });
        if (horizontalDistance <= 25) {
            $('#horizAlertLabel').empty();
            $('#horizontalDis').css({ 'color': 'black' });
        } else {
            $horizontalDistanceText.text('Horizontal distance cannot be over 25 miles.');
            $('#horizAlertLabel').html($horizontalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
            $('#horizontalDis').css({ 'color': '#9d3030' });
            //$('#btnGeoSave').hide();
            $('#btnGeoSave').prop("disabled", true);
        }

    } else if (horizontalDistance <= 25) {

        $('#horizAlertLabel').empty();
        $('#horizontalDis').css({ 'color': 'black' });

        if (verticalDistance >= 25) {
            //$('#btnGeoSave').hide();
            $('#btnGeoSave').prop("disabled", true);
            $verticalDistanceText.text('Vertical distance cannot be over 25 miles.');
            $('#vertAlertLabel').html($verticalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
            $('#verticalDis').css({ 'color': '#9d3030' });
        } else {
            $('#vertAlertLabel').empty();
            $('#verticalDis').css({ 'color': 'black' });
            if (verticalDistance + horizontalDistance > 0) {
                //$('#btnGeoSave').show();
                $('#btnGeoSave').prop("disabled", false);
                //SaveGeo();
            }
        }

    } else if (verticalDistance <= 25) {

        $('#vertAlertLabel').empty();
        $('#verticalDis').css({ 'color': 'black' });

        if (horizontalDistance >= 25) {
            $horizontalDistanceText.text('Horizontal distance cannot be over 25 miles.');
            $('#horizAlertLabel').html($horizontalDistanceText).css({ 'color': '#9d3030', 'font-size': '16px' });
            $('#horizontalDis').css({ 'color': '#9d3030' });
            //$('#btnGeoSave').hide();
            $('#btnGeoSave').prop("disabled", true);
        } else {
            $('#horizAlertLabel').empty();
            $('#horizontalDis').css({ 'color': 'black' });
            if ($('#dateRangeLabel').html() == '') {
            }
            //SaveGeo();
        }


    } else if (horizontalDistance <= 25 && verticalDistance <= 25) {

        $('#horizAlertLabel').empty();
        $('#horizontalDis').css({ 'color': 'black' });

        $('#vertAlertLabel').empty();
        $('#verticalDis').css({ 'color': 'black' });

        if ($('#dateRangeLabel').html() == '') {
        }
        //$('#btnGeoSave').show();
        $('#btnGeoSave').prop("disabled", false);
    }

    $('#horizontalDis').text(horizontalDistance.toFixed(2));
    $('#verticalDis').text(verticalDistance.toFixed(2));

    if (object.fillColor)
        $('#sw-lat, #sw-lon, #ne-lat, #ne-lon').css({ 'color': '#9d3030' });
    else
        $('#sw-lat, #sw-lon, #ne-lat, #ne-lon').css({ 'color': '#555' });
};

function calculateDistances(lat1, lat2, lon1, lon2) {

    var R = 6371000; // metres
    var φ1 = lat1 * (Math.PI / 180);
    var φ2 = lat2 * (Math.PI / 180);
    var Δφ = (lat2 - lat1) * (Math.PI / 180);
    var Δλ = (lon2 - lon1) * (Math.PI / 180);

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return d;
}


// Enable rectangle drawing mode, or remove existing rectangle, based on checkbox state
// ------------------------------------------------------------------------------------
function DoManualBounds() {
    if ($('#cbManualBounds').is(':checked')) {
        $('#cbManualBounds').parent().prop('class', 'cb-wrapper-down');
        // Set map drawing mode to rectangle.
        if (newRect != undefined) {
            newRect.setMap(null);
        }
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
        // Clear co-ordinate textboxes.
        $('#sw-lat, #sw-lon, #ne-lat, #ne-lon').val('');

    }
    else {
        if (drawingManager != undefined) {
            $('#cbManualBounds').parent().prop('class', 'cb-wrapper');
            // Set drawing mode back to null.
            drawingManager.setDrawingMode(null);
            // Add the event listener to restore behavior of automatically grabbing map bound coords.
            boundsChangedListener = google.maps.event.addListener(map, 'bounds_changed', function () {
                DoAutoBounds(map);
            });
            // Remove rectangle overlay from the map.
            //RemoveRect();


            // Reset the coord textboxes to the coords of the map bounds.
            DoAutoBounds(map);
        }
    }
};




// Display modal with google map to grab co-ordinates
// --------------------------------------------------
function DoGeo(sender) {

    var startlat = $('.advMap').attr('data-lat');
    // Read start long from page parameter.

    var startlong = $('.advMap').attr('data-lon');
    // Read start zoom from page parameter.

    var startzoom = $('.advMap').attr('data-zoom');
    if ((startlat) && (startlong) && (startzoom)) {
        initCenterLat = startlat;
        initCenterLon = startlong;
        initZoom = parseInt(startzoom);

        var newCentre = new google.maps.LatLng(initCenterLat, initCenterLon);
        map.setCenter(newCentre);
        map.setZoom(initZoom);
    }

    var boxlat1 = $('#sw-lat').val();
    var boxlong1 = $('#sw-lon').val();
    var boxlat2 = $('#ne-lat').val();
    var boxlong2 = $('#ne-lon').val();

    // Populate box coord textboxes with values if present for POI.
    if (newRect) {

        // Create rectangle's coordinate bounds.
        var autoRectBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(boxlat1, boxlong1),
            new google.maps.LatLng(boxlat2, boxlong2));
        // Create new rectangle.
        var autoRect = new google.maps.Rectangle({
            strokeWeight: 1,
            strokeColor: '#ae4040',
            fillColor: '#bf5050',
            strokeOpacity: 0.5,
            fillOpacity: 0.3,
            editable: true,
            draggable: true,
            bounds: autoRectBounds,
            map: map
        });
        // Store new auto rectanhle in newRect variable so it can be referenced/removed.
        newRect = autoRect;
        // Set up events for rectangle.
        ManageDrawnShape(newRect, "rectangle");
        // Set bounding box coord textbox values.
        DoAutoBounds(autoRect);
        // Check the checkbox.

        if (!$('#cbManualBounds').is(":checked")) {

            // reset screen
            //clearScreen();

        } else if (newRect != undefined) {
            $('#cbManualBounds').prop('checked', true);
        }
    }
    else {
        $('#cbManualBounds').prop('checked', false);
        DoManualBounds();
    };


    // Fade in the page dimmer and then the map modal.
    $('#panelOverlay').fadeIn(150, function () {
        $('#gMapModal').fadeIn(150, function () {
            // Display the map search text box and automatically insert the name of the selected POI.
            $('#pac-input').fadeIn(150, function () {
                //$('#pac-input').val(poi);
                // Set focus to the textbox so that the search box appears with any matching results.
                //$('#pac-input').focus();
                $('.pac-container').css({ 'position': 'fixed' });

                setTimeout(function () {
                    $('#btnRefreshMap').click();
                }, 500);
            });
        });
    });
};



