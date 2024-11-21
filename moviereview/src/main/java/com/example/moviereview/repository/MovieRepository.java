package com.example.moviereview.repository;

import com.example.moviereview.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface MovieRepository extends MongoRepository<Movie, String> {
    Optional<Movie> findByName(String name);
}
