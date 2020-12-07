import {
  SET_PARSE_PROFILE,
  SET_USER_PROFILE,
  ADD_GUIDE,
  GET_USER_GUIDES,
  GET_PARSE_PROFILE,
  GET_USER_PROFILE,
  SAVE_PARSE_PROFILE,
  UPDATE_PARSE_PROFILE,
} from "../action/type";
import unknownprofile from "../assets/unknown_profile.png";

const Parse = require("parse/node");
Parse.initialize("patback");
Parse.serverURL = "https://planatripback.herokuapp.com/parse";

const profile = (
  state = {
    plans: [],
    userProfile: null,
    parseProfile: null,
    profilePrivate: false,
    preferencesPrivate: false,
    availabilityPublic: false,
    interests: [],
    aboutMe: null,
    funFact: null,
    picture: null,
    interestsList: {
      type: [
        { id: "couple", category: "couple", value: false },
        { id: "kids", category: "kids", value: false },
        { id: "friends", category: "friends", value: false },
        { id: "solo", category: "solo", value: false },
      ],
      adventure: [{ id: 1, category: "camping", value: false }],
      food: [
        { id: 1, category: "coffee", value: false },
        { id: 2, category: "buffet", value: false },
        {
          id: 3,
          category: "authentic_dining_experience",
          value: false,
        },
      ],
      art: [
        { id: 1, category: "jazz club", value: false },
        { id: 2, category: "music", value: false },
        { id: 3, category: "museums", value: false },
      ],
    },
    budget_min: 0,
    budget_max: 100000000,
  },
  action
) => {
  switch (action.type) {
    case SET_PARSE_PROFILE:
      const parseP = action.payload.parse;
      const authP = action.payload.auth;
      if (parseP !== null) {
        var interests = parseP.get("interests");
        var aboutMe = parseP.get("aboutMe");
        var funFact = parseP.get("funFact");
        var picture = parseP.get("picture");
        var preferencesPrivate = parseP.get("preferencesPrivate");
        var profilePrivate = parseP.get("profilePrivate");
        var userName = parseP.get("userName");
        if (interests == null) {
          interests = [];
        }

        if (userName == null) {
          userName = authP.name;

          parseP.set("userName", userName);
          parseP.save().then(
            (parseP) => {
              // Execute any logic that should take place after the object is saved.
              console.log("username set");
            },
            (error) => {
              // Execute any logic that should take place if the save fails.
              // error is a Parse.Error with an error code and message.
              console.log(
                "Failed to set username. Error code: " + error.message
              );
            }
          );
          return state;
        }

        if (aboutMe == null) {
          aboutMe = "Add an intro";
        }
        if (funFact == null) {
          funFact = "Got anything interesting?";
        }
        if (picture == null) {
          if (authP.picture != null) {
            picture = authP.picture;
          } else {
            picture = unknownprofile;
          }
        }

        var newInterestsList = {};
        var interestsList = state.interestsList;
        Object.keys(interestsList).forEach((key) => {
          newInterestsList[key] = [];
          interestsList[key].forEach((item, index) => {
            var newItem = item;
            if (interests.includes(item.category)) {
              newItem = {
                id: item.category,
                value: true,
                category: item.category,
              };
            }
            newInterestsList[key].push(newItem);
          });
        });

        state = Object.assign({}, state, {
          parseProfile: action.payload.parse,
          interestsList: newInterestsList,
          aboutMe: aboutMe,
          funFact: funFact,
          userName: userName,
          picture: picture,
          userProfile: action.payload.auth,
          profilePrivate: profilePrivate,
          preferencesPrivate: preferencesPrivate,
          postsPrivate: false,
        });
      }

      return state;

    case SET_USER_PROFILE:
      state = Object.assign({}, state, {
        userProfile: action.payload,
      });
      return state;

    case ADD_GUIDE: {
      state = Object.assign({}, state, {
        plans: [...state.plans, action.payload],
      });

      const Plan = Parse.Object.extend("plans");
      const user = Parse.User.current();
      const myNewObject = new Plan();
      myNewObject.set("content", action.payload);
      myNewObject.set("userId", user.get("id"));
      myNewObject.set("user", user);
      myNewObject.set("private", state.postsPrivate);
      myNewObject.save().then(
        (result) => {
          if (typeof document !== "undefined") {
            var plans = user.get("plans");
            if (plans == null) {
              user.set("plans", [result.get("objectId")]);
            } else {
              plans.add(result.get("objectId"));
              user.saveInBackground();
            }
          }
        },
        (error) => {
          console.error("Error while creating plans ", error);
        }
      );
      return ValidityState;
    }

    case GET_USER_GUIDES:
      return state.plans;

    case UPDATE_PARSE_PROFILE:
      state = Object.assign({}, state, {
        [action.payload.type]: action.payload.value,
      });
      return state;

    case SAVE_PARSE_PROFILE: {
      const user = state.parseProfile;
      user.set("aboutMe", state.aboutMe);
      user.set("funFact", state.funFact);

      var newInterests = [];
      Object.keys(state.interestsList).forEach((key) => {
        state.interestsList[key].forEach((item, index) => {
          if (item.value === true) {
            newInterests.push(item.category);
          }
        });
      });

      user.set("interests", newInterests);
      user.set("picture", state.picture);
      user.set("profilePrivate", state.profilePrivate);
      user.set("preferencesPrivate", state.preferencesPrivate);
      user.save().then(
        (user) => {
          // Execute any logic that should take place after the object is saved.
          alert("Changes Saved");
        },
        (error) => {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert(
            "Failed to create new object, with error code: " + error.message
          );
        }
      );
      return state;
    }
    case GET_PARSE_PROFILE:
      return state.parseProfile;

    case GET_USER_PROFILE:
      return state.userProfile;

    default:
      return state;
  }
};

export default profile;
