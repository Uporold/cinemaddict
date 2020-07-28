import FilmDetailsPopupComponent from "../components/film-details-popup";
import FilmCardComponent from "../components/film-card";
import {render, replace, remove} from "../utils/render";
import Movie from "../models/movie";

const SHAKE_ANIMATION_TIMEOUT = 600;
const SHAKE_STYLE = `box-shadow: 0px 0px 15px 0px rgba(245,32,32,1);`;

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
  constructor(container, onDataChange, onViewChange, api, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._body = document.querySelector(`body`);
    this._api = api;
    this._commentsModel = commentsModel;
    this._mode = Mode.DEFAULT;

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
      this._getHandlerTemplate(evt, movie, Selectors.WATCHLIST);
    });

    this._filmDetailsPopupComponent.setHistoryButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.HISTORY);
    });

    this._filmDetailsPopupComponent.setFavoriteButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.FAVORITE);
    });

    this._filmDetailsPopupComponent.setCommentDeleteButtonClickHandler((id) => {
      this._onCommentDataChange(movie, id);
    });

    this._filmDetailsPopupComponent.setAddNewCommentHandler(() => {
      this._onCommentDataChange(movie);
    });

    if (oldFilmCardComponent && oldFilmDetailsPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsPopupComponent, oldFilmDetailsPopupComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _onCommentDataChange(oldData, id = false) {
    return id === false ? this._placeComment(oldData) : this._deleteComment(oldData, id);
  }


  _placeComment(oldData) {
    const comment = this._filmDetailsPopupComponent.getNewComment();
    if (comment) {
      this._api.createComment(oldData.id, comment)
        .then(({newMovie, newComments}) => {
          this._commentsModel.addComment(newComments[newComments.length - 1]);
          this._onDataChange(oldData, newMovie);
        });
    } else {
      this.shake();
    }
  }

  _deleteComment(oldData, id) {
    const newMovie = Movie.clone(oldData);
    this._api.deleteComment(id)
       .then(() => {
         this._commentsModel.removeComment(id);
         newMovie.commentIds = oldData.commentIds.filter((tid) => {
           return tid !== id;
         });
         this._onDataChange(oldData, newMovie);
       });
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comment-label`).style = SHAKE_STYLE;
    this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comment-label`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comment-label`).style = ``;
      this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comment-label`).style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _getHandlerTemplate(evt, movie, data, mode) {
    evt.preventDefault();
    const newData = Movie.clone(movie);
    newData[data] = !movie[data];
    if (data === Selectors.HISTORY && newData[data] === false) {
      newData.watchingDate = null;
    } else {
      newData.watchingDate = new Date();
    }
    this._onDataChange(movie, newData, mode);
  }

  _showFilmDetails() {
    this._onViewChange();
    this._mode = Mode.DETAILS;
    this._body.appendChild(this._filmDetailsPopupComponent.getElement());
    this._body.classList.toggle(`hide-overflow`);
  }

  _removeFilmDetails() {
    if (this._mode === Mode.DETAILS) {
      this._body.removeChild(this._filmDetailsPopupComponent.getElement());
      this._body.classList.toggle(`hide-overflow`);
      this._filmDetailsPopupComponent.reset();
      this._mode = Mode.DEFAULT;
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode === Mode.DETAILS) {
      this._removeFilmDetails();
    }
  }
}
