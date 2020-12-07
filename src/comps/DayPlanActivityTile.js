import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import GooglePlaces from "../api/GooglePlaces";
import noImage from "../assets/noimagefound.jpeg";
import { Link } from "react-router-dom";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: "auto",
  },
  name: {
    fontSize: "15px",
    color: "black",
    fontWeight: "bold",
  },
  snippet: {
    color: "black",
    fontSize: "15px",
  },
  icon: {
    margin: 6,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },

  image: {
    width: 225,
    height: 200,
  },
});

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
class DayPlanActivityTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityInfo: null,
      open: false,
      imgURL: null,
      GooglePlaces: new GooglePlaces(),
      location: "",
      imgLoaded: false,
      imgURLS: [],
      imgIndex: 1,
    };
  }

  handleClick = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleActionClick = () => {
    this.setState({
      open: false,
    });
    alert("Event removed from your calendar.");
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  getInfo() {
    return this.props.getActivity(this.state.activityInfo);
  }

  repeatStringNumTimes = (string, times) => {
    if (times === null) return "";
    if (times === 1) return string;
    else return string + this.repeatStringNumTimes(string, times - 1);
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.tile !== nextProps.data) {
      this.setState({ tile: nextProps.data });
    }
    if (this.state.location !== nextProps.data.name) {
      this.setState({ location: nextProps.data.name });
    }
    if (this.state.imgURLS !== nextProps.data.image) {
      if (nextProps.data.image !== null) {
        this.setState({ imgURLS: nextProps.data.image });
        this.setState({ imgURL: nextProps.data.image[0].sizes.medium.url });
      } else {
        this.onError();
      }
    }
  }

  componentDidMount() {
    this.setState({ tile: this.props.data });
    this.setState({ location: this.props.data.name });
    if (this.props.data.image != null) {
      this.setState({ imgURLS: this.props.data.image });
      this.setState({ imgURL: this.props.data.image[0].sizes.medium.url });
    } else {
      this.onError();
    }
  }

  async placeSearch() {
    var url = "googlePlaces/placeSearch/";
    if (isLocalhost === true) {
      url = "http://localhost:8000/googlePlaces/placeSearch/";
    }
    const resp = await fetch(url + this.state.location, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    var result = await resp.json();
    return result;
  }

  async idSearch(placeID) {
    var url = "googlePlaces/poiSearch/";
    if (isLocalhost === true) {
      url = "http://localhost:8000/googlePlaces/poiSearch/";
    }
    const resp = await fetch(url + placeID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    var result = await resp.json();
    return result;
  }

  //if there are still images, no need to call for more
  //if there are not images left, make a call
  //replace images inside of call
  //if there are still images, and already called, then
  async onError() {
    if (this.state.imgLoaded === false) {
      if (this.state.imgIndex >= this.state.imgURLS.length) {
        //const searchResult = await this.state.GooglePlaces.urlSearch(this.state.location);

        const searchResult = await this.placeSearch();

        if (searchResult.status === "OK") {
          const placeID = searchResult.results[0].place_id;

          const poiResult = await this.idSearch(placeID);
          //const poiResult = await this.state.GooglePlaces.poiSearch(placeID);
          if (poiResult.status === "OK") {
            try {
              const photoRef = poiResult.result.photos[0].photo_reference;
              const poiImage = this.state.GooglePlaces.imgSearch(photoRef, 400);
              const replaced = poiImage;
              this.setState({ imgURLS: poiResult.result.photos });
              this.setState({ imgIndex: 1 });
              this.setState({ imgURL: replaced });
              this.setState({ imgLoaded: true });
            } catch (e) {
              console.log(e);
            }
          } else {
            this.setState({ imgURL: noImage });
          }
        } else {
          this.setState({ imgURL: noImage });
        }
      } else {
        this.setState({
          imgURL: this.state.imgURLS[this.state.imgIndex].sizes.medium.url,
        });
        this.setState({ imgIndex: this.state.imgIndex + 1 });
      }
    } else {
      if (this.state.imgIndex >= this.state.imgURLS.length) {
        this.setState({ imgURL: noImage });
      } else {
        try {
          //a bug here
          const poiImage = this.state.GooglePlaces.imgSearch(
            this.state.imgURLS[this.state.imgIndex].photo_reference,
            400
          );

          this.setState({ imgURL: poiImage });
          this.setState({ imgIndex: this.state.imgIndex + 1 });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  render() {
    let tile = this.props.data;
    const { classes } = this.props;
    var price = this.repeatStringNumTimes("$", tile.price);

    return (
      <div className={classes.root}>
        <h3 className={classes.paragraph}> {tile.title} </h3>
        <Typography gutterBottom className={classes.snippet}>
          {tile.desc}
        </Typography>

        <Paper className={classes.paper}>
          <Grid container spacing={16}>
            <Link
              to={{
                pathname: `/poi/${tile.id}`,
                state: {
                  image: this.state.imgURL,
                },
              }}
            >
              <Grid item>
                <ButtonBase className={classes.image}>
                  <img
                    className={classes.img}
                    onError={this.onError.bind(this)}
                    alt="complex"
                    src={this.state.imgURL}
                  />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={16}>
                  <Grid item xs>
                    <Typography
                      gutterBottom
                      className={classes.name}
                      variant="subtitle1"
                    >
                      {tile.name}
                    </Typography>
                    <Typography gutterBottom className={classes.snippet}>
                      {tile.snippet}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">{price}</Typography>
                </Grid>
              </Grid>
            </Link>
          </Grid>
        </Paper>
      </div>
    );
  }
}

DayPlanActivityTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DayPlanActivityTile);
