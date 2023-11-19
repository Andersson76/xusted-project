document.addEventListener("DOMContentLoaded", async () => {
  const apiKey = "4c9b96648amsh2dc6631f46e1410p14cef6jsn330d2b37413c";
  const weatherForm = document.querySelector("#weather-form");
  const locationInput = document.querySelector("#location");
  const locationName = document.querySelector("#placeName h3");
  const forecastList = document.querySelector("#forecast-list");
  const playAudioButton = document.querySelector("#play-audio-button");
  const audioElement = document.querySelector("#background-audio");

  // Funktion för att hantera audio play/paus
  const toggleAudio = async () => {
    if (audioElement.paused) {
      try {
        await audioElement.play();
        playAudioButton.textContent = "Audio is On";
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      audioElement.pause();
      audioElement.currentTime = 0;
      playAudioButton.textContent = "Play Audio";
    }
  };

  // Funktion för att söka väder efter plats
  const searchWeather = async (location) => {
    try {
      const response = await axios.get(
        `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=7`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
          },
        }
      );
      const data = await response.data;

      const temperature = data.current.temp_c;
      const iconUrl = data.current.condition.icon;
      const forecastDays = data.forecast.forecastday;

      const temperatureElement = document.querySelector("#temperature");
      const iconElement = document.querySelector("#weather-icon");

      temperatureElement.textContent = temperature;
      iconElement.src = iconUrl;
      locationName.textContent = location;

      forecastList.innerHTML = "";

      forecastDays.forEach((day) => {
        const date = day.date;
        const maxTemp = day.day.maxtemp_c;
        const minTemp = day.day.mintemp_c;
        const condition = day.day.condition.text;
        const iconUrl = day.day.condition.icon;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <img src="${iconUrl}"><br>${date}<br> Max: ${maxTemp}°C Min: ${minTemp}°C <br>${condition}
        `;
        forecastList.appendChild(listItem);
      });

      //Spara senast sökta platsen i localStorage
      localStorage.setItem("lastSearchedLocation", location);
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Felmedelande till användaren
      alert("An error occurred while fetching weather data. Please try again.");
    }
  };

  //Hämta senast sökta platsen från localstorage
  const lastSearchedLocation = localStorage.getItem("lastSearchedLocation");
  if (lastSearchedLocation) {
    locationInput.value = lastSearchedLocation;
    searchWeather(lastSearchedLocation);
  }

  // Event listener för audio knappen
  playAudioButton.addEventListener("click", toggleAudio);

  // Event listener för väder formulär
  weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = locationInput.value.trim();

    if (location) {
      // Kallar på searchWeather funktionen med angiven plats
      searchWeather(location);
    } else {
      // Alert om ingen plats angivits vid sökningen
      alert("Please enter a location to search for weather.");
    }
  });
});
