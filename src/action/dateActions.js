import { GET_DATE, SET_END_DATE, SET_START_DATE } from "./type";

export const getDate = () => {
  return dispatch => {
    dispatch({
      type: GET_DATE
    });
  };
};

export const setStartDate = start_date => {
  return dispatch => {
    dispatch({
      type: SET_START_DATE,
      payload: start_date
    });
  };
};

export const setEndDate = end_date => {
  return dispatch => {
    dispatch({
      type: SET_END_DATE,
      payload: end_date
    });
  };
};
