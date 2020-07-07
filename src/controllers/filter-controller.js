import MainMenu from "../components/main-menu";
import {replace, render} from "../utils/render";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;


    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const movies = this._moviesModel.getMoviesAll();

    const oldComponent = this._filterComponent;

    this._filterComponent = new MainMenu(movies);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent);
    }
  }

  _onDataChange() {
    this.render();
  }

}
