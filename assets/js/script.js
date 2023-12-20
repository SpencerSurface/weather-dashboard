// API key
const apiKey = "b2fdb0743998319a111e3826d228b094";

// Select relevant elements
const formEl = document.querySelector("form");

// Initialize, set up event listeners
formEl.addEventListener("submit", handleSubmit);


// Function definitions
// Handle the form submit event
function handleSubmit(event) {
    event.preventDefault();

    // Get city name
    // TODO: actually get it (note: API responds "400: Bad Request" if passed an empty string)
    let city = "Beijing";

    let lat;
    let lon;
    let weather;

    // Perform API calls
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey).then(jsonifyResponse)
    .then(getCoords)
    .then(fetchWeather)
    .catch(function () {
        alert("Error");
    })
}


function jsonifyResponse(response) {
    if (response.ok) {
        return response.json();
    } else {
        return null;
    }
}


function getCoords(data) {
    if (data) {
        if (data.length > 0) {
            lat = data[0].lat;
            lon = data[0].lon;
            console.log(lat, lon);
        } else {
            alert("no results found");
        }
    } else {
        alert("invalid");
    }
}


function fetchWeather() {
    fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey).then(jsonifyResponse)
    .then(storeWeather)
    .then(displayWeather)
    .catch(function () {
        alert("Error");
    })
}


function storeWeather(weather) {
    return weather;
}


function displayWeather(weather) {
    console.log(weather);
}