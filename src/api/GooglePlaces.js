class GooglePlaces {
  constructor() {
    this.url = "https://maps.googleapis.com/maps/api/place/autoComplete/json?&";
    this.urlPOI =
      "https://maps.googleapis.com/maps/api/place/details/json?fields=address_component,opening_hours,permanently_closed,photo,place_id,price_level,rating,reviews,website&";
    this.urlI = "https://maps.googleapis.com/maps/api/place/photo?&";
    this.urlS =
      "https://maps.googleapis.com/maps/api/place/textsearch/json?fields=opening_hours,photos,rating&";
    this.key = "AIzaSyAXOedTm7yShJ7dXPFEvK2lLxXmwscSQQc";
  }

  async urlSearch(query) {
    const result = await fetch(
      this.urlS + "query=" + query + "&key=" + this.key,
      this.options
    );
    return result.json();
  }

  async citySearch(query) {
    const result = await fetch(this.url + "input=" + query + "&types=(cities)");
    return result.json();
  }

  imgSearch(photoRef, maxHeight) {
    const result =
      this.urlI +
      "maxwidth=" +
      maxHeight +
      "&photoreference=" +
      photoRef +
      "&key=" +
      this.key;
    return result;
  }

  async poiSearch(place_id) {
    const result = await fetch(
      this.urlPOI + "placeid=" + place_id + "&key=" + this.key,
      this.options
    );
    return result.json();
  }
  //https://maps.googleapis.com/maps/api/place/details/json?fields=address_component,opening_hours,permanently_closed,photo,place_id,price_level,rating,reviews[],website
}

export default GooglePlaces;
