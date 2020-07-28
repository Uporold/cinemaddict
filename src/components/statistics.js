import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserRank} from "./user-rating";
import moment from "moment";
import AbstractSmartComponent from "./abstract-smart-component";
import {getFilteredStatisticMovies} from "../utils/statistics";
import {TimePeriod} from "../utils/statistics";

const BAR_HEIGHT = 50;

const getFiltersMarkup = (timePeriod, isChecked) => {
  const filters = Object.values(timePeriod);

  return filters.map((filter) => {
    const filterLabel = filter.charAt(0).toUpperCase() + filter.replace(`-`, ` `).slice(1);

    return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
            id="statistic-${filter}" value="${filter}" ${filter === isChecked ? `checked` : ``}>
            <label for="statistic-${filter}" class="statistic__filters-label">${filterLabel}</label>`;
  }).join(`\n`);
};

const getAllGenres = (movies) => {
  let genres = [];
  movies.forEach((movie) => {
    genres.push(...movie.genres);
  });
  return genres;
};

const getTotalTime = (movies) => {
  let totalTime = 0;
  movies.forEach((movie) => {
    totalTime += movie.runtime;
  });
  return totalTime;
};

const getStatisticsTemplate = (moviesModel, activeFilter, topGenre) => {
  const watchedMovies = getFilteredStatisticMovies(moviesModel.getMoviesAll(), activeFilter);
  const totalRank = getUserRank(moviesModel.getMoviesAll());
  const totalDuration = moment.utc(moment.duration(getTotalTime(watchedMovies), `minutes`).asMilliseconds())
    .format(`H[<span class="statistic__item-description">h</span>] mm[<span class="statistic__item-description">m</span>]`);

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${totalRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${getFiltersMarkup(TimePeriod, activeFilter)}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMovies.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration}</p>
      </li>
      ${topGenre ?
      `<li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>` : ``}
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

const createChartTemplate = (ctx, data) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((it) => {
        return it[0];
      }),
      datasets: [{
        data: data.map((it) => {
          return it[1];
        }),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      animation: {
        duration: 2000,
        easing: `linear`,
        from: 1,
        to: 0,
      },
    }
  });
};

const createGenreChart = (genreCtx, data) => {
  createChartTemplate(genreCtx, data);
};

export default class Statistic extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._filter = TimePeriod.ALL_TIME;
    this._onFilterChange();
  }

  getTemplate() {
    return getStatisticsTemplate(this._moviesModel, this._filter, this._getTopGenre());
  }

  _onFilterChange() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        this._filter = evt.target.value;
        this.rerender();
      });
  }
  recoveryListeners() {
    this._onFilterChange();
  }

  rerender() {
    super.rerender();
    this._filter = TimePeriod.ALL_TIME;
  }

  show() {
    super.show();
    this.rerender();
  }

  getElement() {
    const element = super.getElement();
    const genreCtx = element.querySelector(`.statistic__chart`);
    genreCtx.height = BAR_HEIGHT * this._getGenresTotal().length;
    createGenreChart(genreCtx, this._getGenresTotal());

    return element;
  }

  _getData(cb) {
    const reducer = (sum, genre) => {
      if (!sum.has(genre)) {
        sum.set(genre, 0);
      }
      sum.set(genre, sum.get(genre) + cb(genre));

      return sum;
    };
    const genres = getAllGenres(getFilteredStatisticMovies(this._moviesModel.getMoviesAll(), this._filter));
    return Array.from(genres.reduce(reducer, new Map())).sort((a, b) => {
      return b[1] - a[1];
    });
  }

  _getGenresTotal() {
    return this._getData(() => {
      return true;
    });
  }

  _getTopGenre() {
    const sortedGenres = this._getGenresTotal();
    const top = sortedGenres.map((it) => {
      return it[0];
    });
    return top[0];
  }
}
