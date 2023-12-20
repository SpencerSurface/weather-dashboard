// API key
const apiKey = "b2fdb0743998319a111e3826d228b094";

// Select relevant elements
const formEl = document.querySelector("form");
const forecastRowEl = document.querySelector("#forecast-row")

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
    fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial").then(jsonifyResponse)
    .then(storeWeather)
    .then(displayWeather)
}


function storeWeather(weather) {
    localStorage.setItem(weather.city.name, JSON.stringify(weather));
    return weather;
}


function displayWeather(weather) {
    forecastRowEl.innerHTML = "<div class='col-12'><h3>5-Day Forecast:</h3></div>";

    // TODO: replace hardcoded values
    document.querySelector("#current-city").textContent = "Atlanta";
    document.querySelector("#current-date").textContent = "12/12/2023";
    document.querySelector("#current-icon").textContent = "*";
    document.querySelector("#current-temp").textContent = "53F";
    document.querySelector("#current-wind").textContent = "8mph";
    document.querySelector("#current-humidity").textContent = "71%";


    // TODO: replace hardcoded values
    let icon = "*"
    let temp = "53F";
    let wind = "10mph";
    let humidity = "53%";

    for (let i = 0; i < 5; i++) {
        let forecastCard = document.createElement("div");
        forecastCard.classList.add("col", "card", "me-3", "px-2");

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let cardHeading = document.createElement("h4");
        cardHeading.classList.add("card-title");
        cardHeading.textContent = "12/12/2023";
        let cardIcon = document.createElement("p");
        cardIcon.classList.add("card-text");
        cardIcon.textContent = icon;
        let cardTemp = document.createElement("p");
        cardTemp.classList.add("card-text");
        cardTemp.textContent = "Temp: " + temp;
        let cardWind = document.createElement("p");
        cardWind.classList.add("card-text");
        cardWind.textContent = "Wind: " + wind;
        let cardHumidity = document.createElement("p");
        cardHumidity.classList.add("card-text");
        cardHumidity.textContent = "Humidity: " + humidity;

        cardBody.append(cardHeading, cardIcon, cardTemp, cardWind, cardHumidity);
        forecastCard.appendChild(cardBody);
        forecastRowEl.appendChild(forecastCard);
    }

    console.log(weather);
}