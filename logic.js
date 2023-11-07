const apiKey = "4c9b96648amsh2dc6631f46e1410p14cef6jsn330d2b37413c";
const weatherForm = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location");
const locationName = document.querySelector("#placeName h3");
const forecastList = document.querySelector("#forecast-list");

/* const clientId = "86cd7c29";
const clientSecret = "836f9c4729b3f6639bf42e6e2f04bbfd";
const trackId = "2038657";

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${clientId}:${clientSecret}`,
  },
};

const audioElement = document.querySelector("#background-audio");

const fetchAndPlayMusic = async () => {
  try {
    const response = await axios.get(
      `https://api.jamendo.com/v3.0/tracks/file?id=${trackId}`,
      axiosConfig
    );
    console.log(response.data);

    const audioUrl = response.data.results[0].audio;
    console.log("Audio URL:", audioUrl);

    const audioConsentGranted = true;

    if (audioConsentGranted) {
      audioElement.src = audioUrl;
      audioElement.play();
      console.log("Audio playback initiated.");
    } else {
      console.log("User denied permission.");
    }
  } catch (error) {
    console.error("Det uppstod ett fel: ", error);
  }
}; */

document.addEventListener("DOMContentLoaded", () => {
  const playAudioButton = document.querySelector("#play-audio-button");
  if (playAudioButton) {
    playAudioButton.addEventListener("click", requestAudioPermission);
  }
});

const requestAudioPermission = () => {
  const permissionGranted = confirm("Do you want to play background audio?");
  if (permissionGranted) {
    playBackgroundAudio();
  }
};

const playBackgroundAudio = () => {
  const audio = document.querySelector("#background-audio");
  audio.src = "chillDub.mp3";
  audio.play();
};

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const location = locationInput.value;
  fetch(
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=7`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
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
          <img src="${iconUrl}"><strong>${date}:</strong> Max temp: ${maxTemp}°C, Min temp: ${minTemp}°C, ${condition}
        `;

        forecastList.appendChild(listItem);
      });

      console.log(data);
    })
    .catch((error) => {
      console.error("Det uppstod ett fel:", error);
    });
});
