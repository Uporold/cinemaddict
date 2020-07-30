import AbstractComponent from "./abstract-component";

const createFilmCardControlsTemplate = (movie) => {
  const {commentIds, isInWatchlist, isInHistory, isInFavorites} = movie;
  const watchlist = isInWatchlist ? `film-card__controls-item--active` : ``;
  const history = isInHistory ? `film-card__controls-item--active` : ``;
  const favorites = isInFavorites ? `film-card__controls-item--active` : ``;
  return (
    `<div class="film-card__bottom-container">
        <a class="film-card__comments">${commentIds.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${history}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${favorites}">Mark as favorite</button>
        </form>
    </div>`
  );
};

export default class FilmCardBottom extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createFilmCardControlsTemplate(this._movie);
  }

  setWatchlistButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setHistoryButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}

