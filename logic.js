const apiKey = "4c9b96648amsh2dc6631f46e1410p14cef6jsn330d2b37413c";
const weatherForm = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location");
const locationName = document.querySelector("#placeName h3");
const forecastList = document.querySelector("#forecast-list");

document.addEventListener("DOMContentLoaded", () => {
  const playAudioButton = document.querySelector("#play-audio-button");
  const audioElement = document.querySelector("#background-audio");

  playAudioButton.addEventListener("click", () => {
    if (audioElement.paused) {
      audioElement
        .play()
        .then(() => {
          playAudioButton.textContent = "Ljud spelas";
        })
        .catch((error) => {
          console.error("An error occurred while trying to play audio:", error);
        });
    } else {
      audioElement.pause();
      audioElement.currentTime = 0;
      playAudioButton.textContent = "Spela bakgrundsljud"
    }
  });
});

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
