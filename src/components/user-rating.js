import AbstractSmartComponent from "./abstract-smart-component";

const UserRank = {
  NOVICE: {
    rank: `Novice`,
    minMovies: 1,
  },
  FUN: {
    rank: `Fan`,
    minMovies: 11
  },
  MOVIE_BUFF: {
    rank: `Movie Buff`,
    minMovies: 18
  }
};

export const getUserRank = (movies) => {
  const watchedMovies = movies.filter((movie) => movie.isInHistory).length;
  switch (true) {
    case watchedMovies >= UserRank.NOVICE.minMovies && watchedMovies < UserRank.FUN.minMovies:
      return UserRank.NOVICE.rank;
    case watchedMovies >= UserRank.FUN.minMovies && watchedMovies < UserRank.MOVIE_BUFF.minMovies:
      return UserRank.FUN.rank;
    case watchedMovies >= UserRank.MOVIE_BUFF.minMovies:
      return UserRank.MOVIE_BUFF.rank;
    default:
      return ``;
  }
};

const createUserRatingTemplate = (movies) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${getUserRank(movies)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRating extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;

    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createUserRatingTemplate(this._moviesModel.getMoviesAll());
  }

  _onDataChange() {
    this.rerender();
  }

  recoveryListeners() {
  }
}
