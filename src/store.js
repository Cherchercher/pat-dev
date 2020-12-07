import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./Reducers";
import { saveState } from "./localStorage";
const middleware = [thunk];

function configureStore() {
  return createStore(rootReducer, compose(applyMiddleware(...middleware)));
}

const store = configureStore();

// const store = createStore(reducers,
//   applyMiddleware(thunk)
// );

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
