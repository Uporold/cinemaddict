import {render, remove} from "../utils/render";
import SortingComponent, {SortType} from "../components/sorting";
import FilmsComponent from "../components/films";
import FilmsListComponent from "../components/films-list";
import ShowMoreButtonComponent from "../components/show-more-button";
import FilmsListExtraComponent from "../components/films-list-extra";
import NoFilmsComponent from "../components/no-films";
import MovieController from "./movie-controller";
import FilterController from "./filter-controller";


const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const Extra = {
  RATED: {
    title: `Top rated`,
    count: 2,
    getExtraMovies(m) {
      return m.slice()
        .sort((firstMovie, secondMovie) => secondMovie.rating - firstMovie.rating);
    }
  },
  COMMENTED: {
    title: `Most commented`,
    count: 2,
    getExtraMovies(m) {
      return m.slice()
        .sort((firstMovie, secondMovie) => secondMovie.commentIds.length - firstMovie.commentIds.length);
    }
  }
};

const getMovieComments = (movie, comments) => {
  return movie.commentIds.map((id) => {
    return comments.find((comment) => comment.id === id);
  });
};

const renderFilms = (container, movies, comments, onDataChange) => {
  let controllers = [];
  movies.map((movie) => {
    const movieController = new MovieController(container, onDataChange);
    movieController.render(movie, getMovieComments(movie, comments));
    controllers = [...controllers, movieController];
  });
  return controllers;
};

const renderExtraFilms = (title, movies, comments, filmsComponent, onDataChange) => {
  const filmListExtraComponent = new FilmsListExtraComponent(title);

  render(filmsComponent.getElement(), filmListExtraComponent);
  const filmsListContainerExtra = filmListExtraComponent.getElement().querySelector(`.films-list__container`);
  return renderFilms(filmsListContainerExtra, movies, comments, onDataChange);
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

const getDate = (date) => {
  return new Date(date).valueOf();
};


export default class PageController {
  constructor(container, moviesModel, commentsModel, api) {
    this._container = container;
    this._api = api;
    this._movies = [];
    this._comments = [];
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

  }

  render() {
    this._movies = this._moviesModel.getMoviesAll();
    this._comments = this._commentsModel.getComments();
    const mainMenuComponent = new FilterController(this._container, this._moviesModel);
    mainMenuComponent.render();
    render(this._container, this._sortingComponent);
    render(this._container, this._filmsComponent);

    if (!this._movies.length) {
      render(this._filmsComponent.getElement(), this._noFilmsComponent);
      return;
    }

    render(this._filmsComponent.getElement(), this._filmsListComponent);

    const newMovies = renderFilms(this._filmsListContainer, this._movies.slice(0, this._showingFilmsCount), this._comments, this._onDataChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._renderLoadMoreButton();
    this._renderExtraFilms();
  }

  _renderExtraFilms() {
    for (let list in Extra) {
      if ({}.hasOwnProperty.call(Extra, list)) {
        const newMovies = renderExtraFilms(Extra[list].title, Extra[list].getExtraMovies(this._movies).slice(0, Extra[list].count), this._comments, this._filmsComponent, this._onDataChange);
        this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(newMovies);
      }
    }
  }

  _renderLoadMoreButton() {
    if (this._showingFilmsCount >= this._movies.length) {
      return;
    }

    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount || SHOWING_FILMS_COUNT_ON_START;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;
      const sort = this._sortingComponent.getSortType();
      const sortedMovies = getSortedMovies(this._movies, sort, prevFilmsCount, this._showingFilmsCount);
      const newMovies = renderFilms(this._filmsListContainer, sortedMovies, this._comments, this._onDataChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

      if (this._showingFilmsCount >= this._movies.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._filmsListContainer.innerHTML = ``;
    const sortedMovies = getSortedMovies(this._movies, sortType, 0, this._showingFilmsCount);
    const newMovies = renderFilms(this._filmsListContainer, sortedMovies, this._comments, this._onDataChange);
    this._showedMovieControllers = this._showedExtraMovieControllers.concat(newMovies);
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((eventController) => eventController.destroy());
    this._showedMovieControllers = [];
  }

  _updateMovies() {
    this._filmsListContainer.innerHTML = ``;
    document.querySelectorAll(`.films-list--extra`).forEach((list) => {
      list.innerHTML = ``;
    });
    this._removeMovies();
    const moviesToRender = getSortedMovies(this._movies, this._sortingComponent.getSortType(), 0, this._showingFilmsCount);
    renderFilms(this._filmsListContainer, moviesToRender, this._comments, this._onDataChange);
    this._renderExtraFilms();
  }


  _onDataChange(oldData, newData) {
    const index = this._movies.findIndex((it) => it === oldData);
    const allShowedMovieControllers = [...this._showedMovieControllers, ...this._showedExtraMovieControllers];
    const movieControllers = allShowedMovieControllers.filter((evt) => evt._filmCardComponent._movie.id === oldData.id);

    if (index === -1) {
      return;
    }

    this._movies = [...this._movies.slice(0, index), newData, ...this._movies.slice(index + 1)];

    this._api.updateMovie(oldData.id, newData)
      .then((movie) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, movie);
        if (isSuccess) {
          // this._updateMovies();
          movieControllers.forEach((movieController) => {
            movieController.render(this._movies[index], getMovieComments(this._movies[index], this._comments));
          });
        }
      });

  }
}
