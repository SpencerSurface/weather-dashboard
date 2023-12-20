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

    // Perform API call
    fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey).then(jsonifyResponse)
    .then(storeWeather)
    .then(displayWeather)
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


function storeWeather(weather) {
    return weather;
}


function displayWeather(weather) {
    console.log(weather);
}