import {
  LOAD_ALL_PARENT_TAGS,
  LOAD_ALL_TAGS,
  CREATE_TAG,
  CREATE_PARENT_TAG,
  CREATE_ERROR,
} from "./type";

const Parse = require("parse/node");
Parse.initialize("patback");
Parse.serverURL = "https://planatrip-back.herokuapp.com/parse";

export const loadAllTags = () => {
  console.log("loading all tags.....");
  return (dispatch) => {
    const Tags = Parse.Object.extend("tags");
    const query = new Parse.Query(Tags);
    query.find().then(
      (results) => {
        var arr = [];
        results.forEach(function(object) {
          var bod = {
            id: object.id,
            text: object.get("name"),
          };
          arr.push(bod);
        }, this);

        //note: only 100 hundred at a time, see offset
        dispatch({
          type: LOAD_ALL_TAGS,
          payload: arr,
        });
      },
      (error) => {
        console.error("Error while getting Tag: ", error);
      }
    );
  };
};

export const loadAllParentTags = () => {
  console.log("loading all parents.....");
  return (dispatch) => {
    const Tags = Parse.Object.extend("tagParents");
    const query = new Parse.Query(Tags);
    query.find().then(
      (results) => {
        var arr = [];
        results.forEach(function(object) {
          var bod = {
            id: object.id,
            text: object.get("name"),
          };
          arr.push(bod);
        }, this);
        dispatch({
          type: LOAD_ALL_PARENT_TAGS,
          payload: arr,
        });
      },
      (error) => {
        console.error("Error while getting Tag Parent: ", error);
      }
    );
  };
};

///look at how to create with associate parent by value, what happens when there's no parents?
export const createTag = (name, parent, description) => {
  return (dispatch) => {
    const Tags = Parse.Object.extend("tags");
    const myNewObject = new Tags();

    myNewObject.set("name", name);
    myNewObject.set("parent", parent);
    myNewObject.set("description", description);
    myNewObject.save().then(
      (result) => {
        if (typeof document !== "undefined") {
          console.log("Tags created", result);
          dispatch(getOneTag(result.id, "create"));
        }
      },
      (error) => {
        dispatch({
          type: CREATE_ERROR,
          message: error,
        });
        console.error("Error while creating Tags: ", error);
      }
    );
  };
};

export const getOneTag = (tagID, type) => {
  return (dispatch) => {
    const Tags = Parse.Object.extend("tags");
    const query = new Parse.Query(Tags);
    query.get(tagID).then(
      (object) => {
        var bod = {
          objectId: tagID,
          name: object.get("name"),
          description: object.get("description"),
        };

        if (typeof document !== "undefined") {
          dispatch({
            type: CREATE_TAG,
            payload: bod,
          });
        }
      },
      (error) => {
        dispatch({
          type: CREATE_ERROR,
          message: error,
        });
        console.error("Error while getting Tag: ", error);
      }
    );
  };
};

export const getOneParentTag = (tagID, type) => {
  return (dispatch) => {
    const Tags = Parse.Object.extend("tagParents");
    const query = new Parse.Query(Tags);
    query.get(tagID).then(
      (object) => {
        var bod = {
          objectId: tagID,
          name: object.get("name"),
        };

        if (typeof document !== "undefined") {
          dispatch({
            type: CREATE_PARENT_TAG,
            payload: bod,
          });
        }
      },
      (error) => {
        dispatch({
          type: CREATE_ERROR,
          message: error,
        });
        console.error("Error while getting Parent Tag: ", error);
      }
    );
  };
};

export const createParentTag = (name) => {
  return (dispatch) => {
    const Tags = Parse.Object.extend("tagParents");
    const myNewObject = new Tags();
    myNewObject.set("name", name);
    myNewObject.save().then(
      (result) => {
        if (typeof document !== "undefined") {
          console.log("Parent Tags created", result);
          dispatch(getOneParentTag(result.id, "create"));
        }
      },
      (error) => {
        dispatch({
          type: CREATE_ERROR,
          message: error,
        });
        console.error("Error while creating Tags: ", error);
      }
    );
  };
};

export const createParentTags = () => {
  console.log("Creating tags...");
  var parentTags = new Set();
  fetch("https://www.triposo.com/api/20190906/common_tag_labels.json")
    .then((response) => response.json())
    .then((data) => {
      // jsonData is parsed json object received from url
      data.results.forEach(function(item, index) {
        console.log("parent is  " + item.parents);
        item.parents.forEach(function(i, _) {
          if (parentTags.has(i) === false) {
            parentTags.add(i);
            const Tags = Parse.Object.extend("tagParents");
            var tag = new Tags();
            tag.set("name", i);
            tag.save().then(
              (result) => {
                if (typeof document !== "undefined") {
                  console.log("Parent Tags created", result);
                  //dispatch(getOneParentTag(result.id, "create"));
                }
              },
              (error) => {
                console.error("Error while creating Tags: ", error);
              }
            );
          }
        });
      });
    })
    .catch((error) => {
      // handle your errors here
      console.error(error);
    });
};

export const createTags = () => {
  console.log("Creating tags...");
  fetch("https://www.triposo.com/api/20190906/common_tag_labels.json")
    .then((response) => response.json())
    .then((data) => {
      // jsonData is parsed json object received from url
      data.results.forEach(function(item, index) {
        var tag = new Parse.Object("tags");

        // now let’s associate the authors with the book
        // remember, we created a "authors" relation on Book
        tag.set("name", item.name);
        tag.set("description", item.description);

        if (item.parents.length !== 0) {
          var relation = tag.relation("tagParents");

          item.parents.forEach(function(i, _) {
            const pTags = Parse.Object.extend("tagParents");
            const query = new Parse.Query(pTags);
            query.equalTo("name", i);

            query.find().then((results) => {
              relation.add(results[0].id);
            });
          });
        }

        tag.save().then(
          (result) => {
            if (typeof document !== "undefined") {
              console.log("tags created", result);

              //dispatch(getOneParentTag(result.id, "create"));
            }
          },
          (error) => {
            console.error("Error while creating Tags: ", error);
          }
        );
      });
    })
    .catch((error) => {
      // handle your errors here
      console.error(error);
    });
};
