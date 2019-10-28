var addr = document.getElementById("address");
var title = document.getElementById('title');
var hiddenRow = document.getElementById("location");
var placesList = document.getElementById('placesList');


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        x.innerHTML = "Geo not supported";
    }
}

function reverseGeocode(lat,lng) {
    var latlng = new google.maps.LatLng(lat,lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            console.log("fail")
            alert(status);
        }
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            var address = (results[0].formatted_address);
            addr.innerHTML = address;
            title.style.marginTop = 0;
            hiddenRow.style.display = "inline";
            getPlaces(latlng);


        }
    });
}

function getPlaces(address) {
    var request = {
        location : address,
        radius : 500,
        type : ['restaurant'],
    };

    service = new google.maps.places.PlacesService(document.getElementById('placesList'));
    service.nearbySearch(request, callback);
    
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          var listElement = document.createElement('li');

          var spanImage = document.createElement("span");
          var spanInfo = document.createElement("span");
          


          var pPlaceName = document.createElement('p');
          var pAddress = document.createElement('p');
          var pPricingRating = document.createElement('p');
          var spanPricing = document.createElement('span');
          var spanRating = document.createElement('span');

          var placeName = document.createTextNode(place.name);
          var placeAddress = document.createTextNode(place.formatted_address);
          var pricing = document.createTextNode("Price level: " + place.price_level);
          var rating = document.createTextNode("Rating: " + place.rating + " ");


          if(place.photos != null) {
              var url = place.photos[0].getUrl();
              var image = document.createElement("img");
              image.src = url;
              image.style.width = "50%";
              image.style.height = "50%";
            spanImage.appendChild(image);
          }

          pPlaceName.appendChild(placeName);
          pAddress.appendChild(placeAddress);
          spanPricing.appendChild(pricing);
          spanRating.appendChild(rating);
          pPricingRating.appendChild(spanRating);
          pPricingRating.appendChild(spanPricing);

          pPlaceName.classList.add("listElementHeader");
          pAddress.classList.add("listElementAddress");
          pPricingRating.classList.add("listElementOthers");

          spanInfo.appendChild(pPlaceName);
          spanInfo.appendChild(pAddress);
          spanInfo.appendChild(pPricingRating);

          listElement.appendChild(spanImage);
          listElement.appendChild(spanInfo);

          placesList.appendChild(listElement);

        }
      }
}

function showPosition(position) {
    reverseGeocode(position.coords.latitude, position.coords.longitude);
}

export {getLocation};