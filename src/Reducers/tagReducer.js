import {
  LOAD_ALL_PARENT_TAGS,
  LOAD_ALL_TAGS,
  CREATE_TAG,
  CREATE_PARENT_TAG,
  CREATE_ERROR,
} from "../action/type";

const tags = (
  state = {
    allTags: [],
    allParentTags: [],
  },
  action
) => {
  switch (action.type) {
    case LOAD_ALL_TAGS:
      state = Object.assign({}, state, {
        allTags: action.payload,
      });
      return state;
    case LOAD_ALL_PARENT_TAGS:
      state = Object.assign({}, state, {
        allParentTags: action.payload,
      });
      return state;

    case CREATE_TAG:
      let newTag = action.payload;
      let oldState = state.allTags.slice(0);

      state = Object.assign({}, state, {
        allTags: [...oldState, newTag],
      });
      return state;

    case CREATE_PARENT_TAG:
      let newParentTag = action.payload;
      oldState = state.allParentTags.slice(0);

      state = Object.assign({}, state, {
        allParentTags: [...oldState, newParentTag],
      });
      return state;

    case CREATE_ERROR:
      state = Object.assign({}, state, {
        error: "Error creating tag: " + action.message,
      });
      return state;
    default:
      return state;
  }
};

export default tags;
