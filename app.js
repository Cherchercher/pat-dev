const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
var Parse = require('parse/node');
Parse.initialize("ZlJZGB7g0phrJTLXXRryz0mGpCyI5Y5ixC6byakE", "jb1TCY18UIAw34LFmPmbXwrsdl1ksGKAMAROGMKe");
//javascriptKey is required only if you have it on server.

Parse.serverURL = 'https://goplanatrip.back4app.io'

const app = express();
var cors = require("cors");
app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

var request = require("request");

/* GET all posts. */
app.get("/posts", function(req, res, next) {
  request(
    {
      headers: {
        "X-Parse-Application-Id": "ZlJZGB7g0phrJTLXXRryz0mGpCyI5Y5ixC6byakE",
        "X-Parse-REST-API-Key": "jb1TCY18UIAw34LFmPmbXwrsdl1ksGKAMAROGMKe"
      },
      uri: "https://goplanatrip.back4app.io/classes/Posts",
      method: "GET"
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) res.send(JSON.parse(body));
      else {
        res.send({ statusText: JSON.parse(error) });
      }
    }
  );
});

app.post("/posts", function(req, res, next) {
  request(
    {
      headers: {
        "X-Parse-Application-Id": "ZlJZGB7g0phrJTLXXRryz0mGpCyI5Y5ixC6byakE",
        "X-Parse-REST-API-Key": "jb1TCY18UIAw34LFmPmbXwrsdl1ksGKAMAROGMKe"
      },
      uri: "https://goplanatrip.back4app.io/classes/Posts",
      method: "POST",
      body: req.body
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) res.json(body);
      else {
        res.send({ statusText: JSON.parse(error) });
      }
    }
  );
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

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// Load environment variables from .env
var dotenv = require("dotenv");
dotenv.config();

module.exports = app;
