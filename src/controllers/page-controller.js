import {remove, render} from "../utils/render";
import {getDate} from "../utils/utils";
import SortingComponent, {SortType} from "../components/sorting";
import FilmsComponent from "../components/films";
import FilmsListComponent from "../components/films-list";
import ShowMoreButtonComponent from "../components/show-more-button";
import FilmsListExtraComponent from "../components/films-list-extra";
import NoFilmsComponent from "../components/no-films";
import MovieController, {Mode} from "./movie-controller";


const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const Extra = {
  RATED: {
    title: `Top rated`,
    count: 2,
    getExtraMovies(movies) {
      return movies.slice()
        .sort((firstMovie, secondMovie) => secondMovie.rating - firstMovie.rating);
    },
    checkVisibility(movies) {
      return movies.some((movie) => {
        return movie.rating > 0;
      });
    }
  },
  COMMENTED: {
    title: `Most commented`,
    count: 2,
    getExtraMovies(movies) {
      return movies.slice()
        .sort((firstMovie, secondMovie) => secondMovie.commentIds.length - firstMovie.commentIds.length);
    },
    checkVisibility(movies) {
      return movies.some((movie) => {
        return movie.commentIds.length > 0;
      });
    }
  }
};

const getMovieComments = (movie, comments) => {
  return movie.commentIds.map((id) => {
    return comments.find((comment) => comment.id === id);
  });
};

const renderFilms = (container, movies, comments, onDataChange, onViewChange, api, commentsModel) => {
  let controllers = [];
  movies.map((movie) => {
    const movieController = new MovieController(container, onDataChange, onViewChange, api, commentsModel);
    movieController.render(movie, getMovieComments(movie, comments));
    controllers = [...controllers, movieController];
  });
  return controllers;
};

const renderExtraFilms = (title, movies, comments, filmsComponent, onDataChange, onViewChange, api, commentsModel) => {
  const filmListExtraComponent = new FilmsListExtraComponent(title);

  render(filmsComponent.getElement(), filmListExtraComponent);
  const filmsListContainerExtra = filmListExtraComponent.getElement().querySelector(`.films-list__container`);
  return renderFilms(filmsListContainerExtra, movies, comments, onDataChange, onViewChange, api, commentsModel);
};

const getSortedMovies = (movies, sortType, from, to) => {
  const showingMovies = movies.slice();

  switch (sortType) {
    case SortType.DATE:
      showingMovies.sort((a, b) => getDate(b.release) - getDate(a.release));
      break;
    case SortType.RATING:
      showingMovies.sort((firstMovie, secondMovie) => secondMovie.rating - firstMovie.rating);
      break;
    case SortType.DEFAULT:
      showingMovies.slice();
      break;
  }

  return showingMovies.slice(from, to);
};

export default class PageController {
  constructor(container, moviesModel, commentsModel, api) {
    this._container = container;
    this._api = api;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._showedMovieControllers = [];
    this._showedExtraMovieControllers = [];

    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._sortingComponent = new SortingComponent();
    this._filmsComponent = new FilmsComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const movies = this._moviesModel.getMovies();
    render(this._container, this._sortingComponent);
    render(this._container, this._filmsComponent);

    if (!movies.length) {
      render(this._filmsComponent.getElement(), this._noFilmsComponent);
      return;
    }

    render(this._filmsComponent.getElement(), this._filmsListComponent);

    const newMovies = renderFilms(this._filmsListContainer, movies.slice(0, this._showingFilmsCount), this._commentsModel.getComments(), this._onDataChange, this._onViewChange, this._api, this._commentsModel);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._renderLoadMoreButton();
    this._renderExtraFilms();
  }

  hide() {
    this._sortingComponent.hide();
    this._filmsComponent.hide();
  }

  show() {
    this._sortingComponent.show();
    this._filmsComponent.show();
  }

  _renderExtraFilms() {
    for (let list in Extra) {
      if ({}.hasOwnProperty.call(Extra, list)) {
        if (Extra[list].checkVisibility(this._moviesModel.getMoviesAll())) {
          const newMovies = renderExtraFilms(Extra[list].title, Extra[list].getExtraMovies(this._moviesModel.getMoviesAll()).slice(0, Extra[list].count), this._commentsModel.getComments(), this._filmsComponent, this._onDataChange, this._onViewChange, this._api, this._commentsModel);
          this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(newMovies);
        }
      }
    }
  }

  _renderLoadMoreButton() {
    if (this._showingFilmsCount >= this._moviesModel.getMovies().length) {
      return;
    }

    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount || SHOWING_FILMS_COUNT_ON_START;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;
      const sort = this._sortingComponent.getSortType();
      const sortedMovies = getSortedMovies(this._moviesModel.getMovies(), sort, prevFilmsCount, this._showingFilmsCount);
      const newMovies = renderFilms(this._filmsListContainer, sortedMovies, this._commentsModel.getComments(), this._onDataChange, this._onViewChange, this._api, this._commentsModel);
      this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

      if (this._showingFilmsCount >= this._moviesModel.getMovies().length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    const sortedMovies = getSortedMovies(this._moviesModel.getMovies(), sortType, 0, this._showingFilmsCount);
    this._removeMovies();
    this._showedMovieControllers = renderFilms(this._filmsListContainer, sortedMovies, this._commentsModel.getComments(), this._onDataChange, this._onViewChange, this._api, this._commentsModel);
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((eventController) => eventController.destroy());
    this._showedMovieControllers = [];
  }

  _removeExtraMovies() {
    this._showedExtraMovieControllers.forEach((eventController) => eventController.destroy());
    this._showedExtraMovieControllers = [];
  }

  _updateMovies() {
    this._filmsListContainer.innerHTML = ``;
    document.querySelectorAll(`.films-list--extra`).forEach((list) => {
      list.innerHTML = ``;
    });
    this._removeExtraMovies();
    this._onSortTypeChange(this._sortingComponent.getSortType());
    this._renderExtraFilms();
    remove(this._showMoreButtonComponent);
    this._renderLoadMoreButton();
  }

  _onDataChange(oldData, newData, mode = null) {
    if (mode === Mode.CLOSING) {
      this._updateMovies();
      return;
    }
    const allShowedMovieControllers = [...this._showedMovieControllers, ...this._showedExtraMovieControllers];
    const movieControllers = allShowedMovieControllers.filter((evt) => evt._filmCardComponent._movie.id === oldData.id);

    this._api.updateMovie(oldData.id, newData)
      .then((movie) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, movie);
        if (isSuccess) {
          movieControllers.forEach((movieController) => {
            movieController.rerender(movie, getMovieComments(movie, this._commentsModel.getComments()));
          });
          if (mode === Mode.DEFAULT) {
            this._updateMovies();
          }
        }
      });
  }

  _onFilterChange() {
    this._updateMovies();
  }

  _onViewChange() {
    const allShowedMovieControllers = [...this._showedMovieControllers, ...this._showedExtraMovieControllers];
    allShowedMovieControllers.forEach((controller) => controller.setDefaultView());
  }
}
