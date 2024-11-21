const apiBaseUrl = 'http://localhost:8080/api/movies';
let allMovies = []; // Store all movies for filtering
let debounceTimer; // Timer for debouncing

// Load movies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    document.getElementById('search-bar').addEventListener('input', debounce(filterMovies, 300)); // Debounced search
    document.getElementById('clear-search').addEventListener('click', clearSearch); // Clear search button
});

function loadMovies() {
    document.getElementById('loading-spinner').style.display = 'block'; // Show loading spinner
    fetch(apiBaseUrl)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies; // Store all movies
            displayMovies(allMovies); // Display all movies
            document.getElementById('loading-spinner').style.display = 'none'; // Hide loading spinner
        })
        .catch(error => {
            console.error('Error loading movies:', error);
            document.getElementById('loading-spinner').style.display = 'none'; // Hide loading spinner
        });
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = `
            <div class="col-md-4 mb-4">
                <div class="card h-100" onclick="openMovieModal('${movie.id}')">
                    <img src="${movie.posterUrl}" class="card-img-top" alt="${movie.name}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.name}</h5>
                        <p class="card-text">${movie.description.substring(0, 100)}...</p>
                        <div class="review-rating">
                            ${getStarRating(movie.averageRating)}
                        </div>
                    </div>
                </div>
            </div>`;
        movieList.insertAdjacentHTML('beforeend', movieCard);
    });
}

function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function filterMovies() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredMovies = allMovies.filter(movie =>
        movie.name.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm)
    );
    displayMovies(filteredMovies);

    // Show or hide the clear button
    document.getElementById('clear-search').style.display = searchTerm ? 'block' : 'none';
}

function clearSearch() {
    document.getElementById('search-bar').value = '';
    displayMovies(allMovies); // Show all movies
    document.getElementById('clear-search').style.display = 'none'; // Hide clear button
}

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'star' : ''}"></i>`;
    }
    return stars;
}

function openMovieModal(movieId) {
    fetch(`${apiBaseUrl}/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            document.getElementById('movieModalLabel').textContent = movie.name;
            document.getElementById('movie-poster').src = movie.posterUrl;
            document.getElementById('movie-description').textContent = movie.description;

            // Load reviews
            const reviewList = document.getElementById('review-list');
            reviewList.innerHTML = '';
            movie.reviews.forEach(review => {
                const reviewItem = `
                    <li>
                        <strong>${review.reviewer}</strong> (${getStarRating(review.rating)}): ${review.reviewText}
                    </li>`;
                reviewList.insertAdjacentHTML('beforeend', reviewItem);
            });

            // Handle review submission
            document.getElementById('review-form').onsubmit = (event) => {
                event.preventDefault();
                submitReview(movieId);
            };

            $('#movieModal').modal('show');
        })
        .catch(error => console.error('Error loading movie:', error));
}

function submitReview(movieId) {
    const reviewer = document.getElementById('reviewer').value;
    const reviewText = document.getElementById('review-text').value;
    const reviewRating = document.getElementById('review-rating').value;

    fetch(`${apiBaseUrl}/${movieId}/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reviewer: reviewer,
            reviewText: reviewText,
            rating: parseInt(reviewRating)
        })
    })
    .then(response => response.json())
    .then(updatedMovie => {
        openMovieModal(movieId); // Reload the modal with the updated reviews
        document.getElementById('review-form').reset(); // Clear the form
    })
    .catch(error => console.error('Error submitting review:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');

    // Check local storage for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        lightIcon.classList.add('d-none');
        darkIcon.classList.remove('d-none');
    }

    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            lightIcon.classList.remove('d-none');
            darkIcon.classList.add('d-none');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            lightIcon.classList.add('d-none');
            darkIcon.classList.remove('d-none');
        }
    });
});