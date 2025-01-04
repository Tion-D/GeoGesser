const playButton = document.querySelector("#playButton");
const gameSection = document.querySelector("#game");
let map = new L.Map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
});
map.setView([51.505, -0.09], 3);

playButton.addEventListener("click", function(){
    playButton.classList.add("hide");
    gameSection.classList.remove("hide");
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var {Viewer} = mapillary;

let locations = [
    {lat: 36.8214812, lng: -120.542477},
    {lat: 39.734612815000446, lng: -95.024128265461},
    {lat: 44.356075933746524, lng: 22.056555378580015},
    {lat: 48.83112678675434, lng: 2.4012757852218556},
    {lat: 53.1517718834, lng: 22.400322247339},
];
let currentLocation = locations[Math.floor(Math.random() * locations.length)];

var viewer = new Viewer({
    accessToken: 'MLY|8902114309901053|f68dc1e372116b667d9531c9e883c58c',
    container: 'mly', // the ID of our container defined in the HTML body
    imageId: '1686345301575128',
});

function startGame(){
    viewer.showNode(currentLocation.lat, currentLocation.lng);
}

startGame();