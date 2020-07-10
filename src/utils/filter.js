import {FilterType} from "./const";

export const getWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.isInWatchlist);
};

export const getHistoryMovies = (movies) => {
  return movies.filter((movie) => movie.isInHistory);
};

export const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.isInFavorites);
};

export const getMoviesByFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return getWatchlistMovies(movies);
    case FilterType.HISTORY:
      return getHistoryMovies(movies);
    case FilterType.FAVORITES:
      return getFavoriteMovies(movies);
  }

  return movies;
};
