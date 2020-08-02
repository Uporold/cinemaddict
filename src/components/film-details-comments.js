import moment from "moment";
import {getDate} from "../utils/utils";
import AbstractComponent from "./abstract-component";
import {SHAKE_OPTION} from "../utils/const";


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

const createCommentsTemplate = (movie, movieComments) => {
  const sortedByDateComments = movieComments.sort((a, b) => getDate(b.date) - getDate(a.date));
  const commentsMarkup = sortedByDateComments.map((comment) => createCommentMarkup(comment)).join(`\n`);
  return (
    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movie.commentIds.length}</span></h3>
        <ul class="film-details__comments-list">
            ${commentsMarkup}
        </ul>
     </section`
  );
};

export default class FilmDetailsComments extends AbstractComponent {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;

    this._deleteButtonClickHandler = null;
  }

  getTemplate() {
    return createCommentsTemplate(this._movie, this._comments);
  }

  setCommentDeleteButtonClickHandler(handler) {
    let deleteButtons = this.getElement().querySelector(`.film-details__comments-list`);
    deleteButtons.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      let target = evt.target;
      if (target.tagName !== `BUTTON`) {
        return;
      }
      target.disabled = true;
      target.textContent = `Deleting...`;
      let id = target.dataset.deleteId;
      this._deleteButtonClickHandler = handler(id);
    });
  }

  recoveryListeners() {
    this.setCommentDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  shake(id) {
    const element = this.getElement();
    const index = this._comments.findIndex((comment) => comment.id === id);
    const commentsAll = element.querySelectorAll(`.film-details__comment`);
    const comment = commentsAll[index];
    comment.style = SHAKE_OPTION.SHAKE_STYLE;
    comment.style.animation = `shake ${SHAKE_OPTION.SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      comment.style = ``;
      comment.style.animation = ``;
      comment.querySelector(`.film-details__comment-delete`).disabled = false;
      comment.querySelector(`.film-details__comment-delete`).textContent = `Delete`;
    }, SHAKE_OPTION.SHAKE_ANIMATION_TIMEOUT);
  }
}
