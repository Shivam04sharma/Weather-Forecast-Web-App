// // Main JavaScript file for Weather Forecast App

// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize Bootstrap tooltips
//     var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//     var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//         return new bootstrap.Tooltip(tooltipTriggerEl);
//     });

//     // Add smooth scrolling to all links
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             e.preventDefault();
//             const target = document.querySelector(this.getAttribute('href'));
//             if (target) {
//                 target.scrollIntoView({
//                     behavior: 'smooth'
//                 });
//             }
//         });
//     });

//     // Auto-hide alerts after 5 seconds
//     const alerts = document.querySelectorAll('.alert');
//     alerts.forEach(alert => {
//         setTimeout(() => {
//             if (alert.classList.contains('show')) {
//                 alert.classList.remove('show');
//                 setTimeout(() => {
//                     alert.remove();
//                 }, 150);
//             }
//         }, 5000);
//     });

//     // Add loading spinner to form submissions
//     const forms = document.querySelectorAll('form');
//     forms.forEach(form => {
//         form.addEventListener('submit', function(e) {
//             const submitButton = form.querySelector('button[type="submit"]');
//             if (submitButton) {
//                 const originalText = submitButton.innerHTML;
//                 submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
//                 submitButton.disabled = true;
                
//                 // Re-enable button after 10 seconds to prevent permanent disable
//                 setTimeout(() => {
//                     submitButton.innerHTML = originalText;
//                     submitButton.disabled = false;
//                 }, 10000);
//             }
//         });
//     });

//     // Weather form enhancements
//     const weatherForm = document.querySelector('#weatherForm');
//     if (weatherForm) {
//         const cityInput = weatherForm.querySelector('#city');
//         if (cityInput) {
//             // Add autocomplete suggestions (simplified)
//             const popularCities = [
//                 'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Rome', 'Madrid',
//                 'Amsterdam', 'Chicago', 'Los Angeles', 'Toronto', 'Mumbai', 'Dubai', 'Singapore'
//             ];
            
//             cityInput.addEventListener('input', function() {
//                 const value = this.value.toLowerCase();
//                 // Remove existing datalist if any
//                 const existingDatalist = document.querySelector('#cityList');
//                 if (existingDatalist) {
//                     existingDatalist.remove();
//                 }
                
//                 if (value.length > 0) {
//                     const datalist = document.createElement('datalist');
//                     datalist.id = 'cityList';
                    
//                     const filteredCities = popularCities.filter(city => 
//                         city.toLowerCase().includes(value)
//                     );
                    
//                     filteredCities.forEach(city => {
//                         const option = document.createElement('option');
//                         option.value = city;
//                         datalist.appendChild(option);
//                     });
                    
//                     if (filteredCities.length > 0) {
//                         document.body.appendChild(datalist);
//                         this.setAttribute('list', 'cityList');
//                     }
//                 }
//             });
//         }
//     }

//     // Add click-to-copy functionality for demo credentials
//     const credentialElements = document.querySelectorAll('.card-body small');
//     credentialElements.forEach(element => {
//         element.style.cursor = 'pointer';
//         element.title = 'Click to copy';
        
//         element.addEventListener('click', function() {
//             const text = this.textContent;
//             const lines = text.split('\n');
//             const username = lines[0].replace('Username: ', '');
//             const password = lines[1].replace('Password: ', '');
            
//             if (navigator.clipboard) {
//                 navigator.clipboard.writeText(username).then(() => {
//                     showToast('Username copied to clipboard!');
//                     // Auto-fill if inputs exist
//                     const usernameInput = document.querySelector('#username');
//                     const passwordInput = document.querySelector('#password');
//                     if (usernameInput && passwordInput) {
//                         usernameInput.value = username;
//                         passwordInput.value = password;
//                     }
//                 });
//             }
//         });
//     });

//     // Temperature unit conversion
//     const tempElements = document.querySelectorAll('.temperature-display, .hourly-card, .daily-card');
//     tempElements.forEach(element => {
//         element.addEventListener('click', function() {
//             const tempText = this.textContent;
//             if (tempText.includes('°C') || tempText.includes('°F')) {
//                 // Toggle between C and F display (visual effect only)
//                 this.style.transform = 'scale(1.05)';
//                 setTimeout(() => {
//                     this.style.transform = 'scale(1)';
//                 }, 200);
//             }
//         });
//     });

//     // Add weather icon animations
//     const weatherIcons = document.querySelectorAll('.weather-icon, .hourly-icon, .daily-icon');
//     weatherIcons.forEach(icon => {
//         icon.addEventListener('mouseenter', function() {
//             this.style.transform = 'scale(1.1) rotate(5deg)';
//         });
        
//         icon.addEventListener('mouseleave', function() {
//             this.style.transform = 'scale(1) rotate(0deg)';
//         });
//     });

//     // Add search suggestions based on recent searches
//     const searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
//     const cityInput = document.querySelector('#city');
//     if (cityInput && searchHistory.length > 0) {
//         cityInput.addEventListener('focus', function() {
//             const datalist = document.createElement('datalist');
//             datalist.id = 'searchHistory';
            
//             searchHistory.forEach(city => {
//                 const option = document.createElement('option');
//                 option.value = city;
//                 datalist.appendChild(option);
//             });
            
//             document.body.appendChild(datalist);
//             this.setAttribute('list', 'searchHistory');
//         });
//     }

//     // Save search history
//     const searchForm = document.querySelector('form');
//     if (searchForm) {
//         searchForm.addEventListener('submit', function() {
//             const cityInput = this.querySelector('#city');
//             if (cityInput && cityInput.value.trim()) {
//                 let history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
//                 const city = cityInput.value.trim();
                
//                 // Add to history if not already present
//                 if (!history.includes(city)) {
//                     history.unshift(city);
//                     // Keep only last 10 searches
//                     if (history.length > 10) {
//                         history = history.slice(0, 10);
//                     }
//                     localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
//                 }
//             }
//         });
//     }

//     // Add keyboard shortcuts
//     document.addEventListener('keydown', function(e) {
//         // Ctrl/Cmd + K to focus search
//         if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
//             e.preventDefault();
//             const searchInput = document.querySelector('#city');
//             if (searchInput) {
//                 searchInput.focus();
//             }
//         }
        
//         // Escape to clear search
//         if (e.key === 'Escape') {
//             const searchInput = document.querySelector('#city');
//             if (searchInput && document.activeElement === searchInput) {
//                 searchInput.value = '';
//                 searchInput.blur();
//             }
//         }
//     });

//     // Add dark mode toggle (optional feature)
//     const darkModeToggle = document.querySelector('#darkModeToggle');
//     if (darkModeToggle) {
//         darkModeToggle.addEventListener('click', function() {
//             document.body.classList.toggle('dark-mode');
//             localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
//         });
        
//         // Load saved dark mode preference
//         if (localStorage.getItem('darkMode') === 'true') {
//             document.body.classList.add('dark-mode');
//         }
//     }
// });

// // Utility functions
// function showToast(message, type = 'info') {
//     const toast = document.createElement('div');
//     toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
//     toast.style.top = '20px';
//     toast.style.right = '20px';
//     toast.style.zIndex = '9999';
//     toast.innerHTML = `
//         ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//     `;
    
//     document.body.appendChild(toast);
    
//     // Auto-remove after 3 seconds
//     setTimeout(() => {
//         toast.remove();
//     }, 3000);
// }

// function formatTime(timestamp) {
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// function formatDate(timestamp) {
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleDateString([], { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//     });
// }

// function celsiusToFahrenheit(celsius) {
//     return (celsius * 9/5) + 32;
// }

// function fahrenheitToCelsius(fahrenheit) {
//     return (fahrenheit - 32) * 5/9;
// }

// // Weather condition icons mapping
// const weatherIcons = {
//     'clear': 'fas fa-sun',
//     'clouds': 'fas fa-cloud',
//     'rain': 'fas fa-cloud-rain',
//     'snow': 'fas fa-snowflake',
//     'thunderstorm': 'fas fa-bolt',
//     'drizzle': 'fas fa-cloud-drizzle',
//     'mist': 'fas fa-smog'
// };

// // Export functions for potential use in other scripts
// window.WeatherApp = {
//     showToast,
//     formatTime,
//     formatDate,
//     celsiusToFahrenheit,
//     fahrenheitToCelsius,
//     weatherIcons
// };