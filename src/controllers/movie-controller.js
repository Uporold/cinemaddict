import FilmDetailsPopupComponent from "../components/film-details-popup";
import FilmDetailsControls from "../components/film-details-controls";
import NewCommentForm from "../components/new-comment-form";
import FilmCardComponent from "../components/film-card";
import FilmCardBottom from "../components/film-card-bottom";
import FilmDetailsComments from "../components/film-details-comments";
import {render, replace, remove} from "../utils/render";
import Movie from "../models/movie";

const Selector = {
  WATCHLIST: `isInWatchlist`,
  HISTORY: `isInHistory`,
  FAVORITE: `isInFavorites`
};

export const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
  CLOSING: `closing`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._filmCardBottom = null;
    this._filmDetailsControls = null;
    this._filmDetailsComments = null;
    this._filmDetailsCommentForm = null;
    this._body = document.querySelector(`body`);
    this._api = api;
    this._commentsModel = commentsModel;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(movie, comments) {
    this._renderFilmCard(movie);
    this._renderFilmDetails(movie, comments);
  }

  rerender(movie, comments) {
    this._renderFilmCardBottom(movie);
    this._renderFilmDetailsControls(movie);
    this._renderFilmDetailsComments(movie, comments);
  }

  _renderFilmCard(movie) {
    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(movie);

    this._renderFilmCardBottom(movie);

    this._filmCardComponent.setPopupHandler(() => {
      this._showFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });


    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _renderFilmCardBottom(movie) {
    const oldFilmCardBottom = this._filmCardBottom;
    this._filmCardBottom = new FilmCardBottom(movie);
    this._filmCardComponent.getElement().appendChild(this._filmCardBottom.getElement());

    this._filmCardBottom.setWatchlistButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selector.WATCHLIST, Mode.DEFAULT, Object.keys(Selector)[0].toLowerCase());
    });

    this._filmCardBottom.setHistoryButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selector.HISTORY, Mode.DEFAULT, Object.keys(Selector)[1].toLowerCase());
    });

    this._filmCardBottom.setFavoriteButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selector.FAVORITE, Mode.DEFAULT, Object.keys(Selector)[2].toLowerCase());
    });

    if (oldFilmCardBottom) {
      replace(this._filmCardBottom, oldFilmCardBottom);
    }
  }
  _renderFilmDetails(movie, comments) {
    const oldFilmDetailsPopupComponent = this._filmDetailsPopupComponent;
    this._filmDetailsPopupComponent = new FilmDetailsPopupComponent(movie);
    this._filmDetailsPopupComponent.setClosePopupHandler(() => {
      this._removeFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });
    this._renderFilmDetailsControls(movie);
    this._renderFilmDetailsComments(movie, comments);
    this._renderFilmDetailsNewCommentForm(movie);
    if (oldFilmDetailsPopupComponent) {
      replace(this._filmDetailsPopupComponent, oldFilmDetailsPopupComponent);
    }

  }
  _renderFilmDetailsControls(movie) {
    const oldFilmDetailsControls = this._filmDetailsControls;
    this._filmDetailsControls = new FilmDetailsControls(movie);
    this._filmDetailsPopupComponent.getElement().querySelector(`.form-details__top-container`).appendChild(this._filmDetailsControls.getElement());

    this._filmDetailsControls.setWatchlistButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selector.WATCHLIST);
    });

    this._filmDetailsControls.setHistoryButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selector.HISTORY);
    });

    this._filmDetailsControls.setFavoriteButtonHandler((evt) => {
      this._getHandlerTemplate(evt, movie, Selector.FAVORITE);
    });

    if (oldFilmDetailsControls) {
      replace(this._filmDetailsControls, oldFilmDetailsControls);
    }
  }
  _renderFilmDetailsComments(movie, comments) {
    const oldFilmDetailsComments = this._filmDetailsComments;
    this._filmDetailsComments = new FilmDetailsComments(movie, comments);
    this._filmDetailsPopupComponent.getElement().querySelector(`.form-details__bottom-container`).appendChild(this._filmDetailsComments.getElement());

    this._filmDetailsComments.setCommentDeleteButtonClickHandler((id) => {
      this._onCommentDataChange(movie, id);
    });

    if (oldFilmDetailsComments) {
      replace(this._filmDetailsComments, oldFilmDetailsComments);
    }

  }
  _renderFilmDetailsNewCommentForm(movie) {
    const oldFilmDetailsCommentForm = this._filmDetailsCommentForm;
    this._filmDetailsCommentForm = new NewCommentForm();
    this._filmDetailsPopupComponent.getElement().querySelector(`.form-details__bottom-container`).appendChild(this._filmDetailsCommentForm.getElement());
    this._filmDetailsCommentForm.setAddNewCommentHandler((evt) => {
      if (evt.code === `Enter` && (evt.ctrlKey || evt.metaKey)) {
        this._onCommentDataChange(movie);
      }
    });
    if (oldFilmDetailsCommentForm) {
      replace(this._filmDetailsCommentForm, oldFilmDetailsCommentForm);
    }

  }

  _onCommentDataChange(oldData, id = false) {
    return id === false ? this._placeComment(oldData) : this._deleteComment(oldData, id);
  }


  _placeComment(oldData) {
    const comment = this._filmDetailsCommentForm.getNewComment();
    this._api.createComment(oldData.id, comment)
        .then(({newMovie, newComments}) => {
          this._commentsModel.addComment(newComments[newComments.length - 1]);
          this._onDataChange(oldData, newMovie);
          this._filmDetailsCommentForm.reset();
        })
        .catch(() => {
          this._filmDetailsCommentForm.shake();
        });
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
      })
      .catch(() => {
        this._filmDetailsComments.shake(id);
      });
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _getHandlerTemplate(evt, movie, data, mode, filter = null) {
    evt.preventDefault();
    const newData = Movie.clone(movie);
    newData[data] = !movie[data];
    if (data === Selector.HISTORY && newData[data] === false) {
      newData.watchingDate = null;
    } else {
      newData.watchingDate = new Date();
    }
    this._onDataChange(movie, newData, mode, filter);
  }

  _showFilmDetails() {
    this._onViewChange();
    this._mode = Mode.DETAILS;
    this._body.appendChild(this._filmDetailsPopupComponent.getElement());
    this._body.classList.toggle(`hide-overflow`);
  }

  _removeFilmDetails() {
    if (this._mode === Mode.DETAILS) {
      this._mode = Mode.CLOSING;
      this._body.removeChild(this._filmDetailsPopupComponent.getElement());
      this._body.classList.toggle(`hide-overflow`);
      this._filmDetailsCommentForm.reset();
      this._onDataChange(null, null, this._mode);

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
