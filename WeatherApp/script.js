const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const messageContainer = document.getElementById('message-container');
const weatherDashboard = document.getElementById('weather-dashboard');
const animationContainer = document.getElementById('animation-container');

const API_BASE_URL = 'https://wttr.in/';

// --- EVENT LISTENERS ---
searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});

// --- CORE FUNCTIONS ---
async function fetchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showMessage('Please enter a city name.');
        return;
    }

    // Show loading state
    weatherDashboard.classList.remove('visible');
    showMessage('<div class="loading-spinner"></div>Fetching data...');
    
    try {
        const response = await fetch(`${API_BASE_URL}${encodeURIComponent(city)}?format=j1`);
        if (!response.ok) {
            throw new Error(`City not found or network error. Status: ${response.status}`);
        }
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showMessage('Could not retrieve weather data. Please try another city.');
    }
}

function updateUI(data) {
    const currentWeather = data.current_condition[0];
    const forecast = data.weather;

    // Update current weather
    document.getElementById('current-city').textContent = data.nearest_area[0].areaName[0].value;
    document.getElementById('current-condition').textContent = currentWeather.weatherDesc[0].value;
    document.getElementById('current-temp').textContent = `${currentWeather.temp_C}°`;
    document.getElementById('feels-like').textContent = `${currentWeather.FeelsLikeC}°`;
    document.getElementById('humidity').textContent = `${currentWeather.humidity}%`;
    document.getElementById('wind-speed').textContent = `${currentWeather.windspeedKmph} km/h`;

    // Update forecast
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = ''; // Clear previous forecast
    const days = ['Today', 'Tomorrow', 'Overmorrow'];
    forecast.forEach((day, index) => {
        const dayOfWeek = days[index] || new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class="day">${dayOfWeek}</p>
            <div class="weather-icon-small">
                <i class="wi ${mapWeatherIcon(day.hourly[4].weatherCode)}"></i>
            </div>
            <p class="temp"><strong>${day.maxtempC}°</strong> / ${day.mintempC}°</p>
        `;
        forecastContainer.appendChild(card);
    });

    // Set dynamic theme and icon
    setWeatherTheme(currentWeather.weatherCode, currentWeather.weatherDesc[0].value);
    document.getElementById('current-weather-icon').className = `wi ${mapWeatherIcon(currentWeather.weatherCode)}`;
    
    // Hide message and show dashboard
    messageContainer.style.display = 'none';
    weatherDashboard.classList.add('visible');
}

function setWeatherTheme(weatherCode, description) {
    let themeClass = 'default-bg';
    const lowerDesc = description.toLowerCase();

    clearAnimations();

    if (lowerDesc.includes('thunder')) {
        themeClass = 'thunder-bg';
    } else if (lowerDesc.includes('snow') || lowerDesc.includes('blizzard') || weatherCode >= 320 || (weatherCode >= 227 && weatherCode <= 230)) {
        themeClass = 'snowy-bg';
        createSnowflakes(30);
    } else if (lowerDesc.includes('rain') || lowerDesc.includes('drizzle') || lowerDesc.includes('shower')) {
        themeClass = 'rainy-bg';
        createRaindrops(50);
    } else if (lowerDesc.includes('cloudy') || lowerDesc.includes('overcast')) {
        themeClass = 'cloudy-bg';
    } else if (lowerDesc.includes('clear') || lowerDesc.includes('sunny')) {
        const now = new Date();
        const hour = now.getHours();
        themeClass = (hour < 6 || hour > 19) ? 'night-bg' : 'sunny-bg';
    } else if (lowerDesc.includes('mist') || lowerDesc.includes('fog')) {
        themeClass = 'mist-bg';
    }

    document.body.className = themeClass;
}

function showMessage(htmlContent) {
    weatherDashboard.classList.remove('visible');
    messageContainer.style.display = 'block';
    messageContainer.innerHTML = htmlContent;
}

// --- ANIMATION CREATORS ---
function clearAnimations() {
    animationContainer.innerHTML = '';
}

function createRaindrops(count) {
    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        animationContainer.appendChild(drop);
    }
}

function createSnowflakes(count) {
    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = '❄';
        flake.style.left = `${Math.random() * 100}vw`;
        flake.style.opacity = Math.random();
        flake.style.fontSize = `${0.5 + Math.random() * 1.5}rem`;
        const duration = 10 + Math.random() * 10;
        flake.style.animation = `snowfall ${duration}s ${Math.random() * 5}s linear infinite`;
        animationContainer.appendChild(flake);
    }
}

// --- UTILITY ---
function mapWeatherIcon(code) {
    const iconMapping = {
        '113': 'wi-day-sunny',       // Sunny/Clear
        '116': 'wi-day-cloudy',      // Partly cloudy
        '119': 'wi-cloudy',          // Cloudy
        '122': 'wi-cloudy-gusts',    // Overcast
        '143': 'wi-fog',             // Mist/Fog
        '176': 'wi-day-showers',     // Patchy rain
        '179': 'wi-day-snow',        // Patchy snow
        '182': 'wi-day-sleet',       // Patchy sleet
        '185': 'wi-day-rain',        // Patchy freezing drizzle
        '200': 'wi-day-thunderstorm',// Thundery outbreaks
        '227': 'wi-snow-wind',       // Blowing snow
        '230': 'wi-snow',            // Blizzard
        '248': 'wi-fog',             // Fog
        '260': 'wi-fog',             // Freezing fog
        '263': 'wi-sprinkle',        // Patchy light drizzle
        '266': 'wi-sprinkle',        // Light drizzle
        '281': 'wi-sleet',           // Freezing drizzle
        '284': 'wi-sleet',           // Heavy freezing drizzle
        '293': 'wi-showers',         // Patchy light rain
        '296': 'wi-showers',         // Light rain
        '299': 'wi-rain-mix',        // Moderate rain at times
        '302': 'wi-rain',            // Moderate rain
        '305': 'wi-rain-mix',        // Heavy rain at times
        '308': 'wi-rain',            // Heavy rain
        '311': 'wi-sleet',           // Light freezing rain
        '314': 'wi-sleet',           // Moderate or heavy freezing rain
        '317': 'wi-sleet',           // Light sleet
        '320': 'wi-sleet',           // Moderate or heavy sleet
        '323': 'wi-snow',            // Patchy light snow
        '326': 'wi-snow',            // Light snow
        '329': 'wi-snow',            // Patchy moderate snow
        '332': 'wi-snow',            // Moderate snow
        '335': 'wi-snow',            // Patchy heavy snow
        '338': 'wi-snow',            // Heavy snow
        '350': 'wi-hail',            // Ice pellets
        '353': 'wi-showers',         // Light rain shower
        '356': 'wi-rain-mix',        // Moderate or heavy rain shower
        '359': 'wi-rain',            // Torrential rain shower
        '362': 'wi-sleet',           // Light sleet showers
        '365': 'wi-sleet',           // Moderate or heavy sleet showers
        '368': 'wi-snow',            // Light snow showers
        '371': 'wi-snow',            // Moderate or heavy snow showers
        '374': 'wi-hail',            // Light showers of ice pellets
        '377': 'wi-hail',            // Moderate or heavy showers of ice pellets
        '386': 'wi-storm-showers',   // Patchy light rain with thunder
        '389': 'wi-thunderstorm',    // Moderate or heavy rain with thunder
        '392': 'wi-snow',            // Patchy light snow with thunder
        '395': 'wi-snow',            // Moderate or heavy snow with thunder
    };
    return iconMapping[code] || 'wi-na'; // Return 'not available' icon if code not found
}
