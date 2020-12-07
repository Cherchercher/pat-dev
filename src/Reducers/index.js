import { combineReducers } from "redux";
import { locationReducer, paramsReducer } from "react-router-redux-sync";
import notes from "./postReducer";
import tags from "./tagReducer";
import date from "./dateReducer";
import profile from "./userReducer";
export default combineReducers({
  notes: notes,
  date: date,
  tags: tags,
  profile: profile,
  location: locationReducer,
  params: paramsReducer
});
