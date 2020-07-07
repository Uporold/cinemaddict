import AbstractSmartComponent from "./abstract-smart-component";

const createNewComment = (emoji) => {
  return (
    `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
           ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
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

    this._subscribeOnEvents();
  }
  getTemplate() {
    return createNewComment(this._emoji);
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelectorAll(`.film-details__emoji-item`).forEach((input) =>{
      input.addEventListener(`click`, (evt) => {
        this._emoji = evt.target.value;
        this.rerender();
      });
    });
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

}
