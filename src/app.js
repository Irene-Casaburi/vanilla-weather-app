let forecastIcons = {
  "01d": "fa-sun",
  "01n": "fa-moon",
  "02d": "fa-cloud-sun",
  "02n": "fa-cloud-moon",
  "03d": "fa-cloud",
  "03n": "fa-cloud",
  "04d": "fa-cloud",
  "04n": "fa-cloud",
  "09d": "fa-cloud-showers-heavy",
  "09n": "fa-cloud-showers-heavy",
  "10d": "fa-cloud-sun-rain",
  "10n": "fa-cloud-moon-rain",
  "11d": "fa-cloud-bolt",
  "11n": "fa-cloud-bolt",
  "13d": "fa-snowflake",
  "13n": "fa-snowflake",
  "50d": "fa-smog",
  "50n": "fa-smog",
};

let backgroundImages = {
  "01d": "000/045/565/original/01d.jpg?1662402327",
  "01n": "000/045/637/original/01n_2.png?1662452805",
  "02d": "000/045/563/original/02d.jpg?1662401767",
  "02n": "000/045/642/original/02n_2.png?1662455764",
  "03d": "000/045/638/original/03d_2.jpg?1662454573",
  "03n": "000/045/590/original/03n_2.jpg?1662405668",
  "04d": "000/045/638/original/03d_2.jpg?1662454573",
  "04n": "000/045/590/original/03n_2.jpg?1662405668",
  "09d": "000/045/591/original/09d_2.jpg?1662405676",
  "09n": "000/045/592/original/09n_2.jpg?1662405686",
  "10d": "000/045/591/original/09d_2.jpg?1662405676",
  "10n": "000/045/592/original/09n_2.jpg?1662405686",
  "11d": "000/045/639/original/11n_2.jpg?1662455030",
  "11n": "000/045/639/original/11n_2.jpg?1662455030",
  "13d": "000/045/640/original/13d_2.jpg?1662455171",
  "13n": "000/045/646/original/13n_2.jpg?1662456023",
  "50d": "000/045/593/original/50d_2.jpg?1662405697",
  "50n": "000/045/593/original/50d_2.jpg?1662405697",
};

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let formattedDay = daysOfTheWeek[date.getDay()];
  let formattedDate = `${formattedDay} ${hours}:${minutes}`;
  return formattedDate;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return daysOfTheWeek[day];
}

function showForecast(response) {
  let dailyForecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHtml = `<div class="row align-items-start">`;

  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 8) {
      forecastHtml =
        forecastHtml +
        `<div>
                    <div class="d-flex align-items-center daily-forecast-item">
                        <span class="weather-forecast-day">${formatForecastDay(
                          forecastDay.dt
                        )}</span>
                        <i class="fa-solid ${
                          forecastIcons[forecastDay.weather[0].icon]
                        } forecast-icons"></i>
                        <div class="weather-forecast-temperatures">
                        <div class="weather-forecast-temperature-max">${Math.round(
                          forecastDay.temp.max
                        )}°C</div>
                        <div class="weather-forecast-temperature-min"> ${Math.round(
                          forecastDay.temp.min
                        )}°C</div>
                        </div>
                    </div>
                </div>`;
    }
  });
  forecastHtml = forecastHtml + `</div>`;
  forecastElement.innerHTML = forecastHtml;
}

function getForecast(coordinates) {
  let apiKey = "a43564c91a6c605aeb564c9ed02e3858";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showCityWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let conditionsElement = document.querySelector("#conditions");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date-time");
  let weatherIconElement = document.querySelector("#weather-icon");
  let weatherAppElement = document.querySelector("#weather-app");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  conditionsElement.innerHTML = response.data.weather[0].main;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  weatherIconElement.innerHTML = `<i
      class="fa-solid ${
        forecastIcons[response.data.weather[0].icon]
      } forecast-icons"
    ></i>`;
  getForecast(response.data.coord);
  weatherAppElement.style.backgroundImage = `url("https://s3.amazonaws.com/shecodesio-production/uploads/files/${
    backgroundImages[response.data.weather[0].icon]
  }")`;
}

function searchCity(city) {
  let apiKey = "72b484ab5570dfdd776f4960e244a513";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showCityWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-bar").value;
  searchCity(cityInput);
}

function getCoords(position) {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiKey = "72b484ab5570dfdd776f4960e244a513";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showCityWeather);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoords);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSubmit);

let currentLocationElement = document.querySelector("#current-location-button");
currentLocationElement.addEventListener("click", getLocation);

searchCity("London");
