var express = require("express");
var router = express.Router();
var request = require("request");
const key = "AIzaSyCb-9HOKDBFQEkgP4zrBR39ZJWsqd4kieY";

router.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to GooglePlaces."
  })
);

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

module.exports = router;
