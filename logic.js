const apiKey = "4c9b96648amsh2dc6631f46e1410p14cef6jsn330d2b37413c";
const weatherUrl =
  "https://weatherapi-com.p.rapidapi.com/current.json?q=Gothenburg";

fetch(weatherUrl, {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const temperature = data.current.temp_c;
    const iconUrl = data.current.condition.icon;

    const temperatureElement = document.querySelector("#temperature");
    const iconElement = document.querySelector("#weather-icon");

    temperatureElement.textContent = temperature;
    iconElement.src = iconUrl;
    console.log(data);
  })
  .catch((error) => {
    console.error("Det uppstod ett fel:", error);
  });
