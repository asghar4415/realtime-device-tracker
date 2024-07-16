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
            timeout: 5000,
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
    map.setView([latitude, longitude], 16);
    const popupContent = `<b>User ${id}</b><br>Latitude: ${latitude}<br>Longitude: ${longitude}`;
    
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].getPopup().setContent(popupContent);
        markers[id].openPopup(); 
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        markers[id].bindPopup(popupContent).openPopup();
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
