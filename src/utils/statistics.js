import moment from "moment";

export const TimePeriod = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

export const getFilteredStatisticMovies = (movies, filterType) => {
  let filteredMovies = [];
  const date = moment(new Date());
  return movies.filter((movie) => {
    const dueDate = moment(movie.watchingDate);

    if (!dueDate) {
      return false;
    }

    switch (filterType) {
      case TimePeriod.ALL_TIME:
        filteredMovies = date > dueDate;
        break;
      case TimePeriod.TODAY:
        filteredMovies = date.diff(dueDate, `days`) === 0;
        break;
      case TimePeriod.WEEK:
        filteredMovies = dueDate.diff(date, `weeks`) === 0;
        break;
      case TimePeriod.MONTH:
        filteredMovies = dueDate.diff(date, `months`) === 0;
        break;
      case TimePeriod.YEAR:
        filteredMovies = dueDate.diff(date, `years`) === 0;
        break;
    }
    return filteredMovies;
  });
};
