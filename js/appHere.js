window.addEventListener("DOMContentLoaded", function(event) {       
    var locationButton = document.getElementById('getLocationButton');
    locationButton.onclick = function() {
        getLocation();        
    }
});

////////////////////////////////////////////////////
//                                                //
// Geolocation Service                            //
// Detects the uses coordinates and does reverse  //
// geocoding to determine the address,            //
// which is then used to find nearby              //
// places.                                        //
//                                                //
////////////////////////////////////////////////////

var platform = new H.service.Platform ({
    'app_id': 'ttJiN4T2nxnukGIurDYL',
    'app_code': 'oa0YzVlZL0_ru4C8OVybpw', 
    'useHTTPS': true
});
var explore = new H.places.Explore(platform.getPlacesService()),nextPage, error;

var currentLocationLatLng;
var currentLat;
var currentLng;
var currentAddress;

var mymap;


var addr = document.getElementById("yourAddress");
var title = document.getElementById('title');
var hiddenRow = document.getElementById("placesAndMapSection");
var placesList = document.getElementById('placesList');
var mapContainer = document.getElementById('mapContainer');


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        x.innerHTML = "Geo not supported";
    }
    
}

function reverseGeocode1(lat,lng) {
    var reverseGeocodeParam = {
        prox : lat + "," + lng,
        mode: 'retrieveAddresses',
        maxresults: 10
    };

    var geocoder = platform.getGeocodingService();

    geocoder.reverseGeocode(
        reverseGeocodeParam,
        onSuccess,
        function(e) {alert(e);}
    );

}

function onSuccess(result) {
    console.log(result.Response.View[0].Result);
    if(result.Response.View[0].Result.length > 1) {
        currentLocationLatLng = result.Response.View[0].Result[1];
    } else {
        currentLocationLatLng = result.Response.View[0].Result[0];
    }
    currentLat = currentLocationLatLng.Location.DisplayPosition.Latitude;
    currentLng = currentLocationLatLng.Location.DisplayPosition.Longitude;
    currentAddress = currentLocationLatLng.Location.Address.Label;
    document.getElementById("yourAddress").innerHTML = currentAddress
    getPlaces();
    showMap();
    document.getElementById("stylesheet").setAttribute('href', 'stylesRearranged.css');
}


function getPlaces() {
    var placesParams = {
        'cat': 'eat-drink',
        'in': currentLat + "," + currentLng + ";r=500"
    }
    explore.request(placesParams,{},onResult, onError);
    
}

function onResult(data) {
   for(i = 0; i < data.results.items.length; i++) {
    data.results.items[i].follow(onFetchPlaceDetails, onError);
   }
   try {
    data.results.fetchNext(onPageUpdate, (onError));
   } catch (e) {
    //////////////////////////
   }
    
}

function onFetchPlaceDetails(data) {
    //Renaming data variable for easier understanding of the code
    var placeDetails = data;
    //console.log(placeDetails);
      
    //Creating the row which will contain the information about a place
    var rowItem = document.createElement('div');
    rowItem.classList.add("row");
    rowItem.classList.add("listElementDiv");
    //////////////////////////////////////////////////////////////////

    //Dividing the row in three columns for each part of the info
    var spanImage = document.createElement("div");
    var spanInfo = document.createElement("div");
    var spanButtons = document.createElement("div");

    spanImage.classList.add("col-2");
    spanImage.classList.add("listElementColumn");
    spanImage.classList.add("hiddenOnMobile");

    spanInfo.classList.add("col-8");
    spanInfo.classList.add("listElementColumn");
    spanInfo.classList.add("listElementColumnInfoMobile");

    spanButtons.classList.add("col-2");
    spanButtons.classList.add("listElementColumn");
    spanButtons.classList.add("listElementColumnButtonsMobile");
    //////////////////////////////////////////////////////////////

    //Creating the icon of the place
    var url = placeDetails.icon;
    var image = document.createElement("img");
    image.classList.add("listElementImage");
    image.src = url;
    spanImage.appendChild(image);
    /////////////////////////////////////////
    
    
    /*
    *
    * Creating the elements for the text section
    *
    */
    //Adding place name//////////////////////////////////////////
    var pPlaceName = document.createElement('p');
    pPlaceName.classList.add("listElementP");
    pPlaceName.classList.add("boldOnMobile");

    var spanPlaceNameUtils = document.createElement('span');
    var placeNameUtils = document.createTextNode("Place name: ");
    spanPlaceNameUtils.appendChild(placeNameUtils);
    spanPlaceNameUtils.classList.add("listElementUtils");

    var spanPlaceNameVar = document.createElement('span');
    var placeName = document.createTextNode(placeDetails.name);
    spanPlaceNameVar.appendChild(placeName);
    spanPlaceNameVar.classList.add("listElementHeader");

    pPlaceName.appendChild(spanPlaceNameUtils);
    pPlaceName.appendChild(spanPlaceNameVar);
    //////////////////////////////////////////////////////////

    //Adding place addres///////////////////////////////////////
    var pAddress = document.createElement('p');
    pAddress.classList.add("listElementP");
    pAddress.classList.add("boldOnMobile");

    var spanPlaceAddressUtils = document.createElement('span');
    var placeAddressUtils = document.createTextNode("Addres: ");
    spanPlaceAddressUtils.appendChild(placeAddressUtils);
    spanPlaceAddressUtils.classList.add("listElementUtils");

    var spanPlaceAddresVar = document.createElement('span');
    var placeAddress = document.createTextNode(placeDetails.location.address.text.replace(/<br\/>/g, " "));
    spanPlaceAddresVar.appendChild(placeAddress);
    spanPlaceAddresVar.classList.add("listElementAddress");

    pAddress.appendChild(spanPlaceAddressUtils);
    pAddress.appendChild(spanPlaceAddresVar);
    ////////////////////////////////////////////////////////

    //Adding type and opening hours, which both are on the same row////////////
    var pTypeOpeningHours = document.createElement('p');
    pTypeOpeningHours.classList.add("listElementP");
    pTypeOpeningHours.classList.add("boldOnMobile");

    //Creating type span
    var spanType = document.createElement('span');

    var spanPlaceTypeUtils = document.createElement('span');
    var placeTypeUtils = document.createTextNode("Type: ");
    spanPlaceTypeUtils.appendChild(placeTypeUtils);
    spanPlaceTypeUtils.classList.add('listElementUtils');

    var spanPlaceTypeVar =  document.createElement('span');
    var placeType = document.createTextNode(placeDetails.categories[0].title + "  ");
    spanPlaceTypeVar.appendChild(placeType);
    spanPlaceTypeVar.classList.add("listElementOthers");

    spanType.appendChild(spanPlaceTypeUtils);
    spanType.appendChild(spanPlaceTypeVar);
    //

    //Creating opening hours span
    var spanOpeningHours = document.createElement('span');

    var spanPlaceOpeningHoursUtils = document.createElement('span');
    var placeOpeningHoursUtils = document.createTextNode("Opening hours: ");
    spanPlaceOpeningHoursUtils.appendChild(placeOpeningHoursUtils);
    spanPlaceOpeningHoursUtils.classList.add('listElementUtils');

    var spanPlaceOpeningHoursVar = document.createElement('span');
    var placeOpeningHours;
    if(placeDetails.extended != null) {
        placeOpeningHours = document.createTextNode(placeDetails.extended.openingHours.text.replace(/<br\/>/g, " ") + " ");
    } else {
        placeOpeningHours = document.createTextNode("No info provided ");
    }
    spanPlaceOpeningHoursVar.appendChild(placeOpeningHours);
    spanPlaceOpeningHoursVar.classList.add("listElementOthers");


    spanOpeningHours.appendChild(spanPlaceOpeningHoursUtils);
    spanOpeningHours.appendChild(spanPlaceOpeningHoursVar);
    
    pTypeOpeningHours.appendChild(spanType);
    pTypeOpeningHours.appendChild(spanOpeningHours);

    spanInfo.appendChild(pPlaceName);
    spanInfo.appendChild(pAddress);
    spanInfo.appendChild(pTypeOpeningHours);
    ////////////////////////////////////////////////////////////////////////

    //Creating Buttons//////////////////////////////////////////////
    //Creating a button which shows place on map
    var showOnMapButton = document.createElement("button");
    var showOnMapText = document.createTextNode("Show on map");
    showOnMapButton.appendChild(showOnMapText);
    showOnMapButton.classList.add("listElementButton");
    showOnMapButton.classList.add("boldOnMobile");
    showOnMapButton.onclick = function() {onShowOnMapClick(placeDetails.location.position[0],placeDetails.location.position[1], placeDetails.name)};
    spanButtons.appendChild(showOnMapButton);

    //Creating a button with link to website if provided
    var visitWebsiteButton = document.createElement("button");
    visitWebsiteButton.classList.add("listElementButton");
    visitWebsiteButton.classList.add("boldOnMobile");
    var visitWebsiteText;
    if(placeDetails.contacts.website != null) {
        var websiteUrl = placeDetails.contacts.website[0].value;
        visitWebsiteText = document.createTextNode("Visit website");
        visitWebsiteButton.onclick = function() { window.open(websiteUrl)}
        visitWebsiteButton.appendChild(visitWebsiteText);
    } else {
        visitWebsiteText = document.createTextNode("No website provided");
        visitWebsiteButton.appendChild(visitWebsiteText);
        //visitWebsiteButton.classList.remove("listElementButton");
        //visitWebsiteButton.classList.add("listElementDisabledButton");
        
    }
    spanButtons.appendChild(visitWebsiteButton);

    //Creating a button which saves place info to clients computer
    var savePlaceInfo = document.createElement("button");
    var savePlaceInfoText = document.createTextNode("Download information");
    savePlaceInfo.appendChild(savePlaceInfoText);
    savePlaceInfo.classList.add("listElementButton");
    savePlaceInfo.classList.add("boldOnMobile");
    savePlaceInfo.onclick = function() {generateAndDownloadInfo(placeDetails)};
    spanButtons.appendChild(savePlaceInfo);


    /////////////////////////////////////////////////////////////
    
    //Add all components to main container///////////////////////
    rowItem.appendChild(spanImage);
    rowItem.appendChild(spanInfo);
    rowItem.appendChild(spanButtons);
    /////////////////////////////////////////////////////////////

    //Add container to webpage
    placesList.appendChild(rowItem);

}

function onPageUpdate(data) {
    nextPage = data;
    console.log("got next page");
}

function onError(data) {
    error = data;
    console.log("Error at Places Api");
    console.log(error);
}

function onShowOnMapClick(lat,lng, placeName) {
    mymap.setView([lat,lng], 14);
    var popup = L.popup()
    .setLatLng([lat, lng])
    .setContent(placeName)
    .openOn(mymap);
}

function showMap() {
    mymap = L.map(mapContainer).setView([currentLat,currentLng],15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 25,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZXZnZW5pY2g5NyIsImEiOiJjanBvMDh0NXIwMHBmM3h0ZWYydWM5NTM0In0.7x4VZGyvkQN0ehNflRkHWQ'
    }).addTo(mymap);

    var marker = L.marker([currentLat,currentLng]).addTo(mymap);
    marker.bindPopup('You are here').openPopup();
    
}


function showPosition(position) {
    reverseGeocode1(position.coords.latitude, position.coords.longitude);
}

function generateAndDownloadInfo(placeDetails) {
    var openingHours;
    if(placeDetails.extended != null) {
        openingHours = placeDetails.extended.openingHours.text.replace(/<br\/>/g, " ") + " ";
    } else {
        openingHours = "No info provided ";
    }
    var placeDetailsAsString = "Place name: " + placeDetails.name + "\n"
                                + "Place address: " + placeDetails.location.address.text.replace(/<br\/>/g, " ") + "\n"
                                + "Type: " + placeDetails.categories[0].title + "\n"
                                + "Opening hours: " + openingHours;

    var downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(placeDetailsAsString));
    downloadLink.setAttribute("download", placeDetails.name + ".txt");

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


