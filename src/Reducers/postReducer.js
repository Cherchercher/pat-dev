import {
  LOAD_ALL_NOTES,
  UPDATE_NOTE,
  CREATE_NOTE,
  CREATE_ERROR,
  UPDATE_ERROR,
  UPLOADING,
  LOADING,
  LOADING_NOTE,
} from "../action/type";

const notes = (
  state = {
    allNotes: [],
    displayedNote: "new",
    uploading: false,
    loading: true,
    loadingNote: false,
  },
  action
) => {
  switch (action.type) {
    case LOAD_ALL_NOTES:
      state = Object.assign({}, state, {
        allNotes: action.payload,
        loading: false,
      });
      return state;

    case CREATE_NOTE:
      let newNote = action.payload;
      let oldState = state.allNotes.slice(0);
      state = Object.assign({}, state, {
        allNotes: [...oldState, newNote],
        displayedNote: newNote,
        uploading: false,
      });
      return state;

    case UPLOADING:
      state = Object.assign({}, state, {
        uploading: true,
      });
      return state;

    case LOADING_NOTE:
      state = Object.assign({}, state, {
        loadingNote: true,
      });
      return state;

    case LOADING:
      state = Object.assign({}, state, {
        loading: true,
      });
      return state;

    case UPDATE_NOTE:
      let updatedNoteId = action.payload.objectId;
      let locateOutDatedNote = state.allNotes.find((n) => {
        return n.objectId === updatedNoteId;
      });

      let updatedNote = action.payload;
      let currentNotesState = state.allNotes.slice(0);
      const savedNotes = [
        ...currentNotesState.slice(
          0,
          currentNotesState.indexOf(locateOutDatedNote)
        ),
        updatedNote,
        ...currentNotesState.slice(
          currentNotesState.indexOf(locateOutDatedNote) + 1
        ),
      ];
      state = Object.assign({}, state, {
        allNotes: savedNotes,
        displayedNote: updatedNote,
        uploading: false,
      });
      return state;

    case CREATE_ERROR:
      state = Object.assign({}, state, {
        error: "Error creating note: " + action.message,
      });
      return state;

    case UPDATE_ERROR:
      state = Object.assign({}, state, {
        error: "Error updating note: " + action.message,
      });
      return state;
    default:
      return state;
  }
};

export default notes;
