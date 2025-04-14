async function getWeather() {
    const city = document.getElementById('city').value.trim();
    const apiKey = '626271337a7023b34164bbd07d9762b3'; // Replace with your actual OpenWeather API key
  
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const weatherResult = document.getElementById('weather-result');
      const weatherAnimation = document.querySelector('.weather-animation');
  
      // Hide previous animation
      weatherAnimation.style.display = 'block';
  
      if (data.cod === 200) {
        weatherResult.innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <p>🌡 Temperature: ${data.main.temp}°C</p>
          <p>🌥 Condition: ${data.weather[0].description}</p>
        `;
  
        // Trigger animation based on weather condition
        switch (data.weather[0].main.toLowerCase()) {
          case 'clear':
            showWeather('sunny');
            break;
          case 'clouds':
            showWeather('cloudy');
            break;
          case 'rain':
            showWeather('rainy');
            break;
          case 'thunderstorm':
            showWeather('thundery');
            break;
          default:
            showWeather('sunny');
            break;
        }
      } else {
        weatherResult.innerHTML = `<p>❌ City not found!</p>`;
      }
    } catch (error) {
      console.error(error);
      document.getElementById('weather-result').innerHTML = `<p>⚠️ Error fetching weather data.</p>`;
    }
  }
  
  // Function to show specific weather animation
  function showWeather(type) {
    const weatherElements = document.querySelectorAll('.weather');
    weatherElements.forEach((el) => {
      el.style.display = 'none'; // Hide all weather elements
    });
  
    document.getElementById(type).style.display = 'block'; // Show selected weather type
  }
  
  // Trigger by Enter key
  document.getElementById("city").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });
  