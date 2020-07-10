import MainMenu from "../components/main-menu";
import {replace, render} from "../utils/render";
import {FilterType} from "../utils/const";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const movies = this._moviesModel.getMoviesAll();

    const oldComponent = this._filterComponent;

    this._filterComponent = new MainMenu(movies, this._activeFilterType);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  _onDataChange() {
    this.render();
    this._filterComponent.setActiveItem(this._activeFilterType);
  }

  _onFilterChange(filterType) {
    switch (filterType) {
      case FilterType.ALL:
        this._moviesModel.setFilter(filterType);
        this._activeFilterType = filterType;
        break;
      case FilterType.WATCHLIST:
        if (this._moviesModel.getMovies(filterType).length) {
          this._moviesModel.setFilter(filterType);
          this._activeFilterType = filterType;
        }
        break;
      case FilterType.HISTORY:
        if (this._moviesModel.getMovies(filterType).length) {
          this._moviesModel.setFilter(filterType);
          this._activeFilterType = filterType;
        }
        break;
      case FilterType.FAVORITES:
        if (this._moviesModel.getMovies(filterType).length) {
          this._moviesModel.setFilter(filterType);
          this._activeFilterType = filterType;
        }
        break;
    }

  }

}
