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
  constructor(container, onDataChange, api, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._body = document.querySelector(`body`);
    this._api = api;
    this._commentsModel = commentsModel;

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
      this._getHandlerTemplate(evt, movie, Selectors.WATCHLIST, Mode.DETAILS);
    });

    this._filmDetailsPopupComponent.setHistoryButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.HISTORY, Mode.DETAILS);
    });

    this._filmDetailsPopupComponent.setFavoriteButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selectors.FAVORITE, Mode.DETAILS);
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
          this._onDataChange(oldData, newMovie, Mode.DETAILS);
        });
    }
  }

  _deleteComment(oldData, id) {
    const newMovie = Movie.clone(oldData);
    this._api.deleteComment(id)
       .then(() => {
         newMovie.commentIds = oldData.commentIds.filter((tid) => {
           return tid !== id;
         });
         this._onDataChange(oldData, newMovie, Mode.DETAILS);
       });
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
  }

  _removeFilmDetails() {
    this._body.removeChild(this._filmDetailsPopupComponent.getElement());
    this._body.classList.toggle(`hide-overflow`);
    this._filmDetailsPopupComponent.reset();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
