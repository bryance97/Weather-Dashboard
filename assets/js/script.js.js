var getCity = JSON.parse(localStorage.getItem("savedCities")) || [];

var savedCitiesBtn = document.querySelector(".saved-cities");

//Displays current weather info
//Turns information in localStorage into a object if it exists OR creates an empty array if there is nothing inside localStorage
var getCity = JSON.parse(localStorage.getItem("savedCities")) || [];

var savedCitiesBtn = document.querySelector(".saved-cities");

//Displays current weather info
var getCurrentWeather = function (name) {
  fetch(
    //Current weather information based on user input
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      name +
      "&units=imperial&appid=375562b4f26c547f51216ffc8dc01aa2"
  )
    .then(function (response) {
      //console.log(response.json());
      return response.json();
    })
    .then(function (response) {
      //Longitude and latitude of response
      var longitude = response.coord.lon;
      var latitude = response.coord.lat;

      //Current date in MM/DD/YYYY format
      var currentDate = $("#current-date");
      currentDate.text(name + " " + moment().format("(MM/DD/YYYY)"));

      //Display icon
      var weatherIcon = response.weather[0].icon;
      var iconImage = document.createElement("img");
      var iconLocation = document.querySelector("#icon-location");
      var iconurl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
      iconImage.setAttribute("src", iconurl);
      iconLocation.appendChild(iconImage);

      //Current temp
      var currentTemp = response.main.temp;
      var currentTempEl = document.createElement("p");
      var currentWeather = document.querySelector(".p-tags");
      currentTempEl.textContent = "Temp: " + currentTemp + "°F";
      currentWeather.appendChild(currentTempEl);

      //Current wind
      var currentWind = response.wind.speed;
      var currentWindEl = document.createElement("p");
      currentWindEl.textContent = "Wind: " + currentWind + " MPH";
      currentWeather.appendChild(currentWindEl);

      //Current humidity
      var currentHum = response.main.humidity;
      var currentHumEl = document.createElement("p");
      currentHumEl.textContent = "Humidity: " + currentHum + "%";
      currentWeather.appendChild(currentHumEl);

      getUV(latitude, longitude);
    });
};

var getUV = function (latitude, longitude) {
  //Get UV Index information based on latitude and longitude of city name
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&exclude=hourly&units=imperial&appid=8480a3ee71c666d371ff28691cc3a0e8"
  )
    //Return 'One Call' info
    .then(function (response) {
      return response.json();
    })
    //Current UV Index
    .then(function (uvInfo) {
      //Create and display UV Index
      var weatherInfoDiv = document.querySelector(".p-tags");
      var uviPTag = document.createElement("p");
      uviPTag.setAttribute("id", "index");
      uviPTag.textContent = "UV Index: ";
      var uviNum = document.createElement("div");
      uviNum.textContent = uvInfo.current.uvi;
      uviPTag.appendChild(uviNum);
      weatherInfoDiv.appendChild(uviPTag);

      //Change background color of UV Index based on value
      if (uvInfo.current.uvi >= 0 && uvInfo.current.uvi <= 2) {
        $("#index div").attr("class", "low");
      } else if (uvInfo.current.uvi >= 2 && uvInfo.current.uvi <= 5) {
        $("#index div").attr("class", "moderate");
      } else if (uvInfo.current.uvi > 5) {
        $("#index div").attr("class", "high");
      }
    });
};
var getFiveDay = function (name) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      name +
      "&units=imperial&appid=746a6e0471547b3aa9ba1351082eb0a3"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (city) {
      //Index numbers that indicate specific time of a specific date
      array = [0, 7, 15, 23, 31];
      for (var i = 1, j = 0; i <= 5; i <= 5 && j < array.length, i++, j++) {
        day = i;
        index = j;

        //Creates div elements and information for 5-day forecast
        var fiveDayDiv = document.querySelector(".five-day-divs");
        var div = $("<div>");
        div.attr({
          id: "day-" + i,
          class: "mx-auto px-1 border border-dark rounded",
        });
        div.css("background-color", "#5F9EA0");
        div.appendTo(fiveDayDiv);

        var futureDate = moment().add(day, "days").format("MM/DD/YYYY");
        var date = $("<h4>");
        date.text(futureDate);
        date.appendTo("#day-" + day);
        var icon = city.list[index].weather[0].icon;
        var img = $("<img>");
        var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        img.attr("src", iconurl);
        img.appendTo("#day-" + day);
        var temp = city.list[index].main.temp;
        var paragraph = $("<p>");
        paragraph.text("Temp: " + temp + "°F");
        paragraph.appendTo("#day-" + day);
        var windSpeed = city.list[index].wind.speed;
        var paragraph = $("<p>");
        paragraph.text("Wind: " + windSpeed + " MPH");
        paragraph.appendTo("#day-" + day);
        var humidity = city.list[index].main.humidity;
        var paragraph = $("<p>");
        paragraph.text("Humidity: " + humidity + "%");
        paragraph.appendTo("#day-" + day);
      }
    });
};
$(".search-btn").click(function () {
  //Input value (city name)
  var name = $("#input").val();
  $(".p-tags").empty();
  $(".five-day-divs").empty();
  $("#icon-location").empty();

  //Create and display saved city buttons
  var newBtn = document.createElement("button");
  newBtn.style.margin = "14px 0px";
  newBtn.style.display = "block";
  newBtn.style.borderRadius = "5px";
  newBtn.style.width = "-webkit-fill-available";
  newBtn.textContent = name;
  savedCitiesBtn.appendChild(newBtn);

  //Clears search input
  $("#input").val("");

  //Adds city name to empty array
  getCity.push(name);

  //Saves city name to localStorage
  localStorage.setItem("savedCities", JSON.stringify(getCity));

  getCurrentWeather(name);
  getFiveDay(name);
});

$(document).ready(function () {
  //Retrieves saved cities from array
  var savedCities = JSON.parse(localStorage.getItem("savedCities"));

  //Loads saved city buttons when page loads
  for (var i = 0; i < savedCities.length; i++) {
    var newBtn = document.createElement("button");
    newBtn.style.margin = "14px 0px";
    newBtn.style.display = "block";
    newBtn.style.borderRadius = "5px";
    newBtn.style.width = "-webkit-fill-available";
    newBtn.textContent = savedCities[i];

    //Clears current and 5-day information when saved city button is clicked
    $(newBtn).on("click", function () {
      var savedCityName = $(this).text();
      $(".p-tags").empty();
      $(".five-day-divs").empty();
      $("#icon-location").empty();
      getCurrentWeather(savedCityName);
      getFiveDay(savedCityName);
    });
    savedCitiesBtn.appendChild(newBtn);
  }
});
