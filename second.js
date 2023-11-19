let chartInstance = null;
let isChartVisible = false;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded");

  const cryptoChart = document.querySelector("#cryptoChart");
  const fetchButton = document.querySelector("#fetchButton");

  // Funktion för att växla diagrammets synlighet och uppdatera knappens text
  const toggleChartVisibility = () => {
    isChartVisible = !isChartVisible;
    const displayValue = isChartVisible ? "block" : "none";
    cryptoChart.style.display = displayValue;
    fetchButton.textContent = isChartVisible
      ? "Close crypto diagram"
      : "Show crypto diagram";
  };

  // Funktion för att ta bort befintligt diagram vid behov
  const destroyExistingChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  };

  // Funktion för att hämta och rendera kryptodata
  const fetchAndRenderCryptoChart = async () => {
    // Växla synlighet och ta bort befintligt diagram
    toggleChartVisibility();
    destroyExistingChart();

    // Kontrollera om diagrammet ska vara synligt
    if (isChartVisible) {
      try {
        // Hämta kryptodata från CoinGecko API
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

        // Extrahera labels och värden från API-svaret
        const labels = cryptoData.map((item) => item.name);
        const values = cryptoData.map((item) => item.current_price);

        //Rita diagrammet
        const ctx = cryptoChart.getContext("2d");
        chartInstance = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                axis: "x",
                label: "Värde i USD",
                data: values,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.5)",
                  "rgba(255, 159, 64, 0.5)",
                  "rgba(255, 205, 86, 0.5)",
                  "rgba(75, 192, 192, 0.5)",
                  "rgba(54, 162, 235, 0.5)",
                ],
                borderColor: "rgba(192, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            indexAxis: "x",
            plugins: {
              legend: {
                labels: {
                  color: "white",
                },
              },
            },
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: "white",
                },
              },
            },
          },
        });
      } catch (error) {
        console.error("Kunde inte hämta kryptodata:", error);
      }
    }
  };

  // Rendera diagrammet vid sidans inladdning
  fetchAndRenderCryptoChart();

  // Event listener för fetch/render knappen
  fetchButton.addEventListener("click", fetchAndRenderCryptoChart);
});

// Cities
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const cityForm = document.querySelector("#cityForm");
    const cityNameInput = document.querySelector("#cityName");
    const cityPopulationInput = document.querySelector("#cityPopulation");
    const cityList = document.querySelector("#cityList");

    const CITIES_API_URL = "https://avancera.app/cities/";

    // Funktion för att fetcha städerna
    const getCities = async () => {
      try {
        const response = await axios.get(CITIES_API_URL);
        return response.data;
      } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
      }
    };

    // funktion för att rendera städerna
    const renderCities = async (cities) => {
      cityList.innerHTML = "";
      cities.forEach((city) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${city.name} - Population: ${city.population} - Id: ${city.id}  `;

        //Delete knappen med onclick event
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = async () => {
          const confirmation = confirm(
            `Are you sure you want to delete ${city.name}?`
          );
          if (confirmation) {
            await deleteCity(city.id);
          }
        };
        listItem.appendChild(deleteButton);
        cityList.appendChild(listItem);
      });
    };
    // Funktion för att spara en stad
    const saveCity = async (event) => {
      event.preventDefault();

      const newCity = {
        name: cityNameInput.value,
        population: parseInt(cityPopulationInput.value, 10),
      };

      try {
        await axios.post(CITIES_API_URL, newCity, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const cities = await getCities();
        renderCities(cities);
      } catch (error) {
        console.error("Error saving city:", error);
        console.log("Response data:", error.response.data);
      }
    };
    // Funktion för att uppdatera en stad
    const updateCity = async (updatedCity) => {
      try {
        const response = await axios.put(
          `${CITIES_API_URL}${updatedCity.id}`,
          updatedCity,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response data:", response.data);
        console.log("City updated succesfully!");

        //Uppdatera städer och rendera på nytt
        const cities = await getCities();
        renderCities(cities);
      } catch (error) {
        console.error("Error updating city:", error.response.data);
      }
    };
    // Update knappen för att uppdatera stad
    const updateButton = document.querySelector("#updateButton");
    updateButton.addEventListener("click", async () => {
      const updateCityIdInput = document.querySelector("#updateCityId");
      const updateCityNameInput = document.querySelector("#updateCityName");
      const updateCityPopulationInput = document.querySelector(
        "#updateCityPopulation"
      );
      const cityIdToUpdate = updateCityIdInput.value.trim();
      const updatedCityName = updateCityNameInput.value.trim();
      const updatedCityPopulation = parseInt(
        updateCityPopulationInput.value.trim(),
        10
      );
      // Validera inputs
      if (!cityIdToUpdate || !updatedCityName || isNaN(updatedCityPopulation)) {
        console.error("Invalid input. Please provide valid values.");
        return;
      }
      // Fråga om konfirmation
      const confirmation = confirm(
        `Are you sure you want to update City ID ${cityIdToUpdate}?`
      );
      if (confirmation) {
        const updatedCity = {
          id: cityIdToUpdate,
          name: updatedCityName,
          population: updatedCityPopulation,
        };

        await updateCity(updatedCity);
      }
    });

    // Funktionen för att radera
    const deleteCity = async (cityId) => {
      try {
        await axios.delete(`${CITIES_API_URL}${cityId}`);
        console.log("City deleted successfully!");

        // Uppdatera städer och rendera på nytt
        const cities = await getCities();
        renderCities(cities);
      } catch (error) {
        console.error("Error deleting city:", error.response.data);
      }
    };
    //Hämta och rendera städer direkt när sidan laddas
    const cities = await getCities();
    renderCities(cities);

    //Event listener för formuläret
    cityForm.addEventListener("submit", saveCity);
  } catch (error) {
    console.error("Ett oväntat fel:", error);
  }
});
