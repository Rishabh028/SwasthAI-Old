// Property data
const properties = [
    {
        id: 1,
        title: "Luxury Apartment in Kolkata",
        price: 13549,
        basePrice: 6775,
        nights: 1,
        rating: 4.59,
        reviews: 1628,
        image: "images/property1.jpg",
        images: [
            "images/property1.jpg",
            "images/property1-1.jpg",
            "images/property1-2.jpg",
            "images/property1-3.jpg",
            "images/property1-4.jpg"
        ],
        isFavorite: true,
        type: "Ratings",
        location: "Park Street Area, Kolkata",
        description: "This stylish apartment in the heart of Kolkata offers modern amenities and breathtaking city views. Perfect for couples or small families looking to explore the cultural capital of India.",
        host: "Amit",
        hostSince: "2018",
        lat: 22.5515,
        lng: 88.3544,
        amenities: ["Wifi", "Air conditioning", "Kitchen", "Washer", "Elevator", "TV", "Essentials"],
        bedrooms: 2,
        beds: 3,
        baths: 2,
        maxGuests: 4,
        cleaningFee: 500,
        serviceFee: 812
    },
    {
        id: 2,
        title: "Modern Flat in New Town",
        price: 11549,
        basePrice: 8739,
        nights: 1,
        rating: 4.72,
        reviews: 874,
        image: "images/property2.jpg",
        images: [
            "images/property2.jpg",
            "images/property2-1.jpg",
            "images/property2-2.jpg",
            "images/property2-3.jpg",
            "images/property2-4.jpg"
        ],
        isFavorite: false,
        type: "Ratings",
        location: "New Town, Kolkata",
        description: "Contemporary flat with all modern conveniences in the developing New Town area. Close to business districts and shopping centers.",
        host: "Manoj",
        hostSince: "2013",
        lat: 22.5815,
        lng: 88.4544,
        amenities: ["Wifi", "Air conditioning", "Kitchen", "Washer", "Elevator", "TV", "Essentials"],
        bedrooms: 2,
        beds: 3,
        baths: 2,
        maxGuests: 4,
        cleaningFee: 500,
        serviceFee: 812
    },
    {
        id: 3,
        title: "Heritage Home in North Kolkata",
        price: 17549,
        basePrice: 8793,
        nights: 1,
        rating: 4.59,
        reviews: 1833,
        image: "images/property3.jpg",
        images: [
            "images/property3.jpg",
            "images/property3-1.jpg",
            "images/property3-2.jpg",
            "images/property3-3.jpg",
            "images/property3-4.jpg"
        ],
        isFavorite: true,
        type: "Ratings",
        location: "North Kolkata",
        description: "Experience traditional Bengali culture in this beautifully restored heritage home. Features antique furniture and modern amenities.",
        host: "Hardik",
        hostSince: "2020",
        lat: 22.5915,
        lng: 88.3644,
        amenities: ["Wifi", "Air conditioning", "Kitchen", "Washer", "TV", "Essentials"],
        bedrooms: 3,
        beds: 4,
        baths: 2,
        maxGuests: 6,
        cleaningFee: 700,
        serviceFee: 1052
    },
    {
        id: 4,
        title: "Riverside Villa in Barrackpore",
        price: 13854,
        basePrice: 6432,
        nights: 2,
        rating: 4.73,
        reviews: 568,
        image: "images/property4.jpg",
        images: [
            "images/property4.jpg",
            "images/property4-1.jpg",
            "images/property4-2.jpg",
            "images/property4-3.jpg",
            "images/property4-4.jpg"
        ],
        isFavorite: false,
        type: "Ratings",
        location: "Barrackpore",
        description: "Beautiful villa with private garden and river view. Perfect for those seeking peace and tranquility away from the city hustle.",
        host: "Zaid",
        hostSince: "2016",
        lat: 22.7615,
        lng: 88.3644,
        amenities: ["Wifi", "Air conditioning", "Kitchen", "Washer", "Private pool", "Garden", "TV"],
        bedrooms: 4,
        beds: 5,
        baths: 3,
        maxGuests: 8,
        cleaningFee: 1000,
        serviceFee: 1200
    },
    {
        id: 5,
        title: "Cozy Studio in Salt Lake",
        price: 13998,
        basePrice: 6775,
        nights: 1,
        rating: 4.55,
        reviews: 754,
        image: "images/property5.jpg",
        images: [
            "images/property5.jpg",
            "images/property5-1.jpg",
            "images/property5-2.jpg",
            "images/property5-3.jpg",
            "images/property5-4.jpg"
        ],
        isFavorite: true,
        type: "Ratings",
        location: "Salt Lake City",
        description: "Compact and efficient studio apartment in the well-planned Salt Lake area. Ideal for solo travelers or couples.",
        host: "Amit",
        hostSince: "2018",
        lat: 22.5815,
        lng: 88.4144,
        amenities: ["Wifi", "Air conditioning", "Kitchenette", "TV", "Essentials"],
        bedrooms: 1,
        beds: 1,
        baths: 1,
        maxGuests: 2,
        cleaningFee: 300,
        serviceFee: 600
    },
    {
        id: 6,
        title: "Luxury Penthouse in Howrah",
        price: 14849,
        basePrice: 7389,
        nights: 1,
        rating: 4.73,
        reviews: 1262,
        image: "images/property6.jpg",
        images: [
            "images/property6.jpg",
            "images/property6-1.jpg",
            "images/property6-2.jpg",
            "images/property6-3.jpg",
            "images/property6-4.jpg"
        ],
        isFavorite: false,
        type: "Ratings",
        location: "Howrah",
        description: "Stunning penthouse with panoramic views of the Hooghly River. Features modern decor and high-end appliances.",
        host: "Aman",
        hostSince: "2020",
        lat: 22.5715,
        lng: 88.3244,
        amenities: ["Wifi", "Air conditioning", "Kitchen", "Washer", "Elevator", "TV", "Essentials", "Balcony"],
        bedrooms: 3,
        beds: 3,
        baths: 2,
        maxGuests: 6,
        cleaningFee: 800,
        serviceFee: 1100
    },
    {
        id: 7,
        title: "Business Apartment near Airport",
        price: 15549,
        basePrice: 7855,
        nights: 1,
        rating: 4.73,
        reviews: 748,
        image: "images/property7.jpg",
        images: [
            "images/property7.jpg",
            "images/property7-1.jpg",
            "images/property7-2.jpg",
            "images/property7-3.jpg",
            "images/property7-4.jpg"
        ],
        isFavorite: false,
        type: "Ratings",
        location: "Near Airport",
        description: "Conveniently located apartment perfect for business travelers. Just 10 minutes from the airport with fast wifi and workspace.",
        host: "Ramesh",
        hostSince: "2017",
        lat: 22.6515,
        lng: 88.4344,
        amenities: ["Wifi", "Air conditioning", "Kitchen", "Washer", "Elevator", "TV", "Workspace"],
        bedrooms: 2,
        beds: 2,
        baths: 2,
        maxGuests: 4,
        cleaningFee: 500,
        serviceFee: 900
    },
    {
        id: 8,
        title: "Family Home in Rajarhat",
        price: 17549,
        basePrice: 6775,
        nights: 2,
        rating: 4.59,
        reviews: 128,
        image: "images/property8.jpg",
        images: [
            "images/property8.jpg",
            "images/property8-1.jpg",
            "images/property8-2.jpg",
            "images/property8-3.jpg",
            "images/property8-4.jpg"
        ],
        isFavorite: true,
        type: "Ratings",
        location: "Rajarhat",
        description: "Spacious family home in the developing Rajarhat area. Features large living spaces and outdoor area for kids to play.",
        host: "Ajith",
        hostSince: "2019",
        lat: 22.6115,
        lng: 88.4844,
        amenities: ["Wifi", "Air conditioning", "Kitchen", "Washer", "TV", "Garden", "Parking"],
        bedrooms: 3,
        beds: 4,
        baths: 2,
        maxGuests: 6,
        cleaningFee: 600,
        serviceFee: 950
    }
];

// User data and auth state
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: 1,
        name: "Rishabh Rajak",
        email: "royalxtx2022@gmail.com",
        password: "rishabh@28",
        bookings: []
    }
];

// Search locations
const locations = ["Kolkata", "New Town", "Salt Lake", "Howrah", "Barrackpore", "Rajarhat", "North 24 Parganas", "Anywhere"];

// DOM Elements
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const propertyModal = document.getElementById('property-modal');
const userMenu = document.getElementById('user-menu');
const searchBtn = document.querySelector('.search-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Initialize the app
function init() {
    renderProperties();
    updateAuthUI();
    setupEventListeners();
    setupSearchSuggestions();
    setupDarkMode();
}

// Render property listings
function renderProperties(filteredProperties = properties) {
    const container = document.getElementById('properties-container');
    
    if (filteredProperties.length === 0) {
        container.innerHTML = `
            <div class="no-results animate__animated animate__fadeIn">
                <h3>No properties found</h3>
                <p>Try adjusting your search filters</p>
                <button onclick="resetSearch()" class="auth-submit-btn">Reset Search</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProperties.map(property => `
        <div class="property-card">
            <div class="property-image-container">
                <img src="${property.image}" alt="${property.title}" class="property-image">
                ${property.isFavorite ? '<div class="property-badge">Guest favourite</div>' : ''}
                <button class="wishlist-btn ${property.isFavorite ? 'active' : ''}" data-id="${property.id}">
                    <i class="${property.isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <h3 class="property-title">${property.title}</h3>
            <p class="property-location">📍 ${property.location}</p>
            <p class="property-price">₹${property.price.toLocaleString()} for ${property.nights} night${property.nights > 1 ? 's' : ''}</p>
            <div class="property-rating">
                <i class="fas fa-star"></i>
                <span>${property.rating}</span>
                <span>(${property.reviews.toLocaleString()})</span>
                <span class="property-type">${property.type}</span>
            </div>
        </div>
    `).join('');

    // Add event listeners to property cards and wishlist buttons
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.wishlist-btn')) {
                const id = parseInt(card.querySelector('.wishlist-btn').dataset.id);
                showPropertyDetail(id);
            }
        });
    });

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });
}

// Toggle favorite status
function toggleFavorite(e) {
    e.stopPropagation();
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    const id = parseInt(e.currentTarget.dataset.id);
    const property = properties.find(p => p.id === id);
    property.isFavorite = !property.isFavorite;
    
    const icon = e.currentTarget.querySelector('i');
    icon.className = property.isFavorite ? 'fas fa-heart' : 'far fa-heart';
    e.currentTarget.classList.toggle('active');
    
    // Animate heart
    icon.classList.add('animate__animated', 'animate__heartBeat');
    setTimeout(() => {
        icon.classList.remove('animate__animated', 'animate__heartBeat');
    }, 1000);
}

// Show property detail modal
function showPropertyDetail(id) {
    const property = properties.find(p => p.id === id);
    const propertyDetailContent = document.getElementById('property-detail-content');
    
    propertyDetailContent.innerHTML = `
        <div class="property-detail">
            <div class="property-detail-header">
                <div>
                    <h1 class="property-detail-title">${property.title}</h1>
                    <div class="property-detail-meta">
                        <span><i class="fas fa-star"></i> ${property.rating} (${property.reviews.toLocaleString()} reviews)</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${property.location}</span>
                        <span><i class="fas fa-home"></i> ${property.type}</span>
                        <span><i class="fas fa-user-friends"></i> Up to ${property.maxGuests} guests</span>
                        <span><i class="fas fa-bed"></i> ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}</span>
                        <span><i class="fas fa-bath"></i> ${property.baths} bath${property.baths > 1 ? 's' : ''}</span>
                    </div>
                </div>
                <button class="wishlist-btn ${property.isFavorite ? 'active' : ''}" data-id="${property.id}">
                    <i class="${property.isFavorite ? 'fas' : 'far'} fa-heart"></i> Save
                </button>
            </div>
            
            <div class="property-detail-gallery">
                ${property.images.map((img, index) => `
                    <img src="${img}" alt="${property.title} ${index + 1}" 
                         class="${index === 0 ? 'main-image' : ''}">
                `).join('')}
            </div>
            
            <div class="property-detail-grid">
                <div class="property-detail-main">
                    <div class="property-detail-section">
                        <h3>About this place</h3>
                        <p>${property.description}</p>
                        <p>Hosted by ${property.host} since ${property.hostSince}</p>
                    </div>
                    
                    <div class="property-detail-section">
                        <h3>Amenities</h3>
                        <div class="property-amenities">
                            ${property.amenities.map(amenity => `
                                <div class="amenity-item">
                                    <i class="fas fa-check"></i>
                                    <span>${amenity}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="property-detail-section">
                        <h3>Location</h3>
                        <div class="map-container" id="property-map"></div>
                    </div>
                </div>
                
                <div class="booking-widget">
                    <div class="price-per-night">₹${property.basePrice.toLocaleString()} <span>night</span></div>
                    
                    <div class="date-picker-container">
                        <div class="date-picker-header">
                            <div>CHECK-IN</div>
                            <div>CHECK-OUT</div>
                        </div>
                        <div class="date-picker-calendars">
                            <div class="calendar">
                                <input type="date" id="checkin-date">
                            </div>
                            <div class="calendar">
                                <input type="date" id="checkout-date">
                            </div>
                        </div>
                    </div>
                    
                    <div class="price-breakdown">
                        <div class="price-row">
                            <span>₹${property.basePrice.toLocaleString()} x ${property.nights} night${property.nights > 1 ? 's' : ''}</span>
                            <span>₹${(property.basePrice * property.nights).toLocaleString()}</span>
                        </div>
                        <div class="price-row">
                            <span>Cleaning fee</span>
                            <span>₹${property.cleaningFee.toLocaleString()}</span>
                        </div>
                        <div class="price-row">
                            <span>Service fee</span>
                            <span>₹${property.serviceFee.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="price-total">
                        <div class="price-row">
                            <span>Total</span>
                            <span>₹${property.price.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <button class="book-now-btn" onclick="handleBooking(${property.id})">
                        Reserve
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Initialize map
    initMap(property.lat, property.lng);
    
    // Setup date picker
    initDatePicker();
    
    // Show modal
    propertyModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add event listener to close button
    document.querySelector('.close-modal').addEventListener('click', closePropertyModal);
    
    // Add event listener to wishlist button
    document.querySelector('.property-detail .wishlist-btn').addEventListener('click', toggleFavorite);
}

// Initialize map
function initMap(lat, lng, mapId = 'property-map') {
    // Check if map container exists
    const mapContainer = document.getElementById(mapId);
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    // Clear any existing map
    mapContainer.innerHTML = '';
    
    const map = L.map(mapId).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Property Location');
}

// Initialize date picker
function initDatePicker() {
    // This would be replaced with a proper date picker library in production
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    document.getElementById('checkin-date').valueAsDate = today;
    document.getElementById('checkout-date').valueAsDate = tomorrow;
}

// Close property modal
function closePropertyModal() {
    propertyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle booking
function handleBooking(propertyId) {
    if (!currentUser) {
        closePropertyModal();
        showAuthModal('login');
        return;
    }
    
    const checkin = document.getElementById('checkin-date').value;
    const checkout = document.getElementById('checkout-date').value;
    
    if (!checkin || !checkout) {
        alert('Please select check-in and check-out dates');
        return;
    }
    
    const property = properties.find(p => p.id === propertyId);
    const booking = {
        propertyId,
        propertyTitle: property.title,
        propertyImage: property.image,
        checkin,
        checkout,
        totalPrice: property.price,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Add booking to user
    currentUser.bookings = currentUser.bookings || [];
    currentUser.bookings.push(booking);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    closePropertyModal();
    alert(`Booking confirmed for ${property.title} from ${checkin} to ${checkout}`);
}

// Show auth modal
function showAuthModal(tab = 'login') {
    // Set active tab
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
    
    // Set active form
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(`${tab}-form`).classList.add('active');
    
    // Show modal
    authModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listener to close button
    document.querySelector('.close-auth').addEventListener('click', closeAuthModal);
}

// Close auth modal
function closeAuthModal() {
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    clearAuthErrors();
}

// Clear auth form errors
function clearAuthErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// Update auth UI based on login state
function updateAuthUI() {
    if (currentUser) {
        userMenu.innerHTML = `
            <div class="user-dropdown">
                <div class="user-greeting">
                    <i class="fas fa-user-circle"></i>
                    <span>Hi, ${currentUser.name.split(' ')[0]}!</span>
                </div>
                <div class="dropdown-menu">
                    <a href="#" onclick="showUserBookings()">My Bookings</a>
                    <a href="#" onclick="logout()">Logout</a>
                </div>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <button class="host-btn">Become a Host</button>
            <button class="login-btn" onclick="showAuthModal('login')">Login</button>
        `;
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    clearAuthErrors();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email) {
        document.getElementById('login-email-error').textContent = 'Email is required';
        return;
    }
    
    if (!password) {
        document.getElementById('login-password-error').textContent = 'Password is required';
        return;
    }
    
    const loginBtn = e.target.querySelector('button[type="submit"]');
    loginBtn.classList.add('btn-loading');
    loginBtn.disabled = true;
    setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {...user};
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            loginBtn.classList.remove('btn-loading');
            loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            
            setTimeout(() => {
                closeAuthModal();
                updateAuthUI();
                renderProperties();
            }, 800);
        } else {
            loginBtn.classList.remove('btn-loading');
            loginBtn.disabled = false;
            document.getElementById('login-password-error').textContent = 'Invalid email or password';
        }
    }, 1000);
}
function handleRegister(e) {
    e.preventDefault();
    clearAuthErrors();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    let isValid = true;

    if (!name) {
        document.getElementById('register-name-error').textContent = 'Name is required';
        isValid = false;
    }

    if (!email) {
        document.getElementById('register-email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        document.getElementById('register-email-error').textContent = 'Invalid email format';
        isValid = false;
    }

    if (!password) {
        document.getElementById('register-password-error').textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('register-password-error').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }

    if (password !== confirm) {
        document.getElementById('register-confirm-error').textContent = 'Passwords do not match';
        isValid = false;
    }

    if (!isValid) return;

    if (users.some(u => u.email === email)) {
        document.getElementById('register-email-error').textContent = 'Email already registered';
        return;
    }

    const registerBtn = e.target.querySelector('button[type="submit"]');
    registerBtn.classList.add('btn-loading');
    registerBtn.disabled = true;

    setTimeout(() => {
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            bookings: []
        };
        
        users.push(newUser);
        currentUser = newUser;
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        registerBtn.classList.remove('btn-loading');
        registerBtn.innerHTML = '<i class="fas fa-check"></i> Registered!';
        
        setTimeout(() => {
            closeAuthModal();
            updateAuthUI();
            renderProperties();
        }, 1000);
    }, 1500);
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    renderProperties();
}

// Show user bookings
function showUserBookings() {
    if (!currentUser || !currentUser.bookings || currentUser.bookings.length === 0) {
        alert('You have no bookings yet!');
        return;
    }
    
    const container = document.getElementById('properties-container');
    container.innerHTML = `
        <div class="bookings-container animate__animated animate__fadeIn">
            <h2>Your Bookings</h2>
            <div class="bookings-list">
                ${currentUser.bookings.map(booking => `
                    <div class="booking-card">
                        <img src="${booking.propertyImage}" alt="${booking.propertyTitle}">
                        <div class="booking-info">
                            <h3>${booking.propertyTitle}</h3>
                            <p>${booking.checkin} to ${booking.checkout}</p>
                            <p>Total: ₹${booking.totalPrice.toLocaleString()}</p>
                            <p>Status: <span class="status-${booking.status}">${booking.status}</span></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Search functionality
function handleSearch() {
    const location = document.getElementById('location-search').textContent;
    const dates = document.getElementById('date-search').textContent;
    const guests = document.getElementById('guests-search').textContent;
    
    let results = properties;
    
    // Location filter
    if (location !== 'Anywhere') {
        results = results.filter(p => 
            p.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Guest filter
    if (guests !== 'Add guests') {
        const guestCount = parseInt(guests) || 1;
        results = results.filter(p => p.maxGuests >= guestCount);
    }
    
    renderProperties(results);
    document.getElementById('results-title').textContent = results.length > 0 
        ? 'Search Results' 
        : 'No properties found';
    document.getElementById('search-results-info').textContent = results.length > 0
        ? `${results.length} properties found`
        : 'Try different search criteria';
}

// Reset search
function resetSearch() {
    document.getElementById('location-search').textContent = 'Anywhere';
    document.getElementById('date-search').textContent = 'Any week';
    document.getElementById('guests-search').textContent = 'Add guests';
    renderProperties();
    document.getElementById('results-title').textContent = 'Popular homes in North 24 Parganas';
    document.getElementById('search-results-info').textContent = '';
}

// Setup search suggestions
function setupSearchSuggestions() {
    const locationSearch = document.getElementById('location-search');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    locationSearch.parentNode.appendChild(suggestionsContainer);
    
    locationSearch.addEventListener('click', () => {
        suggestionsContainer.innerHTML = locations.map(loc => `
            <div class="search-suggestion">${loc}</div>
        `).join('');
        suggestionsContainer.style.display = 'block';
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-option-container')) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    suggestionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('search-suggestion')) {
            locationSearch.textContent = e.target.textContent;
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Setup dark mode
function setupDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state
    if (localStorage.getItem('darkMode') === 'true' || 
        (localStorage.getItem('darkMode') === null && prefersDark)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Toggle handler
    darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', e.target.checked);
    });
}

// Setup event listeners
// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Auth forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Search
    searchBtn.addEventListener('click', handleSearch);
    
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            showAuthModal(tabName);
        });
    });
    // Airbnb-style animated search bar active state
const searchBar = document.getElementById('search-bar');
const searchOptions = document.querySelectorAll('.search-option');
searchOptions.forEach(option => {
    option.addEventListener('focus', () => {
        searchBar.classList.add('active');
        option.classList.add('active');
    });
    option.addEventListener('blur', () => {
        option.classList.remove('active');
        // Remove bar active if nothing focused (timeout for dropdown click)
        setTimeout(() => {
            if (![...searchOptions].some(opt => opt === document.activeElement)) {
                searchBar.classList.remove('active');
            }
        }, 120);
    });
    option.addEventListener('mouseenter', () => {
        option.classList.add('active');
        searchBar.classList.add('active');
    });
    option.addEventListener('mouseleave', () => {
        option.classList.remove('active');
        // Remove bar active if not focused
        if (![...searchOptions].some(opt => opt === document.activeElement)) {
            searchBar.classList.remove('active');
        }
    });
});
document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target)) {
        searchBar.classList.remove('active');
        searchOptions.forEach(opt => opt.classList.remove('active'));
    }
});
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
        if (e.target === propertyModal) closePropertyModal();
    });
    
    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAuthModal();
            closePropertyModal();
        }
    });
}

// Setup date and guests overlays
function setupDateAndGuestsOverlays() {
    // Elements
    const dateSearch = document.getElementById('date-search');
    const dateSearchOut = document.getElementById('date-search-out');
    const datePickerOverlay = document.getElementById('date-picker-overlay');
    const closeDatePicker = document.getElementById('close-date-picker');
    const checkinValue = document.getElementById('checkin-value');
    const checkoutValue = document.getElementById('checkout-value');
    const datePickerCalendars = document.getElementById('date-picker-calendars');

    const guestsSearch = document.getElementById('guests-search');
    const guestsOverlay = document.getElementById('guests-overlay');
    const closeGuestsPicker = document.getElementById('close-guests-picker');
    const guestsValue = document.getElementById('guests-value');
    const guestsDoneBtn = document.getElementById('guests-done-btn');

    // Guests state
    let guests = { adults: 1, children: 0, infants: 0 };

    // Date state
    let checkIn = null, checkOut = null;

    // --- Date Picker Logic ---
    function renderCalendars() {
        // Show two months: current and next
        const today = new Date();
        const months = [
            { year: today.getFullYear(), month: today.getMonth() },
            { year: today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(), month: (today.getMonth() + 1) % 12 }
        ];
        datePickerCalendars.innerHTML = months.map(m => calendarHTML(m.year, m.month)).join('');
        // Add click handlers
        datePickerCalendars.querySelectorAll('td[data-date]').forEach(td => {
            td.addEventListener('click', () => {
                const date = new Date(td.dataset.date);
                if (!checkIn || (checkIn && checkOut)) {
                    checkIn = date;
                    checkOut = null;
                } else if (date > checkIn) {
                    checkOut = date;
                } else {
                    checkIn = date;
                    checkOut = null;
                }
                updateDateSelection();
                renderCalendars();
            });
        });
    }
    function calendarHTML(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        let html = `<div class="calendar"><div style="text-align:center;font-weight:600;margin-bottom:4px;">${firstDay.toLocaleString('default', { month: 'long' })} ${year}</div><table><thead><tr>`;
        ['S','M','T','W','T','F','S'].forEach(d => html += `<th>${d}</th>`);
        html += '</tr></thead><tbody><tr>';
        for (let i = 0; i < firstDay.getDay(); i++) html += '<td></td>';
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(year, month, d);
            let cls = '';
            if (checkIn && date.toDateString() === checkIn.toDateString()) cls = 'selected';
            else if (checkIn && checkOut && date > checkIn && date < checkOut) cls = 'in-range';
            else if (checkOut && date.toDateString() === checkOut.toDateString()) cls = 'selected';
            if (date < new Date(new Date().setHours(0,0,0,0))) cls += ' disabled';
            html += `<td data-date="${date.toISOString()}" class="${cls.trim()}">${d}</td>`;
            if ((date.getDay() + 1) % 7 === 0) html += '</tr><tr>';
        }
        html += '</tr></tbody></table></div>';
        return html;
    }
    function updateDateSelection() {
        checkinValue.textContent = checkIn ? checkIn.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Add dates';
        checkoutValue.textContent = checkOut ? checkOut.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Add dates';
    }

    // Show/hide overlay
    function showDatePicker() {
        datePickerOverlay.style.display = 'block';
        renderCalendars();
    }
    function hideDatePicker() {
        datePickerOverlay.style.display = 'none';
    }
    dateSearch.addEventListener('click', showDatePicker);
    dateSearchOut.addEventListener('click', showDatePicker);
    closeDatePicker.addEventListener('click', hideDatePicker);
    document.addEventListener('mousedown', (e) => {
        if (
            datePickerOverlay.style.display === 'block' &&
            !datePickerOverlay.contains(e.target) &&
            !dateSearch.contains(e.target) &&
            !dateSearchOut.contains(e.target)
        ) {
            hideDatePicker();
        }
    });

    // --- Guests Picker Logic ---
    function updateGuestsValue() {
        let total = guests.adults + guests.children;
        let txt = total + ' guest' + (total > 1 ? 's' : '');
        if (guests.infants > 0) txt += `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}`;
        guestsValue.textContent = total === 0 ? 'Add guests' : txt;
    }
    function showGuestsOverlay() {
        guestsOverlay.style.display = 'block';
    }
    function hideGuestsOverlay() {
        guestsOverlay.style.display = 'none';
    }
    guestsSearch.addEventListener('click', showGuestsOverlay);
    closeGuestsPicker.addEventListener('click', hideGuestsOverlay);
    guestsDoneBtn.addEventListener('click', hideGuestsOverlay);
    document.addEventListener('mousedown', (e) => {
        if (
            guestsOverlay.style.display === 'block' &&
            !guestsOverlay.contains(e.target) &&
            !guestsSearch.contains(e.target)
        ) {
            hideGuestsOverlay();
        }
    });

    // Guests controls
    function updateGuestsBtns() {
        document.getElementById('adults-minus').disabled = guests.adults <= 1;
        document.getElementById('children-minus').disabled = guests.children <= 0;
        document.getElementById('infants-minus').disabled = guests.infants <= 0;
        document.getElementById('adults-count').textContent = guests.adults;
        document.getElementById('children-count').textContent = guests.children;
        document.getElementById('infants-count').textContent = guests.infants;
    }
    document.getElementById('adults-plus').onclick = () => { guests.adults++; updateGuestsBtns(); updateGuestsValue(); };
    document.getElementById('adults-minus').onclick = () => { if (guests.adults > 1) guests.adults--; updateGuestsBtns(); updateGuestsValue(); };
    document.getElementById('children-plus').onclick = () => { guests.children++; updateGuestsBtns(); updateGuestsValue(); };
    document.getElementById('children-minus').onclick = () => { if (guests.children > 0) guests.children--; updateGuestsBtns(); updateGuestsValue(); };
    document.getElementById('infants-plus').onclick = () => { guests.infants++; updateGuestsBtns(); updateGuestsValue(); };
    document.getElementById('infants-minus').onclick = () => { if (guests.infants > 0) guests.infants--; updateGuestsBtns(); updateGuestsValue(); };

    // Initial
    updateGuestsBtns();
    updateGuestsValue();
    updateDateSelection();
}

// Setup footer modals
function setupFooterModals() {
    // Language modal
    const languageBtn = document.getElementById('language-btn');
    const languageModal = document.getElementById('language-modal');
    const closeLanguageModal = document.getElementById('close-language-modal');
    languageBtn.onclick = () => languageModal.style.display = 'flex';
    closeLanguageModal.onclick = () => languageModal.style.display = 'none';

    // Currency modal
    const currencyBtn = document.getElementById('currency-btn');
    const currencyModal = document.getElementById('currency-modal');
    const closeCurrencyModal = document.getElementById('close-currency-modal');
    currencyBtn.onclick = () => currencyModal.style.display = 'flex';
    closeCurrencyModal.onclick = () => currencyModal.style.display = 'none';

    // Close modals on outside click
    window.addEventListener('mousedown', function(e) {
        if (languageModal.style.display === 'flex' && !languageModal.querySelector('.custom-modal-content').contains(e.target) && e.target !== languageBtn) {
            languageModal.style.display = 'none';
        }
        if (currencyModal.style.display === 'flex' && !currencyModal.querySelector('.custom-modal-content').contains(e.target) && e.target !== currencyBtn) {
            currencyModal.style.display = 'none';
        }
    });

    // Option selection (visual only)
    document.querySelectorAll('#language-modal .modal-option').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('#language-modal .modal-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            languageBtn.innerHTML = `<i class="fas fa-globe"></i> ${this.textContent.trim()}`;
            languageModal.style.display = 'none';
        };
    });
    document.querySelectorAll('#currency-modal .modal-option').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('#currency-modal .modal-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            const main = this.childNodes[0].nodeValue.trim();
            const sub = this.querySelector('.option-sub')?.textContent || '';
            currencyBtn.innerHTML = `${sub.split('–')[1]?.trim() || '₹'} ${main}`;
            currencyModal.style.display = 'none';
        };
    });
}

// ========== INITIALIZE APP ==========
document.addEventListener('DOMContentLoaded', () => {
    if (typeof init === 'function') init();
    if (typeof setupAirbnbSearchBar === 'function') setupAirbnbSearchBar();
    if (typeof setupDateAndGuestsOverlays === 'function') setupDateAndGuestsOverlays();
    setupFooterModals();
});