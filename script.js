// Initialize the map and set its view to a default location and zoom level
var map = L.map('map').setView([51.505, -0.09], 13);

// Add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a draggable marker at the default location
var marker = L.marker([51.505, -0.09], { draggable: true }).addTo(map);

// Function to update the coordinates display
function updateCoordinates(lat, lng) {
    document.getElementById('coords').textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

// Function to reverse geocode and update the address display
function updateAddress(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            var address = data.display_name || "Address not found";
            document.getElementById('address').textContent = address;
        })
        .catch(error => console.log('Error:', error));
}

// Update address and coordinates when the marker is moved
marker.on('dragend', function(e) {
    var latlng = e.target.getLatLng();
    updateCoordinates(latlng.lat, latlng.lng);
    updateAddress(latlng.lat, latlng.lng);
});

// Initialize Leaflet Control Geocoder for search functionality
L.Control.geocoder({
    defaultMarkGeocode: false
})
.addTo(map)
.on('markgeocode', function(e) {
    var latlng = e.geocode.center;

    // Move the marker to the searched location
    marker.setLatLng(latlng).bindPopup("<b>Search Result</b>").openPopup();
    map.setView(latlng, 13);

    // Update the coordinates and address display
    updateCoordinates(latlng.lat, latlng.lng);
    updateAddress(latlng.lat, latlng.lng);
});
