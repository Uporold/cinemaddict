import MainMenu from "../components/main-menu";
import {replace, render} from "../utils/render";
import {FilterType} from "../utils/const";
import {MenuItem} from "../main";

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

    this._filterComponent = new MainMenu(movies);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);


    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
      this.setOnStatsClick(this._onStatsClick);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  setOnStatsClick(handler) {
    handler(this._activeFilterType);
    this._onStatsClick = handler;
  }

  _onDataChange() {
    this.render();
    this._filterComponent.setActiveItem(this._activeFilterType);
  }

  _onFilterChange(filterType) {
    if (this._activeFilterType === filterType) {
      return;
    }
    if (filterType !== MenuItem.STATS) {
      this._moviesModel.setFilter(filterType);
    }
    this._activeFilterType = filterType;
    this._onDataChange();

  }

}
