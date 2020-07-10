import AbstractComponent from "./abstract-component";
import {SortType} from "./sorting";
import {FilterType} from "../utils/const";

const Selectors = {
  WATCHLIST: `isInWatchlist`,
  HISTORY: `isInHistory`,
  FAVORITE: `isInFavorites`
};

const createMainMenuTemplate = (movies) => {
  const getFilterItemCount = (item) => {
    return movies.filter((movie) => movie[item]).length;
  };

  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
          <a href="#all" data-filter-type="${FilterType.ALL}" class="main-navigation__item main-navigation__item--active">All movies</a>
          <a href="#watchlist" data-filter-type="${FilterType.WATCHLIST}" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${getFilterItemCount(Selectors.WATCHLIST)}</span></a>
          <a href="#history" data-filter-type="${FilterType.HISTORY}" class="main-navigation__item">History <span class="main-navigation__item-count">${getFilterItemCount(Selectors.HISTORY)}</span></a>
          <a href="#favorites" data-filter-type="${FilterType.FAVORITES}" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${getFilterItemCount(Selectors.FAVORITE)}</span></a>
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
     </nav>`
  );
};

export default class MainMenu extends AbstractComponent {
  constructor(movies) {
    super();
    this._movies = movies;
    this._currenFilterType = SortType.ALL;
  }

  getTemplate() {
    return createMainMenuTemplate(this._movies);
  }

  _removeAllActiveItems() {
    const filterButtons = this.getElement().querySelectorAll(`.main-navigation__item`);
    for (let filterButton of filterButtons) {
      if (filterButton.classList.contains(`main-navigation__item--active`)) {
        filterButton.classList.remove(`main-navigation__item--active`);
      }
    }
  }

  setActiveItem(filter) {
    this._removeAllActiveItems();
    document.querySelector(`[data-filter-type =${filter}]`).classList.add(`main-navigation__item--active`);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }
      const filterType = evt.target.dataset.filterType;

      this._removeAllActiveItems();
      evt.target.classList.add(`main-navigation__item--active`);

      if (this._currenFilterType === filterType) {
        return;
      }
      this._currenFilterType = filterType;

      handler(this._currenFilterType);
    });
  }
}

