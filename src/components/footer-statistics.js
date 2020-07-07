import AbstractSmartComponent from "./abstract-smart-component";

const createFooterStatisticsTemplate = (movies) => {
  return (
    `<p>${movies.length} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;

    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._moviesModel.getMoviesAll());
  }

  recoveryListeners() {
  }

  _onDataChange() {
    this.rerender();
  }
}
