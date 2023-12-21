// API key
const apiKey = "b2fdb0743998319a111e3826d228b094";

// Select relevant elements
const formEl = document.querySelector("form");
const inputEl = document.querySelector("#city-text-input");
const forecastRowEl = document.querySelector("#forecast-row");

// Initialize, set up event listeners
formEl.addEventListener("submit", handleSubmit);



// Function definitions
// Handle the form submit event
function handleSubmit(event) {
    event.preventDefault();

    // Get city name
    let city = inputEl.value;
    if (city === "") {
        alert("Please enter a city name.");
        return
    }

    // Fetch coordinates for city and store to localStorage
    fetchCoords(city);

    // Get coordinates from storage
    let coordPair = getCoords(city);
    console.log(coordPair, city)
    let lat;
    let lon;
    if (coordPair) {
        lat = coordPair[0];
        lon = coordPair[1];
    } else {
        alert("Coords for that city not stored.");
        return;
    }

    // Fetch weather for coordinates and display to the page
    fetchWeather(lat, lon);
}


function fetchCoords(city) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey)
    .then(jsonifyResponse)
    .then(storeCoords)
}


function jsonifyResponse(response) {
    if (response.ok) {
        return response.json();
    } else {
        return null;
    }
}


function storeCoords(data) {
    if (data) {
        if (data.length > 0) {
            localStorage.setItem(data[0].name, JSON.stringify([data[0].lat, data[0].lon]));
        } else {
            alert("no results found");
        }
    } else {
        alert("invalid");
    }
}


function getCoords(city) {
    return JSON.parse(localStorage.getItem(city));
}


function fetchWeather(lat, lon) {
    fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
    .then(jsonifyResponse)
    .then(displayWeather)
}


// Display the weather to the page
function displayWeather(weather) {
    // Display the current weather conditions
    document.querySelector("#current-city").textContent = weather.city.name;
    document.querySelector("#current-date").textContent = dayjs.unix(weather.list[0].dt).format("MM/DD/YYYY");
    document.querySelector("#current-icon").textContent = getIcon(weather.list[0].weather[0].main);
    document.querySelector("#current-temp").textContent = weather.list[0].main.temp + "°F";
    document.querySelector("#current-wind").textContent = weather.list[0].wind.speed + " mph";
    document.querySelector("#current-humidity").textContent = weather.list[0].main.humidity + "%";

    // Clear the 5-day forecast area of the page except for the heading
    forecastRowEl.innerHTML = "<div class='col-12'><h3>5-Day Forecast:</h3></div>";

    // Get the index of the first forecast of the first day that is not the current day
    // (Have to go with the first forecast of the day - it's the only one guaranteed to exist for each of the five days)
    let firstDayIndex;
    for (let i = 0; i < weather.list.length && !firstDayIndex; i++) {
        if (dayjs.unix(weather.list[0].dt).day() !== dayjs.unix(weather.list[i].dt).day()) {
            firstDayIndex = i
        }
    }

    // Add the first forecast of the day for each of the next five days to the page
    for (let i = firstDayIndex; i < 40; i += 8) {
        // Create the card
        let forecastCard = document.createElement("div");
        forecastCard.classList.add("col", "card", "me-3", "px-2");

        // Create the card body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Create the card title and text
        let cardHeading = document.createElement("h4");
        cardHeading.classList.add("card-title");
        cardHeading.textContent = dayjs.unix(weather.list[i].dt).format("MM/DD/YYYY");
        let cardIcon = document.createElement("p");
        cardIcon.classList.add("card-text");
        cardIcon.textContent = getIcon(weather.list[i].weather[0].main);
        let cardTemp = document.createElement("p");
        cardTemp.classList.add("card-text");
        cardTemp.textContent = "Temp: " + weather.list[i].main.temp + "°F";
        let cardWind = document.createElement("p");
        cardWind.classList.add("card-text");
        cardWind.textContent = "Wind: " + weather.list[i].wind.speed + " mph";
        let cardHumidity = document.createElement("p");
        cardHumidity.classList.add("card-text");
        cardHumidity.textContent = "Humidity: " + weather.list[i].main.humidity + "%";

        // Append everything together
        cardBody.append(cardHeading, cardIcon, cardTemp, cardWind, cardHumidity);
        forecastCard.appendChild(cardBody);
        forecastRowEl.appendChild(forecastCard);
    }
}


// Map from weather conditions to emoji icons
function getIcon(weatherString) {
    switch (weatherString) {
        case "Clear":
            return "☀️";
        case "Clouds":
            return "☁️";
        case "Rain":
            return "☔️";
        case "Snow":
            return "☃️";
        default:
            return "❓️";
    }
}