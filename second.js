let chartInstance = null; // Definera globalt för att hålla reda på chart instansen
let isChartVisible = false; // Variabel för att hålla reda på om diagrammet är synligt

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
    if (!isChartVisible) {
      //Om diagrammet inte är synligt, visa det
      document.querySelector("#cryptoChart").style.display = "block";
      document.querySelector("#fetchButton").textContent =
        "Close crypto diagram";
      isChartVisible = true;
    } else {
      // Om diagrammet är synligt, dölj det
      document.querySelector("#cryptoChart").style.display = "none";
      document.querySelector("#fetchButton").textContent =
        "Show crypto diagram";
      isChartVisible = false;
    }

    if (chartInstance) {
      // Kolla att chartInstance inte är null innan destroy körs
      chartInstance.destroy();
    }

    if (isChartVisible) {
      //Skapa bara en ny chart om den ska vara synlig
      const cryptoData = await fetchCryptoData();

      const labels = cryptoData.map((item) => item.name);
      const values = cryptoData.map((item) => item.current_price);

      const ctx = document.querySelector("#cryptoChart").getContext("2d");
      new Chart(ctx, {
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
      });
    }
  };
  //Lägg till eventlistener för knappen
  const fetchButton = document.querySelector("#fetchButton");
  fetchButton.addEventListener("click", renderCryptoChart);
});

// Cities
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const cityForm = document.querySelector("#cityForm");
    const updateForm = document.querySelector("#updateForm");
    const deleteForm = document.querySelector("#deleteForm");
    const cityNameInput = document.querySelector("#cityName");
    const cityPopulationInput = document.querySelector("#cityPopulation");
    const updateCityNameInput = document.querySelector("#updateCityName");
    const updateCityPopulationInput = document.querySelector(
      "#updateCityPopulation"
    );
    const deleteCityNameInput = document.querySelector("#deleteCityName");
    const cityList = document.querySelector("#cityList");

    const apiUrl = "https://avancera.app/cities/";

    const getCities = async () => {
      try {
        const response = await axios.get(apiUrl);
        return response.data;
      } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
      }
    };

    const renderCities = async (cities) => {
      cityList.innerHTML = "";
      cities.forEach((city) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${city.name} - Population: ${city.population} - Id: ${city.id}`;

        //Delete knapp med onclick event
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = async () => {
          const confirmation = confirm(
            `Är du säker på att du vill radera ${city.name}?`
          );
          if (confirmation) {
            await deleteCity(city.id);
          }
        };
        listItem.appendChild(deleteButton);
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
        await axios.post(apiUrl, newCity, {
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
    const updateCity = async (updatedCity) => {
      try {
        const response = await axios.put(
          `${apiUrl}${updatedCity.id}`,
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
    // Eventlistener för att uppdatera stad
    const updateButton = document.querySelector("#updateButton");
    updateButton.addEventListener("click", async () => {
      const cityIdToUpdate = prompt("Skriv stads ID att uppdatera:");
      if (cityIdToUpdate) {
        const updatedCityName = prompt("Skriv uppdaterat stadsnamn");
        const updatedCityPopulation = prompt(
          "Skriv uppdaterad befolkningsantal:"
        );
        const updatedCity = {
          id: cityIdToUpdate,
          name: updatedCityName,
          population: parseInt(updatedCityPopulation, 10),
        };

        updateCity(updatedCity);
      }
    });

    //Block för radera funktionen
    const deleteCity = async (cityId) => {
      try {
        await axios.delete(`${apiUrl}${cityId}`);
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

    //Lägg till eventlyssnare för formuläret
    cityForm.addEventListener("submit", saveCity);
  } catch (error) {
    console.error("Ett oväntat fel:", error);
  }
});
