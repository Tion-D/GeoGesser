const playButton = document.querySelector("#playButton");
const gameSection = document.querySelector("#game");
const scoreSpan = document.querySelector("#scoreNumber");
const distanceSpan = document.querySelector("#km");
const noGuess = document.querySelector("#noGuess");
const guess = document.querySelector("#guess");
const resultSection = document.querySelector("#result");
const NextRoundButton = document.querySelector("#NextRound");
const endGameButton = document.querySelector("#endGame");
const roundNumberDiv = document.querySelector("#roundNumber");
const ScoreRow = document.querySelector("#scoreRow");
const distanceRow = document.querySelector("#distanceRow");
let overAllScore = 0;
let round = 1;


let map = new L.Map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
});
map.setView([51.505, -0.09], 3);

let map2 = new L.Map('map2', {
});
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

map2.setView([currentLocation.lat, currentLocation.lng], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2);

let markerMap2 = L.marker([currentLocation.lat, currentLocation.lng]).addTo(map2);

var viewer = new Viewer({
    accessToken: 'MLY|8902114309901053|f68dc1e372116b667d9531c9e883c58c',
    container: 'mly',
    imageId: '1686345301575128',
});

function startGame(){
    viewer.showNode(currentLocation.lat, currentLocation.lng);
}

function calculateDistance(guessLat, guessLon, targetLat, targetLon){
    let radius = 6371;
    let dLat = (targetLat - guessLat) * Math.PI/180;

    let dLon = (targetLon - guessLon) * Math.PI/180;

    let a = Math.sin(dLat/2) * Math.sin(dLat / 2) + Math.cos(guessLat * Math.PI/180) * Math.cos(targetLat * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(radius * c);
}

function calculateScore(dist){
    const MAXSCORE = 5000;
    const MAXDISTANCE = 13000;
    if(dist == 0){
        return MAXSCORE;
    }
    else if(dist >= MAXDISTANCE){
        return 0;
    }
    else{
        return Math.round(MAXSCORE * (1-(dist/MAXDISTANCE)));
    }
}

function submitGuess(playerGuess){
    changeLocation();
    resultSection.classList.remove("hide");
    gameSection.classList.add("hide");
    round += 1;
    if(playerGuess != null){
        let distance = calculateDistance(playerGuess.lat, playerGuess.lng, currentLocation.lat, currentLocation.lng);
        let currentScore = calculateScore(distance);
        overAllScore += currentScore;
        guess.classList.remove("hide");
        scoreSpan.innerText = currentScore;
        distanceSpan.innerText = distance;
        let guessMarkerMap2 = L.marker([playerGuess.lat, playerGuess.lng], {
            icon: L.divIcon({ 
                className: 'custom-icon', 
                html: '<div style="background-color: red; width: 25px; height: 25px; border-radius: 50%;"></div>'
            })
        }).addTo(map2);
    }
    else{
        noGuess.classList.remove("hide");
        scoreSpan.innerText = 0;
    }
}

function changeLocation() {
    let newLocation;
    do {
        newLocation = locations[Math.floor(Math.random() * locations.length)];
    } while (newLocation.lat === currentLocation.lat && newLocation.lng === currentLocation.lng);
    
    currentLocation = newLocation;
    markerMap2.setLatLng([currentLocation.lat, currentLocation.lng]);

    map2.setView([currentLocation.lat, currentLocation.lng], 6);

}

function resetRound(){
    resultSection.classList.add("hide");
    gameSection.classList.remove("hide");
    if(round >= 3){
        NextRoundButton.classList.add("#hide");
        endGameButton.classList.remove("#hide");
    }
    roundNumberDiv.innerText = round;
}

function endGame(){
    console.log("game engeded");
}
NextRoundButton.addEventListener("click", resetRound);
endGameButton.addEventListener("click", endGame);
//startGame();
