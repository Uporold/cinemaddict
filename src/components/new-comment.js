import AbstractSmartComponent from "./abstract-smart-component";

const createNewComment = (emoji, comment) => {
  return (
    `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
           ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment ? comment : ``}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emoji === `smile` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emoji === `sleeping` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emoji === `puke` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emoji === `angry` ? `checked` : ``}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>`
  );
};


export default class NewComment extends AbstractSmartComponent {
  constructor() {
    super();
    this._emoji = null;
    this._comment = null;

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

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
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

}
