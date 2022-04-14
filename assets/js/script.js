// Variables 
var searchButton = $("#btn");
var apiKey = "bc3c243813c52ad74b6ac781570e3c03";
var searchInput = "";
var currentWeatherIconEl = $(".weathericon");
var currentTempEl = $("#todaytemp");
var currentWindEl = $("#todaywind");
var currentHumidityEl = $("#todayhumi");
var currentUvEl = $("#uvindex");
var currentDate = moment().format("M/D/YYYY");
var cityName = "";
var todaycontainer = $("#todaycontainer");
var dailyDivs = [$('#day-1-div'), $('#day-2-div'), $('#day-3-div'), $('#day-4-div'), $('#day-5-div')];
var hotelbody = $("#hotelbody");

var savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

// Forloop for persisting the data onto HMTL page
for (var i = 0; i < savedCities.length; i++) {

    var city = savedCities[i];
    var cityNameEl = $("<li>");
    cityNameEl.addClass("list-group-item btn btn-primary col-12 btn-style btn-recent");
    cityNameEl.text(city);

    $(".list-group").append(cityNameEl);
}

// Key count for local storage 
var keyCount = 0;
// Search button click event
document.getElementById("formid").addEventListener('submit', function(event){
    event.preventDefault();
    searchInput = $(".input").val();
    hotelbody.html("");
    

    // Storing New Cities into local storage with the old Cities
    var previouslySavedCities = JSON.parse(localStorage.getItem("savedCities")) || []
    previouslySavedCities.push(searchInput)
    localStorage.setItem("savedCities", JSON.stringify(previouslySavedCities))

    getHotels(searchInput);
    //function for linking hotel images
    getHotelImages(searchInput);
    getUserLocation(searchInput);
});

function getSavedCityWeather() {
    getUserLocation($(this).text())
}

// get coordinates for user location
function getUserLocation(city) {
    // Get location lon and lat
    // Make fetch request
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey).then(function(response) {
        
        // Check for valid response
        if (response.ok) {
            response.json().then(function(data) {
                
                // Gets the lon and lat of the location
                var locationLat = data[0].lat;
                var locationLon = data[0].lon;
                cityName = data[0].name;
                // Convert from Int to Str
                var latString = locationLat.toString();
                var lonString = locationLon.toString();

                // Call function to get values
                getLocationWeather(latString, lonString);
            });
        } else {
            alert("Location not found!");
        }
    }).catch(function(error) {
        
        alert("Unable to get weather");
    });


};

function getLocationWeather(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;


    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                
                // City Name and date
                var currentCityNameEl = $(".subtitle");
                currentCityNameEl.text(cityName.toUpperCase() + " (" + currentDate + ")");
                // Weather Icon
                var currentWeatherIconEl = $("#current-icon");
                currentWeatherIconEl.attr("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
                // Current Temp
                var currentTempEl = $("#todaytemp");
                currentTempEl.text(data.current.temp + "F");

                var forecastarray = data.daily
                todaycontainer.html("");

                for (var i = 0; i < forecastarray.length - 1; i++) {
                    // converting Unix to date
                    var humanDateFormat = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");

                    // Variables to dynamically create the classes into HTML
                    var card = $("<div>").addClass("card columns");
                    var cardbody = $("<div>").addClass("card-content");
                    var cardheader = $("<div>").addClass("title is-4");
                    var weatheri = $("<img>").addClass("card-header-icon");
                    var temptext = $("<div>").addClass("subtitle");
                    var windtext = $("<p>").addClass("subtitle");
                    var humidity = $("<p>").addClass("subtitle");

                    // Appending the cards and elements into the weather card
                    todaycontainer.append(card);
                    card.append(cardbody);
                    cardbody.append(cardheader);
                    cardbody.append(weatheri);
                    cardbody.append(temptext);
                    cardbody.append(windtext);
                    cardbody.append(humidity);

                    // Calling the data from API
                    cardheader.text(humanDateFormat);
                    humidity.text("Humidity: " + forecastarray[i].humidity + " %");
                    weatheri.attr("src", "https://openweathermap.org/img/wn/" + forecastarray[i].weather[0].icon + ".png");
                    temptext.text("Temperature: " + forecastarray[i].temp.day + " F");
                    windtext.text("Wind Speed: " + forecastarray[i].wind_speed + " mph");
                    
                }
            })
        }
    })
}

$("#citiesList").on("submit", ".list-group-item", getSavedCityWeather)

//Bulma documentation provided JS code for navbar toggle to make navbar responsive for mobile screens
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
  
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);
  
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
    }
  
  });

  

// Vickian & Brittany's Code Below

var getHotels = function(searchInput) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com',
      'X-RapidAPI-Key': '3fc69c7541msh2095ea3bf50e2f3p1ece8ajsnf47a3cdc9c68'
    }
  };

  // Call the hotels.com API with input from the user search
  fetch('https://hotels-com-provider.p.rapidapi.com/v1/destinations/search?query=' + searchInput + '&currency=USD&locale=en_US', options)
	.then(response => response.json())
	.then(response => 

        

    // get hotel names from API
    {
        for (let i = 0; i < response.suggestions[1].entities.length; i++) {
        //console.log(response.suggestions[1].entities[i].name);
        
        var hotelName = document.createElement('div')
        hotelName.classList.add("title", "is-4")
        hotelName.textContent = response.suggestions[1].entities[i].name;
        console.log(hotelName); 

        // Appending the cards and elements into the hotel card
        hotelbody.append(hotelName);
        }
    })

// create list item
    .catch(err => console.error(err))
}

//priyam and vickiana trying to link images for hotel 

//get hotel images based on searchInput
var getHotelImages = function (searchInput) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com',
            'X-RapidAPI-Key': '3fc69c7541msh2095ea3bf50e2f3p1ece8ajsnf47a3cdc9c68'
        }
    };



    fetch('https://hotels-com-provider.p.rapidapi.com/v1/hotels/photos?hotel_id=363464', options)
        .then(response => response.json())
        .then(response => {
            const imgUrl = response[0].mainUrl 
            var img = document.createElement("img")
            img.setAttribute("src", imgUrl)
            console.log(img); 

            //Appending the cards and elements into the hotel card
            hotelbody.append(img);
            console.log(response)
        })
        .catch(err => console.error(err));
    }

        
    