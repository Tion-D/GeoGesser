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
const replayButton = document.querySelector('#replay');
const scoreTDs = ScoreRow.querySelectorAll("td");
const distanceTDs = distanceRow.querySelectorAll("td");
const endGame1 = document.querySelector("#endGame1");

let timer;
let overAllScore = 0;
let round = 1;
let overAllDistance = 0;
let distanceValue = [];
let scoreValue = [];
let playerGuessCord = [];
let actualCord = [];
let colors = [
    "blue",
    "yellow",
    "red"
];
let map = new L.Map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
});
map.setView([0, 0], 3);

let map2 = new L.Map('map2', {
});
playButton.addEventListener("click", function(){
    timer = setTimeout(function(){
        console.log("began");
        submitGuess(null);
    }, 120000);
    playButton.classList.add("hide");
    gameSection.classList.remove("hide");
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let map3 = new L.Map('map3', {
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map3);
map3.setView([0, 0], 2.5);

var {Viewer} = mapillary;

let locations = [
    {lat: 10.038531829941618, lng: -68.71121452265015, imgID: 1352123905253316},
    {lat: 17.394059371484104, lng: -57.08270248986122, imgID: 1350414852285153},
    {lat: -1.6949823958166945, lng: -4.328393901845743, imgID: 327084939716423},
    {lat: -0.5096138053929167, lng: 122.61402619859211, imgID: 339795405423817},
    {lat: 32.87923517014107, lng: 124.14070375249912, imgID: 1187850948553139}
];
let currentLocation = locations.splice(Math.floor(Math.random()*locations.length), 1)[0];
actualCord.push(currentLocation);
map2.setView([currentLocation.lat, currentLocation.lng], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2);

let markerMap2 = L.marker([currentLocation.lat, currentLocation.lng], {
    icon: L.divIcon({ 
        className: 'custom-icon', 
        html: `<div style="background-color: ${colors[0]}; width: 25px; height: 25px; border-radius: 0%;"></div>`
    })
}).addTo(map2);

var viewer = new Viewer({
    accessToken: 'MLY|8902114309901053|f68dc1e372116b667d9531c9e883c58c',
    container: 'mly',
    imageId: currentLocation.imgID,
});
let guessMarkerMap2 = L.marker([currentLocation.lat, currentLocation.lng], {
    icon: L.divIcon({ 
        className: 'custom-icon', 
        html: `<div style="background-color: ${colors[0]}; width: 25px; height: 25px; border-radius: 50%;"></div>`
    })
}).addTo(map2);

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
        playerGuessCord.push(playerGuess);
        let distance = calculateDistance(playerGuess.lat, playerGuess.lng, currentLocation.lat, currentLocation.lng);
        distanceValue.push(distance);
        let currentScore = calculateScore(distance);
        scoreValue.push(currentScore);
        overAllScore += currentScore;
        overAllDistance += distance;
        guess.classList.remove("hide");
        noGuess.classList.add("hide");
        scoreSpan.innerText = currentScore;
        distanceSpan.innerText = distance;
        guessMarkerMap2.setLatLng([playerGuess.lat, playerGuess.lng]);
        guessMarkerMap2._icon.innerHTML = `<div style="background-color: ${colors[round - 2]}; width: 25px; height: 25px; border-radius: 50%;"></div>`;
    }
    else{
        guess.classList.add("hide");
        noGuess.classList.remove("hide");
        scoreSpan.innerText = 0;
        scoreValue.push(0);
        distanceValue.push("N/A");
        guessMarkerMap2.setLatLng([currentLocation.lat, currentLocation.lng]);
        guessMarkerMap2._icon.innerHTML = `<div style="background-color: ${colors[round - 2]}; width: 25px; height: 25px; border-radius: 50%;"></div>`;
    }
}

function changeLocation() {
    let newLocation;
    do {
        newLocation = locations.splice(Math.floor(Math.random()*locations.length), 1)[0];
    } while (newLocation.lat === currentLocation.lat && newLocation.lng === currentLocation.lng);
    actualCord.push(newLocation);
    currentLocation = newLocation;
    markerMap2.setLatLng([currentLocation.lat, currentLocation.lng]);

    map2.setView([currentLocation.lat, currentLocation.lng], 6);
    if (viewer){
        viewer.remove();
        console.log("change locltion");
    }
    var viewer = new Viewer({
        accessToken: 'TOKEN',
        container: 'mly',
        imageId: currentLocation.imgID,
    });
    markerMap2._icon.innerHTML = `<div style="background-color: ${colors[round - 1]}; width: 25px; height: 25px; border-radius: 0%;"></div>`;
}

function resetRound(){
    timer = setTimeout(function(){
        console.log("resetted");
        submitGuess(null);
    }, 120000);
    resultSection.classList.add("hide");
    gameSection.classList.remove("hide");
    if(round >= 3){
        NextRoundButton.classList.add("hide");
        endGameButton.classList.remove("hide");
    }
    roundNumberDiv.innerText = round;
}

function endGame(){
    console.log("game engeded");
    distanceValue.forEach((distance) => {
        if(distance == "N/A"){
            overAllDistance = "N/A";
        }
    });
    distanceValue.push(overAllDistance);
    scoreValue.push(overAllScore);
    for (let i = 0; i < distanceTDs.length; i++){
        distanceTDs[i].innerText = distanceValue[i];
    }
    for (let i = 0; i < scoreTDs.length; i++){
        scoreTDs[i].innerText = scoreValue[i];
    }
    for (let i = 0; i< actualCord.length; i++){
        L.marker([actualCord[i].lat, actualCord[i].lng], {
            icon: L.divIcon({ 
                className: 'custom-icon', 
                html: `<div style="background-color: ${colors[i]}; width: 25px; height: 25px; border-radius: 0%;"></div>`
            })
        }).addTo(map3);
    }
    for (let i = 0; i< playerGuessCord.length; i++){
        L.marker([playerGuessCord[i].lat, playerGuessCord[i].lng], {
            icon: L.divIcon({ 
                className: 'custom-icon', 
                html: `<div style="background-color: ${colors[i]}; width: 25px; height: 25px; border-radius: 50%;"></div>`
            })
        }).addTo(map3);
    }
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map){
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Legend</h4>";
        div.innerHTML += '<div style="background: red"></div><span>Actual Coordinate</span><br>';
        div.innerHTML += '<div style="background: red; border-radius: 50%;"></div><span>Your Guess</span>';
        return div;
    }
    legend.addTo(map3);
    endGame1.classList.remove("hide");
    resultSection.classList.add("hide");
}


NextRoundButton.addEventListener("click", resetRound);
endGameButton.addEventListener("click", endGame);
replayButton.addEventListener("click", function(event){
    window.location.reload();
});

map.on('click', function(event){
    clearTimeout(timer);
    const playerGuessLocation = {
        "lat": event.latlng.lat,
        "lng": event.latlng.lng
    };
    submitGuess(playerGuessLocation);
});
