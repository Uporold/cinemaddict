import UserRatingComponent from "./components/user-rating";
import FooterStatisticsComponent from "./components/footer-statistics";
import PageController from "./controllers/page-controller";
import MoviesModel from "./models/movies";
import CommentsModel from "./models/comments";
import API from "./api/api.js";
import {render} from "./utils/render";
import Statistic from "./components/statistics";
import FilterController from "./controllers/filter-controller";

export const MenuItem = {
  FILMS: `films`,
  STATS: `stats`,
};

const AUTHORIZATION = `Basic 1337fdsffwerewrwewbvcb1337`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const main = document.querySelector(`.main`);
const pageController = new PageController(main, moviesModel, commentsModel, api);

const mainMenuComponent = new FilterController(main, moviesModel);
mainMenuComponent.render();

const header = document.querySelector(`.header`);
const userRatingComponent = new UserRatingComponent(moviesModel);

const footerStatistics = document.querySelector(`.footer__statistics`);
const footerStatisticsComponent = new FooterStatisticsComponent(moviesModel);
const statistics = new Statistic(moviesModel);
statistics.hide();
render(main, statistics);

mainMenuComponent.setOnStatsClick((menuItem) => {
  if (menuItem === MenuItem.STATS) {
    pageController.hide();
    statistics.show();
  } else {
    statistics.hide();
    pageController.show();
  }
});

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    api.getComments(movies)
      .then((comments) => {
        commentsModel.setComments(comments);
        render(header, userRatingComponent);
        render(footerStatistics, footerStatisticsComponent);
        pageController.render();
      });
  });

