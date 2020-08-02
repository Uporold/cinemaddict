import AbstractComponent from "./abstract-component";
import moment from "moment";

const createGenresMarkup = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};


const createFilmDetailsPopupTemplate = (movie) => {
  const {title, original, age, rating, director, writers, actors, release, runtime, country, genres, poster, description} = movie;
  const genresMarkup = genres.map((genre) => createGenresMarkup(genre)).join(`\n`);

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
    </div>

    <div class="form-details__bottom-container">
    </div>
  </form>
</section>`
  );
};

export default class FilmDetailsPopup extends AbstractComponent {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._movie, this._comments);
  }

  setClosePopupHandler(cb) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, cb);
  }
}

