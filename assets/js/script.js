// API key
const apiKey = "b2fdb0743998319a111e3826d228b094";

// How many items to story in search history
const HISTORY_LENGTH = 10;

// Select relevant elements
const formEl = document.querySelector("form");
const inputEl = document.querySelector("#city-text-input");
const forecastRowEl = document.querySelector("#forecast-row");
const historyEl = document.querySelector("#history");

// Set up event listeners
formEl.addEventListener("submit", handleSubmit);

// Display the search history to the page
displayHistory();



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
    fetchCoords(city)
    .then(fetchWeather);

    // Update history in storage
    updateHistory(city);

    // Display history to the page
    displayHistory();
}


// Call the geocoding API to get the coordinates for the given city, then store
async function fetchCoords(city) {
    let coordPair = await fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey)
    .then(jsonifyResponse)
    .then(storeCoords)

    return coordPair
}


// JSONify the API response
function jsonifyResponse(response) {
    if (response.ok) {
        return response.json();
    } else {
        return null;
    }
}


// Store coordinates given in the data returned by the API
function storeCoords(data) {
    if (data) {
        if (data.length > 0) {
            localStorage.setItem(data[0].name, JSON.stringify([data[0].lat, data[0].lon]));
            return [data[0].lat, data[0].lon]
        } else {
            alert("no results found");
        }
    } else {
        alert("invalid");
    }
}


// Get coordinates for a given city stored in localStorage, if they exist
function getCoords(city) {
    return JSON.parse(localStorage.getItem(city));
}


// Call the 5-day forecast API to get weather data for the coordinates in question
function fetchWeather(coordPair) {
    let lat = coordPair[0];
    let lon = coordPair[1];
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


// Update the search history in the storage
function updateHistory(city) {
    let cityList = getCityList();

    if (cityList.includes(city)) {
        // Remove the existing instance of city in the list
        cityList.splice(cityList.indexOf(city), 1);
        // Add a new instance of city to the beginning of the list
        cityList.splice(0, 0, city);
    } else {
        // If the history is too long, remove an item
        if (cityList.length === HISTORY_LENGTH) {
            cityList.pop();
        }
        // Store city to the list
        cityList.splice(0, 0, city);
    }

    setCityList(cityList);
}


// Get the search history city list from localStorage
function getCityList() {
    let cityList = JSON.parse(localStorage.getItem("cityList"));
    if (!cityList) {
        cityList = [];
    }
    return cityList;
}


// Store the search history city list in localStorage
function setCityList(cityList) {
    localStorage.setItem("cityList", JSON.stringify(cityList));
}


// Display the search history to the page in the form of a series of buttons
function displayHistory() {
    // Get the search history from storage
    let cityList = getCityList();
    // Clear the history area of the page
    historyEl.innerHTML = "";
    // Add a button to the history area for each city
    for (let i = 0; i < cityList.length; i++) {
        let historyButton = document.createElement("button");
        historyButton.classList.add("btn", "btn-secondary", "mb-3", "w-100");
        historyButton.textContent = cityList[i];
        historyEl.append(historyButton);
    }
}