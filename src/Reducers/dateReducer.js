import { GET_DATE, SET_END_DATE, SET_START_DATE } from "../action/type";

const date = (
  state = {
    start_date: new Date(),
    end_date: new Date(Date.now() + 1000 * 60 * 60 * 24)
  },
  action
) => {
  switch (action.type) {
    case GET_DATE:
      return state;

    case SET_END_DATE:
      state = Object.assign({}, state, {
        end_date:  new Date(action.payload)
      });
      return state;

    case SET_START_DATE:
      state = Object.assign({}, state, {
        start_date: new Date(action.payload)
      });
      if (new Date(action.payload) > new Date(state.end_date)) {
        state = Object.assign({}, state, {
          end_date: new Date(new Date(action.payload) + 1000 * 60 * 60 * 24)
        });
      }
      return state;

    default:
      return state;
  }
};

export default date;
