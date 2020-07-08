import AbstractComponent from "./abstract-component";
import moment from "moment";

const getSlicedDescription = (description, length) => {
  if (description.length > length) {
    return description.slice(0, length) + `..`;
  }
  return description;
};

const createFilmCardTemplate = (movie) => {
  const {title, rating, release, runtime, genres, poster, description, commentIds, isInWatchlist, isInHistory, isInFavorites} = movie;
  const watchlist = isInWatchlist ? `film-card__controls-item--active` : ``;
  const history = isInHistory ? `film-card__controls-item--active` : ``;
  const favorites = isInFavorites ? `film-card__controls-item--active` : ``;
  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
         <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(release).format(`DD MMMM YYYY`)}</span>
          <span class="film-card__duration">${moment.utc(moment.duration(runtime, `minutes`).asMilliseconds()).format(`H[h] mm[m]`)}</span>
          <span class="film-card__genre">${genres.join(`, `)}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${getSlicedDescription(description, 140)}</p>
        <a class="film-card__comments">${commentIds.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${history}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${favorites}">Mark as favorite</button>
        </form>
     </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createFilmCardTemplate(this._movie);
  }

  setPopupHandler(cb) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, cb);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, cb);
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

