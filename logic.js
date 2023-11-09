const apiKey = "4c9b96648amsh2dc6631f46e1410p14cef6jsn330d2b37413c";
const weatherForm = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location");
const locationName = document.querySelector("#placeName h3");
const forecastList = document.querySelector("#forecast-list");

// Hämta de 5 dyraste kryptokurserna i USD från CoinGecko API med async/await
const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          per_page: 5,
          page: 1,
          order: "market_cap_desc",
        },
      }
    );
    const cryptoData = response.data;
    console.log(cryptoData);
    return cryptoData;
  } catch (error) {
    console.error("Kunde inte hämta kryptodata:", error);
  }
};

// Rendera stapeldiagram med data från CoinGecko API
const renderCryptoChart = async () => {
  const cryptoData = await fetchCryptoData();

  const labels = cryptoData.map((item) => item.name);
  const values = cryptoData.map((item) => item.current_price);

  const ctx = document.querySelector("#cryptoChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Värde i USD",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.3)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

renderCryptoChart();

document.addEventListener("DOMContentLoaded", () => {
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
});

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = locationInput.value;
  try {
    const response = await fetch(
      `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=7`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();

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
