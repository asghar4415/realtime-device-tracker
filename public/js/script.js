const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('sendLocation', { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Asghar",
}).addTo(map);

const markers = {};

socket.on("newLocation", (data) => {
    const { id, latitude, longitude } = data;
    // console.log(`Received location from user ${id}: ${latitude}, ${longitude}`);
    map.setView([latitude, longitude], 15);
    const popupContent = `<b>User ${id}</b><br>Latitude: ${latitude}<br>Longitude: ${longitude}`;
  
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }
    // markers[id].bindPopup(popupContent);

});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
