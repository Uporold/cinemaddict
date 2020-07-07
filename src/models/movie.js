export default class Movie {
  constructor(movie) {
    const filmInfo = movie[`film_info`];
    const userDetails = movie[`user_details`];

    this.id = movie[`id`];
    this.commentIds = movie[`comments`];

    this.title = filmInfo[`title`];
    this.original = filmInfo[`alternative_title`];
    this.rating = filmInfo[`total_rating`];
    this.poster = filmInfo[`poster`];
    this.age = filmInfo[`age_rating`];
    this.director = filmInfo[`director`];
    this.writers = filmInfo[`writers`];
    this.actors = filmInfo[`actors`];
    this.release = filmInfo.release[`date`];
    this.country = filmInfo.release[`release_country`];
    this.runtime = filmInfo[`runtime`];
    this.genres = filmInfo[`genre`];
    this.description = filmInfo[`description`];

    this.isInWatchlist = userDetails[`watchlist`];
    this.isInHistory = userDetails[`already_watched`];
    this.isInFavorites = userDetails[`favorite`];
    this.watchingDate = userDetails[`watching_date`];
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.commentIds,
      "film_info": {
        "title": this.title,
        "alternative_title": this.original,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.age,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.release,
          "release_country": this.country
        },
        "runtime": this.runtime,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.isInWatchlist,
        "already_watched": this.isInHistory,
        "watching_date": this.watchingDate,
        "favorite": this.isInFavorites
      }
    };
  }

  static parseMovie(movie) {
    return new Movie(movie);
  }

  static parseMovies(movie) {
    return movie.map(Movie.parseMovie);
  }

  static clone(movie) {
    return new Movie(movie.toRAW());
  }
}
