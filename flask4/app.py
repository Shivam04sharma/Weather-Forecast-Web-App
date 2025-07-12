import os
import requests
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'

# OpenWeatherMap API configuration
API_KEY = 'bd5e378503939ddaee76f12ad7a97608'
BASE_URL = 'https://api.openweathermap.org/data/2.5'

# Sample users for different forecast types
USERS = {
    'admin': {'password': 'admin123', 'type': 'admin'},
    
}

def validate_api_key():
    """Validate OpenWeatherMap API key"""
    try:
        test_url = f"{BASE_URL}/weather?q=London&appid={API_KEY}"
        response = requests.get(test_url, timeout=5)
        return response.status_code == 200
    except:
        return False

def get_weather_data(city, forecast_type='current'):
    """Fetch weather data from OpenWeatherMap API"""
    try:
        if forecast_type == 'current':
            url = f"{BASE_URL}/weather?q={city}&appid={API_KEY}&units=metric"
        elif forecast_type == 'hourly':
            url = f"{BASE_URL}/forecast?q={city}&appid={API_KEY}&units=metric"
        elif forecast_type == 'daily':
            url = f"{BASE_URL}/forecast?q={city}&appid={API_KEY}&units=metric"
        
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit"""
    return (celsius * 9/5) + 32

def get_weather_tips(condition):
    """Get weather-related tips based on condition"""
    tips = {
        'Clear': 'Perfect weather for outdoor activities! Don\'t forget sunscreen.',
        'Clouds': 'Great weather for a walk. Light jacket recommended.',
        'Rain': 'Don\'t forget your umbrella! Stay dry and warm.',
        'Snow': 'Bundle up! Watch out for slippery conditions.',
        'Thunderstorm': 'Stay indoors if possible. Avoid outdoor activities.',
        'Drizzle': 'Light rain expected. A light jacket should suffice.',
        'Mist': 'Reduced visibility. Drive carefully if you must go out.'
    }
    return tips.get(condition, 'Stay weather-aware and dress appropriately!')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username in USERS and USERS[username]['password'] == password:
            session['username'] = username
            session['user_type'] = USERS[username]['type']  # set user type from USERS dict
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        flash('Please login to access the dashboard.', 'error')
        return redirect(url_for('login'))
    
    return render_template('dashboard.html', user_type=session['user_type'])

@app.route('/weather', methods=['GET', 'POST'])
def weather():
    if 'username' not in session:
        flash('Please login to access weather data.', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        city = request.form.get('city', 'London')
        forecast_type = request.form.get('forecast_type', 'current')
        
        # Validate API key before making calls
        if not validate_api_key():
            flash('Weather service temporarily unavailable. Please try again later.', 'error')
            return render_template('weather.html')
        
        weather_data = get_weather_data(city, forecast_type)
        
        if weather_data:
            # Process weather data based on forecast type
            if forecast_type == 'current':
                current_weather = {
                    'city': weather_data['name'],
                    'country': weather_data['sys']['country'],
                    'temperature_c': round(weather_data['main']['temp']),
                    'temperature_f': round(celsius_to_fahrenheit(weather_data['main']['temp'])),
                    'humidity': weather_data['main']['humidity'],
                    'condition': weather_data['weather'][0]['main'],
                    'description': weather_data['weather'][0]['description'].title(),
                    'icon': weather_data['weather'][0]['icon'],
                    'feels_like_c': round(weather_data['main']['feels_like']),
                    'feels_like_f': round(celsius_to_fahrenheit(weather_data['main']['feels_like'])),
                    'pressure': weather_data['main']['pressure'],
                    'wind_speed': weather_data['wind']['speed'],
                    'wind_direction': weather_data['wind'].get('deg', 'N/A'),
                    'sunrise': datetime.fromtimestamp(weather_data['sys']['sunrise']).strftime('%H:%M'),
                    'sunset': datetime.fromtimestamp(weather_data['sys']['sunset']).strftime('%H:%M'),
                    'tips': get_weather_tips(weather_data['weather'][0]['main'])
                }
                
                return render_template('weather.html', 
                                     current_weather=current_weather, 
                                     forecast_type=forecast_type,
                                     user_type=session['user_type'])
            
            elif forecast_type == 'hourly':
                hourly_forecast = []
                for item in weather_data['list'][:8]:  # Next 24 hours (3-hour intervals)
                    hourly_forecast.append({
                        'time': datetime.fromtimestamp(item['dt']).strftime('%H:%M'),
                        'date': datetime.fromtimestamp(item['dt']).strftime('%m/%d'),
                        'temperature_c': round(item['main']['temp']),
                        'temperature_f': round(celsius_to_fahrenheit(item['main']['temp'])),
                        'condition': item['weather'][0]['main'],
                        'description': item['weather'][0]['description'].title(),
                        'icon': item['weather'][0]['icon'],
                        'humidity': item['main']['humidity'],
                        'wind_speed': item['wind']['speed']
                    })
                
                return render_template('weather.html', 
                                     hourly_forecast=hourly_forecast,
                                     city=weather_data['city']['name'],
                                     forecast_type=forecast_type,
                                     user_type=session['user_type'])
            
            elif forecast_type == 'daily':
                daily_forecast = []
                processed_dates = set()
                
                for item in weather_data['list']:
                    date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
                    if date not in processed_dates and len(daily_forecast) < 5:
                        daily_forecast.append({
                            'date': datetime.fromtimestamp(item['dt']).strftime('%A, %B %d'),
                            'temperature_c': round(item['main']['temp']),
                            'temperature_f': round(celsius_to_fahrenheit(item['main']['temp'])),
                            'condition': item['weather'][0]['main'],
                            'description': item['weather'][0]['description'].title(),
                            'icon': item['weather'][0]['icon'],
                            'humidity': item['main']['humidity'],
                            'wind_speed': item['wind']['speed']
                        })
                        processed_dates.add(date)
                
                return render_template('weather.html', 
                                     daily_forecast=daily_forecast,
                                     city=weather_data['city']['name'],
                                     forecast_type=forecast_type,
                                     user_type=session['user_type'])
        else:
            flash('City not found or weather service unavailable.', 'error')
    
    return render_template('weather.html', user_type=session.get('user_type'))

if __name__ == '__main__':
    app.run(debug=True)