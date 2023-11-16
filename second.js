document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded");

  // Hämta de 5 dyraste kryptokurserna i USD från CoinGecko API
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
            borderColor: "rgba(192, 192, 192, 1)",
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
});

// Cities
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const cityForm = document.querySelector("#cityForm");
    const cityNameInput = document.querySelector("#cityName");
    const cityPopulationInput = document.querySelector("#cityPopulation");
    const cityList = document.querySelector("#cityList");

    const apiUrl = "https://avancera.app/cities/";

    const getCities = async () => {
      const response = await axios.get(apiUrl);
      return response.data;
    };

    const renderCities = async (cities) => {
      cityList.innerHTML = "";
      cities.forEach((city) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${city.name} - Population: ${city.population}`;
        cityList.appendChild(listItem);
      });
    };

    const saveCity = async (event) => {
      event.preventDefault();

      const newCity = {
        name: cityNameInput.value,
        population: parseInt(cityPopulationInput.value, 10),
      };

      try {
        //Post för att lägga till
        console.log("Sending request with data:", newCity);
        await axios.post(apiUrl, newCity);
        console.log("Request successful");
        //Uppdatera städer och rendera på nytt
        const cities = await getCities();
        renderCities(cities);
      } catch (error) {
        console.error("Error saving city:", error);
        console.log("Response data:", error.response.data);
      }
    };

    //Lyssnare för formuläret
    cityForm.addEventListener("submit", saveCity);

    //Initial render för att visa befintliga städer
    const cities = await getCities();
    renderCities(cities);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
});
