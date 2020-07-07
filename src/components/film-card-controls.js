import AbstractSmartComponent from "./abstract-component";
import MoviesModel from "../models/movies";


const createFilmCardControlsTemplate = (movie) => {
  const {isInWatchlist, isInHistory, isInFavorites} = movie;
  const watchlist = isInWatchlist ? `film-card__controls-item--active` : ``;
  const history = isInHistory ? `film-card__controls-item--active` : ``;
  const favorites = isInFavorites ? `film-card__controls-item--active` : ``;
  return (
    `<form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${history}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${favorites}">Mark as favorite</button>
        </form>
    `
  );
};

export default class FilmCardControls extends AbstractSmartComponent {
  constructor(movie) {
    super();
    this._movie = movie;

    this._watchlistHandler = null;
    this._historyHandler = null;
    this._favoriteHandler = null;
    this.recoveryListeners();

    this._moviesModel = new MoviesModel();

    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createFilmCardControlsTemplate(this._movie);
  }

  setWatchlistButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
    this._watchlistHandler = handler;
  }

  setHistoryButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
    this._historyHandler = handler;
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
    this._favoriteHandler = handler;
  }

  recoveryListeners() {
    this.setWatchlistButtonHandler(this._watchlistHandler);
    this.setHistoryButtonHandler(this._historyHandler);
    this.setFavoriteButtonHandler(this._favoriteHandler);

  }

  rerender() {
    super.rerender();
  }

  _onDataChange() {
    this.rerender();
  }
}

