var getCity = JSON.parse(localStorage.getItem('savedCities')) || [];

var getCurrentWeather = function (name) {
    fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&units=imperial&appid=375562b4f26c547f51216ffc8dc01aa2"
    )
        .then(function (response) {
            //console.log(response.json())
            return response.json();
        })
        .then(function (city) {
            console.log(city);
            //Longitude and latitude of city
            var longitude = city.coord.lon;
            var latitude = city.coord.lat;

            var currentDate = document.getElementById('current-date');
            //Current date in MM/DD/YYYY format
            currentDate.textContent = city.timezone + ' ' + moment().format('MM/DD/YYYY');

            //Current temp of a city
            var currentTemp = city.main.temp;
            var currentTempInfoEl = document.createElement('p');
            var currentInfo = document.querySelector('.current-info');
            currentTempInfoEl.innerHTML = '';
            currentTempInfoEl.textContent = 'Temp: ' + currentTemp + "°F";
            currentInfo.appendChild(currentTempInfoEl);

            var currentWind = city.wind.speed;
            var currentWindInfoEl = document.createElement('p');
            currentWindInfoEl.innerHTML = '';
            currentWindInfoEl.textContent = 'Wind: ' + currentWind + " MPH";
            currentInfo.appendChild(currentWindInfoEl);

            var currentHum = city.main.humidity;
            var currentHumInfoEl = document.createElement('p');
            currentHumInfoEl.innerHTML = '';
            currentHumInfoEl.textContent = 'Humidity: ' + currentHum + "%";
            currentInfo.appendChild(currentHumInfoEl);

            getUV(latitude, longitude);
        })
}

var getUV = function (latitude, longitude) {
    fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        latitude + "&lon=" + longitude +
        "&exclude=hourly&units=imperial&appid=375562b4f26c547f51216ffc8dc01aa2"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (uvInfo) {
            console.log(uvInfo);

            var currentInfo = document.querySelector('.current-info');
            var currentUVInfoEl = document.createElement('p');
            currentUVInfoEl.innerHTML = '';
            currentUVInfoEl.textContent = 'UV Index: ' + uvInfo.current.uvi;
            currentInfo.appendChild(currentUVInfoEl);
        })
}

$('.city-name').click(function () {
    var name = document.querySelector('#input').value;
    console.log(name);

    getCity.push(name);
    localStorage.setItem('savedCities',JSON.stringify(getCity));

    getCurrentWeather(name);
})