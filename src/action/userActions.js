import {
  GET_PARSE_PROFILE,
  SET_PARSE_PROFILE,
  GET_USER_PROFILE,
  SET_USER_PROFILE,
  UPDATE_PARSE_PROFILE,
  SAVE_PARSE_PROFILE,
  ADD_GUIDE,
  ADD_PLAN,
  GET_USER_GUIDES,
} from "./type";

export const getParseProfile = () => {
  return (dispatch) => {
    dispatch({
      type: GET_PARSE_PROFILE,
    });
  };
};

export const getUserProfile = () => {
  return (dispatch) => {
    dispatch({
      type: GET_USER_PROFILE,
    });
  };
};

export const setParseProfile = (profile) => {
  return (dispatch) => {
    dispatch({
      type: SET_PARSE_PROFILE,
      payload: profile,
    });
  };
};

export const updateParseProfile = (type, value) => {
  return function(dispatch) {
    dispatch({
      type: UPDATE_PARSE_PROFILE,
      payload: { type: type, value: value },
    });
  };
};

export const initProfile = (profile, parseProfile) => {
  return function(dispatch) {
    dispatch({
      type: SET_PARSE_PROFILE,
      payload: { parse: parseProfile, auth: profile },
    });
  };
};

export const saveParseProfile = () => {
  return (dispatch) => {
    dispatch({
      type: SAVE_PARSE_PROFILE,
    });
  };
};

export const setUserProfile = (profile) => {
  return (dispatch) => {
    dispatch({
      type: SET_USER_PROFILE,
      payload: profile,
    });
  };
};

export const addGuide = (plan) => {
  return (dispatch) => {
    dispatch({
      type: ADD_GUIDE,
      payload: plan,
    });
  };
};

export const getUserPlans = () => {
  return (dispatch) => {
    dispatch({
      type: GET_USER_GUIDES,
    });
  };
};

export const addPlan = (plan) => {
  return (dispatch) => {
    dispatch({
      type: ADD_PLAN,
      payload: plan,
    });
  };
};
