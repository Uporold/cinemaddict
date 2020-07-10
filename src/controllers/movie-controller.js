import FilmDetailsPopupComponent from "../components/film-details-popup";
import FilmCardComponent from "../components/film-card";
import {render, replace, remove} from "../utils/render";
import Movie from "../models/movie";

const Selectors = {
  WATCHLIST: `isInWatchlist`,
  HISTORY: `isInHistory`,
  FAVORITE: `isInFavorites`
};

export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._body = document.querySelector(`body`);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(movie, comments) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsPopupComponent = this._filmDetailsPopupComponent;
    this._filmCardComponent = new FilmCardComponent(movie);
    this._filmDetailsPopupComponent = new FilmDetailsPopupComponent(movie, comments);

    this._filmCardComponent.setPopupHandler(() => {
      this._showFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmDetailsPopupComponent.setClosePopupHandler(() => {
      this._removeFilmDetails();
      this._onDataChange(movie, movie);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardComponent.setWatchlistButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.WATCHLIST);
    });

    this._filmCardComponent.setHistoryButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.HISTORY);
    });

    this._filmCardComponent.setFavoriteButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.FAVORITE);
    });

    this._filmDetailsPopupComponent.setWatchlistButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.WATCHLIST, Mode.DETAILS);
    });

    this._filmDetailsPopupComponent.setHistoryButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.HISTORY, Mode.DETAILS);
    });

    this._filmDetailsPopupComponent.setFavoriteButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.FAVORITE, Mode.DETAILS);
    });

    if (oldFilmCardComponent && oldFilmDetailsPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsPopupComponent, oldFilmDetailsPopupComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _getHandlerTemplate(evt, movie, data, mode) {
    evt.preventDefault();
    const newData = Movie.clone(movie);
    newData[data] = !movie[data];
    this._onDataChange(movie, newData, mode);
  }

  _showFilmDetails() {
    this._body.appendChild(this._filmDetailsPopupComponent.getElement());
    this._body.classList.toggle(`hide-overflow`);
    this._filmDetailsPopupComponent.recoveryListeners();
  }

  _removeFilmDetails() {
    this._body.removeChild(this._filmDetailsPopupComponent.getElement());
    this._body.classList.toggle(`hide-overflow`);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
