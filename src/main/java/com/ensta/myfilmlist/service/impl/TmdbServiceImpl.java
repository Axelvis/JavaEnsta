package com.ensta.myfilmlist.service.impl;

import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.service.TmdbService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TmdbServiceImpl implements TmdbService {
    
    private static final String TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTY5YWU2ZTY0OGYwNGFiMjNlMzFmNTM0ZjliNWY0NyIsIm5iZiI6MTc2NTUzODAxNC43MzgsInN1YiI6IjY5M2JmOGRlNmRlZTkzMGZhOGNiMDA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iRG_qZ3aUYTg9DVRr1mdqO0OVC8qbSaTeyPwwxFPsuk";
    private static final String TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
    private static final String TMDB_MOVIE_DETAILS_URL = "https://api.themoviedb.org/3/movie/";
    private static final String TMDB_CREDITS_URL = "/credits";
    private static final String TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public TmdbFilmData searchFilmByTitle(String titre) throws ServiceException {
        try {
            // 1. Rechercher le film par titre
            String searchUrl = TMDB_SEARCH_URL + "?query=" + titre + "&include_adult=false&language=fr-FR&page=1";
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("Authorization", "Bearer " + TMDB_API_TOKEN);
            headers.set("accept", "application/json");
            
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            org.springframework.http.ResponseEntity<String> searchResponse = restTemplate.exchange(
                searchUrl, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
            
            JsonNode searchResults = objectMapper.readTree(searchResponse.getBody());
            JsonNode results = searchResults.get("results");
            
            if (results == null || results.size() == 0) {
                throw new ServiceException("Film non trouvé dans TMDB: " + titre);
            }
            
            // Trouver le meilleur résultat en comparant les titres
            JsonNode movie = findBestMatch(results, titre);
            if (movie == null) {
                // Si aucune correspondance exacte, prendre le premier résultat
                movie = results.get(0);
            }
            int movieId = movie.get("id").asInt();
            
            // 2. Récupérer les détails du film
            String detailsUrl = TMDB_MOVIE_DETAILS_URL + movieId + "?language=fr-FR";
            org.springframework.http.ResponseEntity<String> detailsResponse = restTemplate.exchange(
                detailsUrl, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
            
            JsonNode movieDetails = objectMapper.readTree(detailsResponse.getBody());
            
            // 3. Récupérer les crédits (réalisateurs)
            String creditsUrl = TMDB_MOVIE_DETAILS_URL + movieId + TMDB_CREDITS_URL + "?language=fr-FR";
            org.springframework.http.ResponseEntity<String> creditsResponse = restTemplate.exchange(
                creditsUrl, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
            
            JsonNode credits = objectMapper.readTree(creditsResponse.getBody());
            
            // 4. Construire l'objet TmdbFilmData
            TmdbFilmData filmData = new TmdbFilmData();
            filmData.setTitre(movieDetails.get("title").asText());
            filmData.setDuree(movieDetails.has("runtime") ? movieDetails.get("runtime").asInt() : 0);
            
            // Date de sortie
            if (movieDetails.has("release_date") && !movieDetails.get("release_date").asText().isEmpty()) {
                filmData.setDateSortie(LocalDate.parse(movieDetails.get("release_date").asText()));
            }
            
            // URL du poster
            if (movieDetails.has("poster_path") && !movieDetails.get("poster_path").isNull()) {
                filmData.setPosterUrl(TMDB_IMAGE_BASE_URL + movieDetails.get("poster_path").asText());
            }
            
            // Synopsis
            if (movieDetails.has("overview") && !movieDetails.get("overview").isNull()) {
                filmData.setSynopsis(movieDetails.get("overview").asText());
            }
            
            // Watch providers
            filmData.setWatchProviders(getWatchProviders(movieId, headers));
            
            // Réalisateurs
            List<TmdbDirector> directors = new ArrayList<>();
            JsonNode crew = credits.get("crew");
            if (crew != null) {
                for (JsonNode member : crew) {
                    if ("Director".equals(member.get("job").asText())) {
                        TmdbDirector director = new TmdbDirector();
                        String fullName = member.get("name").asText();
                        String[] nameParts = fullName.split(" ", 2);
                        
                        if (nameParts.length == 2) {
                            director.setPrenom(nameParts[0]);
                            director.setNom(nameParts[1]);
                        } else {
                            director.setPrenom("");
                            director.setNom(fullName);
                        }
                        
                        // Récupérer la date de naissance du réalisateur
                        int personId = member.get("id").asInt();
                        director.setDateNaissance(getPersonBirthDate(personId, headers));
                        
                        directors.add(director);
                    }
                }
            }
            filmData.setDirectors(directors);
            
            return filmData;
            
        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la récupération des données TMDB pour le film: " + titre, e);
        }
    }
    
    private LocalDate getPersonBirthDate(int personId, org.springframework.http.HttpHeaders headers) {
        try {
            String personUrl = "https://api.themoviedb.org/3/person/" + personId + "?language=fr-FR";
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            org.springframework.http.ResponseEntity<String> response = restTemplate.exchange(
                personUrl, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
            
            JsonNode person = objectMapper.readTree(response.getBody());
            if (person.has("birthday") && !person.get("birthday").isNull()) {
                return LocalDate.parse(person.get("birthday").asText());
            }
        } catch (Exception e) {
            // Si on ne peut pas récupérer la date, on retourne null
        }
        return null;
    }
    
    private String getWatchProviders(int movieId, org.springframework.http.HttpHeaders headers) {
        try {
            String providersUrl = TMDB_MOVIE_DETAILS_URL + movieId + "/watch/providers";
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            org.springframework.http.ResponseEntity<String> response = restTemplate.exchange(
                providersUrl, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
            
            JsonNode providersData = objectMapper.readTree(response.getBody());
            JsonNode results = providersData.get("results");
            
            if (results == null || results.size() == 0) {
                return null;
            }
            
            // Récupérer les providers pour la France (FR)
            JsonNode frProviders = results.get("FR");
            if (frProviders == null) {
                return null;
            }
            
            StringBuilder providers = new StringBuilder();
            
            // Flatrate uniquement (streaming inclus dans abonnement - gratuit avec l'abonnement)
            if (frProviders.has("flatrate")) {
                JsonNode flatrate = frProviders.get("flatrate");
                for (JsonNode provider : flatrate) {
                    if (providers.length() > 0) providers.append(", ");
                    providers.append(provider.get("provider_name").asText());
                }
            }
            
            return providers.length() > 0 ? providers.toString() : null;
            
        } catch (Exception e) {
            // Si on ne peut pas récupérer les providers, on retourne null
            System.out.println("Erreur lors de la récupération des watch providers: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * Trouve le meilleur résultat correspondant au titre recherché.
     * Compare les titres en ignorant la casse et les caractères spéciaux.
     */
    private JsonNode findBestMatch(JsonNode results, String searchTitle) {
        String normalizedSearchTitle = normalizeTitle(searchTitle);
        
        // 1. Chercher une correspondance exacte avec le titre (title)
        for (JsonNode result : results) {
            String title = result.has("title") ? result.get("title").asText() : "";
            if (normalizeTitle(title).equals(normalizedSearchTitle)) {
                return result;
            }
        }
        
        // 2. Chercher une correspondance exacte avec le titre original (original_title)
        for (JsonNode result : results) {
            String originalTitle = result.has("original_title") ? result.get("original_title").asText() : "";
            if (normalizeTitle(originalTitle).equals(normalizedSearchTitle)) {
                return result;
            }
        }
        
        // 3. Chercher une correspondance partielle (le titre recherché est contenu dans le résultat)
        for (JsonNode result : results) {
            String title = result.has("title") ? result.get("title").asText() : "";
            String originalTitle = result.has("original_title") ? result.get("original_title").asText() : "";
            
            if (normalizeTitle(title).contains(normalizedSearchTitle) || 
                normalizeTitle(originalTitle).contains(normalizedSearchTitle)) {
                return result;
            }
        }
        
        // Si aucune correspondance, retourner null (le premier résultat sera utilisé)
        return null;
    }
    
    /**
     * Normalise un titre pour la comparaison en :
     * - Convertissant en minuscules
     * - Supprimant les accents
     * - Supprimant les caractères spéciaux (sauf espaces)
     */
    private String normalizeTitle(String title) {
        if (title == null) return "";
        
        // Convertir en minuscules
        String normalized = title.toLowerCase();
        
        // Remplacer les caractères accentués
        normalized = normalized.replaceAll("[àáâãäå]", "a")
                               .replaceAll("[èéêë]", "e")
                               .replaceAll("[ìíîï]", "i")
                               .replaceAll("[òóôõö]", "o")
                               .replaceAll("[ùúûü]", "u")
                               .replaceAll("[ýÿ]", "y")
                               .replaceAll("[ç]", "c")
                               .replaceAll("[ñ]", "n");
        
        // Supprimer les caractères spéciaux (garder lettres, chiffres et espaces)
        normalized = normalized.replaceAll("[^a-z0-9\\s]", "");
        
        // Supprimer les espaces multiples et trim
        normalized = normalized.replaceAll("\\s+", " ").trim();
        
        return normalized;
    }
}
