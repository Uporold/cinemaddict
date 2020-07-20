import UserRatingComponent from "./components/user-rating";
import FooterStatisticsComponent from "./components/footer-statistics";
import PageController from "./controllers/page-controller";

import MoviesModel from "./models/movies";
import CommentsModel from "./models/comments";
import API from "./api/api.js";

import {render} from "./utils/render";

const AUTHORIZATION = `Basic 54fdsffwerewrwewbvcb1337`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const main = document.querySelector(`.main`);
const pageController = new PageController(main, moviesModel, commentsModel, api);

const header = document.querySelector(`.header`);
const userRatingComponent = new UserRatingComponent(moviesModel);

const footerStatistics = document.querySelector(`.footer__statistics`);
const footerStatisticsComponent = new FooterStatisticsComponent(moviesModel);

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
