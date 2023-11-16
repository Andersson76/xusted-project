const apiKey = "4c9b96648amsh2dc6631f46e1410p14cef6jsn330d2b37413c";
const weatherForm = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location");
const locationName = document.querySelector("#placeName h3");
const forecastList = document.querySelector("#forecast-list");

const playAudioButton = document.querySelector("#play-audio-button");
const audioElement = document.querySelector("#background-audio");

playAudioButton.addEventListener("click", async () => {
  if (audioElement.paused) {
    try {
      await audioElement.play();
      playAudioButton.textContent = "Ljud spelas";
    } catch (error) {
      console.error("Ett fel inträffade vid försök att spela ljudet:", error);
    }
  } else {
    audioElement.pause();
    audioElement.currentTime = 0;
    playAudioButton.textContent = "Spela bakgrundsljud";
  }
});

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = locationInput.value;
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
    const data = await response.data();

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
    console.log(data);
  } catch (error) {
    console.error("Det uppstod ett fel:", error);
  }
});
// Cities
const cityForm = document.querySelector("#cityForm");
const cityNameInput = document.querySelector("#cityName");
const cityPopulationInput = document.querySelector("#cityPopulation");
const cityList = document.querySelector("#cityList");

const apiUrl = "https://avancera.app/cities/";

const getCities = async () => {
  console.log("Fetching cities...");
  try {
    const response = await axios.get(apiUrl);
    console.log("Cities fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

const renderCities = async (cities) => {
  console.log("Rendering cities...");
  try {
    cityList.innerHTML = "";

    cities.forEach((city) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${city.name} - Population: ${city.population}`;
      cityList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error rendering citites:", error.message);
  }
};
const displayCities = async () => {
  const cities = await getCities();
  renderCities(cities);
};
displayCities();
