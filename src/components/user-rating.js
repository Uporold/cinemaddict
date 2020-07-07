import AbstractSmartComponent from "./abstract-smart-component";

const UserRank = {
  NOVICE: {
    rank: `Novice`,
    from: 1,
  },
  FUN: {
    rank: `Fan`,
    from: 11
  },
  MOVIE_BUFF: {
    rank: `Movie Buff`,
    from: 18
  }
};

const getUserRank = (watchedMovies) => {
  switch (true) {
    case watchedMovies >= UserRank.NOVICE.from && watchedMovies < UserRank.FUN.from:
      return UserRank.NOVICE.rank;
    case watchedMovies >= UserRank.FUN.from && watchedMovies < UserRank.MOVIE_BUFF.from:
      return UserRank.FUN.rank;
    case watchedMovies >= UserRank.MOVIE_BUFF.from:
      return UserRank.MOVIE_BUFF.rank;
    default:
      return ``;
  }
};

const createUserRatingTemplate = (movies) => {
  const historyCount = movies.filter((movie) => movie.isInHistory).length;
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${getUserRank(historyCount)}</p>
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
