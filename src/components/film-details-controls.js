import AbstractComponent from "./abstract-component";

const FilmControlItem = {
  WATCHLIST: {
    NAME: `watchlist`,
    TEXT: `Add to watchlist`,
    STATUS_NAME: `isInWatchlist`
  },
  WATCHED: {
    NAME: `watched`,
    TEXT: `Already watched`,
    STATUS_NAME: `isInHistory`
  },
  FAVORITES: {
    NAME: `favorite`,
    TEXT: `Add to favorites`,
    STATUS_NAME: `isInFavorites`
  }
};

const createControlMarkup = (name, text, status) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${status}>
     <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${text}</label>`
  );
};

const createControlsTemplate = (movie) => {
  const isChecked = (button) => {
    return movie[button] ? `checked` : ``;
  };
  const createControlsMarkup = () => {
    let popupControlsMarkup = [];
    for (let list in FilmControlItem) {
      if ({}.hasOwnProperty.call(FilmControlItem, list)) {
        popupControlsMarkup.push(createControlMarkup(FilmControlItem[list].NAME, FilmControlItem[list].TEXT, isChecked(FilmControlItem[list].STATUS_NAME)));
      }
    }
    return popupControlsMarkup.join(`\n`);
  };
  return (
    `<section class="film-details__controls">
        ${createControlsMarkup()}
     </section>`
  );
};

export default class FilmDetailsControls extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createControlsTemplate(this._movie);
  }

  setWatchlistButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
  }

  setHistoryButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
  }
}
