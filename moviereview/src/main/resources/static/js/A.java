const apiBaseUrl = 'http://localhost:8080/api/movies';

// Search functionality
document.getElementById('searchBar').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const movieCards = document.querySelectorAll('#movie-list .card');
    movieCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        card.style.display = title.includes(query) ? '' : 'none';
    });
});

// Load movies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    loadFeaturedMovies();
});

function loadMovies() {
    fetch(apiBaseUrl)
        .then(response => response.json())
        .then(movies => {
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
                            </div>
                        </div>
                    </div>`;
                movieList.insertAdjacentHTML('beforeend', movieCard);
            });
        })
        .catch(error => console.error('Error loading movies:', error));
}

function openMovieModal(movieId) {
    fetch(`${apiBaseUrl}/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            document.getElementById('movieModalLabel').textContent = movie.name;
            document.getElementById('movie-poster').src = movie.posterUrl;
            document.getElementById('movie-description').textContent = movie.description;

            const reviewList = document.getElementById('review-list');
            reviewList.innerHTML = '';
            movie.reviews.forEach(review => {
                const reviewItem = `
                    <li>
                        <strong>${review.reviewer}</strong> (${review.rating}/5): ${review.reviewText}
                    </li>`;
                reviewList.insertAdjacentHTML('beforeend', reviewItem);
            });

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
        openMovieModal(movieId);
        document.getElementById('review-form').reset();
    })
    .catch(error => console.error('Error submitting review:', error));
}

// Back to Top Button functionality
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Featured Movies Carousel
function loadFeaturedMovies() {
    fetch(apiBaseUrl)
        .then(response => response.json())
        .then(movies => {
            const carouselInner = document.querySelector('#featuredCarousel .carousel-inner');
            carouselInner.innerHTML = '';
            movies.slice(0, 5).forEach((movie, index) => {
                const carouselItem = `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${movie.posterUrl}" class="d-block w-100" alt="${movie.name}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>${movie.name}</h5>
                            <p>${movie.description.substring(0, 100)}...</p>
                        </div>
                    </div>
                `;
                carouselInner.insertAdjacentHTML('beforeend', carouselItem);
            });
        })
        .catch(error => console.error('Error loading featured movies:', error));
}
