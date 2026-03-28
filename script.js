const API_KEY = 'c60d75f553d75bc331bc5334f6a149b9'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';


const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');

const currentIcon = document.getElementById('current-icon');
const currentTemp = document.getElementById('current-temp');
const currentLocation = document.getElementById('current-location');

const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');

const forecastContainer = document.getElementById('forecast-container');

// Event Listeners
searchBtn.addEventListener('click', () => fetchWeatherData(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeatherData(cityInput.value);
});

// Main Fetch Function
async function fetchWeatherData(city) {
    if (!city) return;

    try {
        // Clear previous errors
        errorMessage.style.display = 'none';
        errorMessage.innerText = '';

        // Fetch Current Weather
        const currentRes = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
        if (!currentRes.ok) throw new Error('City not found');
        const currentData = await currentRes.json();

        // Fetch Forecast (OpenWeather 5 day / 3 hour forecast)
        const forecastRes = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastRes.json();

        updateCurrentWeather(currentData);
        updateForecast(forecastData);

    } catch (error) {
        errorMessage.innerText = error.message;
        errorMessage.style.display = 'block';
    }
}

// Update UI: Current Weather
function updateCurrentWeather(data) {
    currentIcon.style.display = 'block';
    currentIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    currentTemp.innerText = `${Math.round(data.main.temp)}°`;
    currentLocation.innerText = `${data.name}, ${data.sys.country}`;

    windSpeed.innerText = `${data.wind.speed} m/s`;
    humidity.innerText = `${data.main.humidity} %`;
    visibility.innerText = `${(data.visibility / 1000).toFixed(1)} km`;
    pressure.innerText = `${data.main.pressure} hPa`;
}

// Update UI: Forecast Cards
function updateForecast(data) {
    forecastContainer.innerHTML = ''; // Clear existing cards
    
    // OpenWeather gives data every 3 hours. We'll grab the next 5 intervals for the UI.
    const forecastList = data.list.slice(0, 5); 

    // CSS Classes for the gradients from your reference image
    const gradients = ['bg-gradient-1', 'bg-gradient-2', 'bg-gradient-3', 'bg-gradient-1', 'bg-gradient-2'];

    forecastList.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;

        const card = document.createElement('div');
        card.className = `forecast-card ${gradients[index]}`;
        
        card.innerHTML = `
            <span class="time">${timeString}</span>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon">
            <span class="temp">${temp}°</span>
        `;
        
        forecastContainer.appendChild(card);
    });
}
