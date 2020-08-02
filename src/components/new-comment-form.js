import AbstractSmartComponent from "./abstract-smart-component";
import {SHAKE_OPTION} from "../utils/const";

const emojis = [`smile`, `sleeping`, `puke`, `angry`];

const createEmojiMarkup = (emojiName, emoji) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}" ${emoji === emojiName ? `checked` : ``}>
       <label class="film-details__emoji-label" for="emoji-${emojiName}">
         <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
       </label>`
  );
};

const createNewComment = (chosenEmoji, comment) => {
  const emojisMarkup = emojis.map((emoji) => createEmojiMarkup(emoji, chosenEmoji)).join(`\n`);
  return (
    `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
           ${chosenEmoji ? `<img src="images/emoji/${chosenEmoji}.png" width="55" height="55" alt="emoji-${chosenEmoji}">` : ``}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment ? comment : ``}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojisMarkup}
          </div>
        </div>`
  );
};

export default class NewCommentForm extends AbstractSmartComponent {
  constructor() {
    super();
    this._emoji = null;
    this._comment = null;

    this._addNewCommentHandler = null;

    this._subscribeOnEvents();
  }
  getTemplate() {
    return createNewComment(this._emoji, this._comment);
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    let emojiList = element.querySelector(`.film-details__emoji-list`);
    emojiList.addEventListener(`click`, (evt) => {
      let target = evt.target;
      this._emoji = target.value;
      if (target.tagName !== `INPUT`) {
        return;
      }
      this.rerender();
    });

    const commentInput = element.querySelector(`.film-details__comment-input`);
    commentInput.addEventListener(`input`, () => {
      this._comment = commentInput.value;
    });
  }

  setAddNewCommentHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-label`).addEventListener(`keydown`, handler);
    this._addNewCommentHandler = (evt) => handler(evt);
  }


  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setAddNewCommentHandler(this._addNewCommentHandler);
  }

  getNewComment() {
    const emotion = this._emoji;
    const newComment = this._comment;

    if (!emotion || !newComment) {
      return null;
    } else {
      return {
        comment: newComment,
        emotion,
        date: new Date()
      };
    }
  }

  reset() {
    this._emoji = null;
    this._comment = null;
    this.rerender();
  }

  shake() {
    const element = this.getElement();
    element.querySelector(`.film-details__comment-label`).style = SHAKE_OPTION.SHAKE_STYLE;
    element.querySelector(`.film-details__comment-label`).style.animation = `shake ${SHAKE_OPTION.SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.querySelector(`.film-details__comment-label`).style = ``;
      element.querySelector(`.film-details__comment-label`).style.animation = ``;
    }, SHAKE_OPTION.SHAKE_ANIMATION_TIMEOUT);
  }
}
