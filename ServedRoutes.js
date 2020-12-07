var request = require("request");
var url = require("url");
const app = express();
const post = require("./server/models/posts.model");
const dayplan = require("./server/models/dayplan.model");
const googlePlaces = require("./server/models/googlePlaces.model");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/test", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness."
  })
);

app.get("/callback", function(req, res, next) {
  res.redirect("/");
});

app.get("/triposo/:place", async (req, res) => {
  var query = req.params.place;
  await dayplan
    .get()
    .then(posts => res.json(posts))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

app.get("/googlePlaces/placeSearch/:place", async (req, res) => {
  var query = req.params.place;
  await googlePlaces
    .getPlaceByID(query)
    .then(place => res.json(place))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});
/*
app.get("/urlSearch/:place", (req, res) => {
  var key = "AIzaSyCb-9HOKDBFQEkgP4zrBR39ZJWsqd4kieY";
  var query = req.params.place;
  var fields = "opening_hours,photos,rating";
  var url =
    "https://maps.googleapis.com/maps/api/place/textsearch/json?&query=" +
    query +
    "&key=" +
    key +
    "&fields=" +
    fields;
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) res.send(JSON.parse(body));
    else {
      res.send(error);
    }
  });
});

/* All posts */
app.get("/posts", async (req, res) => {
  await post
    .getPosts()
    .then(posts => res.json(posts))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

app.get("/poiSearch/:id", (req, res) => {
  var key = "AIzaSyCb-9HOKDBFQEkgP4zrBR39ZJWsqd4kieY";
  var query = req.params.id;
  request(
    "https://maps.googleapis.com/maps/api/place/details/json?fields=address_component,opening_hours,permanently_closed,photo,place_id,price_level,rating,reviews,website&placeid=" +
      query +
      "&key=" +
      key,
    function(error, response, body) {
      if (!error && response.statusCode === 200) res.send(JSON.parse(body));
      else {
        res.send(error);
      }
    }
  );
});

app.post("/add/plan", function(req, res) {
  var infoUser = req.body;
  var user = new Parse.User();
  user.set("username", infoUser.usernameRegister);
  user.set("password", infoUser.passwordRegister);
  user.set("email", infoUser.emailRegister);
  user.signUp(null, {
    success: function(user) {
      res.render("index", {
        loginMessage: "",
        RegisterMessage: "User created!",
        typeStatus: "success",
        infoUser: infoUser
      });
    },
    error: function(user, error) {
      res.render("index", {
        loginMessage: "",
        RegisterMessage: error.message,
        typeStatus: "danger",
        infoUser: infoUser
      });
    }
  });
});
