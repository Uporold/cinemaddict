import AbstractSmartComponent from "./abstract-smart-component";
import NewComment from "./new-comment";
import {getDate} from "../utils/utils";
import {render} from "../utils/render";
import moment from "moment";

const createGenresMarkup = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const createCommentMarkup = ({id, author, comment, date, emotion}) => {
  return (
    `<li class="film-details__comment" data-comment-id="${id}">
  <span class="film-details__comment-emoji">
  <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
  <p class="film-details__comment-text">${comment}</p>
<p class="film-details__comment-info">
  <span class="film-details__comment-author">${author}</span>
<span class="film-details__comment-day">${moment(date).fromNow()}</span>
<button class="film-details__comment-delete" data-delete-id="${id}">Delete</button>
  </p>
  </div>
  </li>`
  );
};


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


const createFilmDetailsPopupTemplate = (movie, movieComments) => {
  const {title, original, age, rating, director, writers, actors, release, runtime, country, genres, poster, description, commentIds} = movie;
  const genresMarkup = genres.map((genre) => createGenresMarkup(genre)).join(`\n`);
  const sortedByDateComments = movieComments.sort((a, b) => getDate(b.date) - getDate(a.date));
  const commentsMarkup = sortedByDateComments.map((comment) => createCommentMarkup(comment)).join(`\n`);

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
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${poster}" alt="">

          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${original}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${writers.length > 1 ? `Writers` : `Writer`}</td>
              <td class="film-details__cell">${writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(release).format(`DD MMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${moment.utc(moment.duration(runtime, `minutes`).asMilliseconds()).format(`H[h] mm[m]`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${genresMarkup}
                </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${createControlsMarkup()}
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentIds.length}</span></h3>

        <ul class="film-details__comments-list">
            ${commentsMarkup}
        </ul>
        <div class="test"></div>

      <!-- <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">

</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" >
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" >
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" >
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" >
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>-->
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmDetailsPopup extends AbstractSmartComponent {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
    this._newCommentTestComponent = new NewComment();
    render(this.getElement().querySelector(`.test`), this._newCommentTestComponent);

    this._watchlistHandler = null;
    this._historyHandler = null;
    this._favoriteHandler = null;
    this._deleteButtonClickHandler = null;
    this._addNewCommentHandler = null;
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._movie, this._comments);
  }

  setClosePopupHandler(cb) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, cb);
  }

  setWatchlistButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
    this._watchlistHandler = handler;
  }

  setHistoryButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);
    this._historyHandler = handler;
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
    this._favoriteHandler = handler;
  }

  setCommentDeleteButtonClickHandler(handler) {
    let deleteButtons = this.getElement().querySelector(`.film-details__comments-list`);
    deleteButtons.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      let target = evt.target;
      let id = target.dataset.deleteId;
      if (target.tagName !== `BUTTON`) {
        return;
      }
      this._deleteButtonClickHandler = handler(id);
    });
  }

  setAddNewCommentHandler(handler) {
    this.getElement().addEventListener(`keydown`, (evt) => {
      if (evt.code === `Enter` && (evt.ctrlKey || evt.metaKey)) {
        this._addNewCommentHandler = handler();
      }
    });
  }

  getNewComment() {
    return this._newCommentTestComponent.getNewComment();
  }

  reset() {
    this._newCommentTestComponent.reset();
  }

  recoveryListeners() {
    this.setWatchlistButtonHandler(this._watchlistHandler);
    this.setHistoryButtonHandler(this._historyHandler);
    this.setFavoriteButtonHandler(this._favoriteHandler);
    this.setCommentDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setAddNewCommentHandler(this._addNewCommentHandler);
  }
}

