const API_KEY = 'dcd8781321855811fa7ce77cb39db356';
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current_weather_items');
const timeZone = document.getElementById('time_zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather_forecast');
const currentTempEl = document.getElementById('current_temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 
'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(()=>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' +
    `<span id="am_pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success)=>{
        console.log(success);

        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then(res=>res.json()).then(data=>{
            console.log(data);
            showWeatherData(data);
        })
    })
}
getWeatherData();

function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timeEl.innerHTML = data.timeZone;
    countryEl.innerHTML = data.lat.toFixed(2) + 'N  ' + data.lon.toFixed(2) + 'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather_item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather_item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather_item">
        <div>Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>
    <div class="weather_item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('hh : mm a')}</div>
    </div>
    <div class="weather_item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('hh : mm a')}</div>
    </div>`;
    
    let otherDayForecast = '';
    data.daily.forEach((day, idx)=>{
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img class="w_icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night.toFixed(1)}&#176; C</div>
                <div class="temp">Day - ${day.temp.day.toFixed(1)}&#176; C</div>
            </div>`
        }else{
            otherDayForecast += `
            <div class="weather_forecast_item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img class="w_icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon">
                <div class="temp">Night - ${day.temp.night.toFixed(1)}&#176; C</div>
                <div class="temp">Day - ${day.temp.day.toFixed(1)}&#176; C</div>
            </div>`
        }
    })
    weatherForecastEl.innerHTML = otherDayForecast;
}