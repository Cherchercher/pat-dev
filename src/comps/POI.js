import React from "react";
import Loading from "react-loading-animation";
import Snackbar from "material-ui/Snackbar";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles";
import { Map, CircleMarker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {
  Card,
  GridList,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  IconButton,
  GridListTile,
  Typography,
  GridListTileBar,
} from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import ActionGrade from "material-ui/svg-icons/action/grade";
import Share from "material-ui/svg-icons/social/share";
import ContentAdd from "material-ui/svg-icons/content/add";
import { Row } from "react-flexbox-grid";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import {
  Facebook,
  Twitter,
  Tumblr,
  Google,
  Linkedin,
  Mail,
  Pinterest,
} from "react-social-sharing";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";

const styles = (theme) => ({
  border: {
    margin: 6,
  },
  margin: {
    margin: 10,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  zCard: {
    zIndex: 999999999,
    height: "50px",
    width: "110%",
  },
  actions: {
    display: "flex",
  },
  map: {
    height: "380px",
    width: "95%",
    marginTop: 10,
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  name: { fontWeight: "bold" },
  root: {
    marginTop: "200px",
    [theme.breakpoints.up("md")]: {
      marginTop: "170px",
    },
    display: "flex",
    flexWrap: "wrap",
    width: "95%",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  rootreal: {
    marginTop: "180px",
    marginRight: "10px",
    marginLeft: "10px",
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
});

class POI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poiData: null,
      mounted: false,
      opening_hours: [],
      autoHideDuration: 4000,
      message: "Event added to your calendar",
      similarPlaces: [],
      image: null,
      place: "",
      open: false,
      flavorited: false,
      popShareOpen: false,
      saved: false,
      anchorShareEl: null,
    };
    this.scroll = this.scroll.bind(this);
    this.imageContainerRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
  }

  scroll(direction) {
    let far = (this.imageContainerRef.current.width / 2) * direction;
    let pos = this.imageContainerRef.current.scrollLeft + far;
    this.imageContainerRef.current.animate({ scrollLeft: pos }, 1000);
  }

  async componentDidMount() {
    const poi = await fetch(
      "https://planatripback-dev.herokuapp.com/triposo/poi/" +
        this.props.match.params.id
    );
    const result = await poi.json();

    if (typeof this.props.location.state !== "undefined") {
      const { image } = this.props.location.state;
      this.setState({ image: image });
    }
    this.setState({ poiData: result.results[0] });

    const similarPois = await fetch(
      "https://planatripback-dev.herokuapp.com/triposo/pois/" +
        result.results[0].location_id +
        "?tag_labels=" +
        result.results[0].tag_labels.join("|")
    );
    const similarPlaces = await similarPois.json();

    if (similarPlaces.length !== 0) {
      this.setState({ similarPlaces: similarPlaces.results });
    } else {
      this.setState({ similarPlaces: [] });
    }
    this.setState({ mounted: true });
  }

  // async componentWillMount() {
  //   const poi = await fetch(
  //     "https://planatripback-dev.herokuapp.com/triposo/poi/" +
  //       this.props.match.params.id
  //   );
  //   const result = await poi.json();

  //   if (typeof this.props.location.state !== "undefined") {
  //     const { image } = this.props.location.state;
  //     this.setState({ image: image });
  //   }
  //   this.setState({ poiData: result.results[0] });

  //   const similarPois = await fetch(
  //     "https://planatripback-dev.herokuapp.com/triposo/pois/" +
  //       result.results[0].location_id +
  //       "?tag_labels=" +
  //       result.results[0].tag_labels.join("|")
  //   );
  //   const similarPlaces = await similarPois.json();
  //   if (similarPlaces.length !== 0) {
  //     this.setState({ similarPlaces: similarPlaces.results });
  //   } else {
  //     this.setState({ similarPlaces: [] });
  //   }
  //   this.setState({ mounted: true });
  // }

  async componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      const poi = await fetch(
        "https://planatripback-dev.herokuapp.com/triposo/poi/" +
          nextProps.match.params.id
      );
      const result = await poi.json();
      if (typeof this.props.location.state !== "undefined") {
        const { image } = nextProps.location.state;
        this.setState({ image: image });
      }
      this.setState({ poiData: result.results[0] });

      const similarPois = await fetch(
        "https://planatripback-dev.herokuapp.com/triposo/pois/" +
          result.results[0].location_id +
          "?tag_labels=" +
          result.results[0].tag_labels.join("|")
      );
      const similarPlaces = await similarPois.json();

      if (similarPlaces.length !== 0) {
        this.setState({ similarPlaces: similarPlaces.results });
      } else {
        this.setState({ similarPlaces: [] });
      }
      this.setState({ mounted: true });
    }
  }

  handleChangeDuration = (event) => {
    const value = event.target.value;
    this.setState({
      autoHideDuration: value.length > 0 ? parseInt(value) : 0,
    });
  };

  handleEventRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = (place) => {
    this.setState({
      place: place,
    });
  };
  render() {
    const { anchorShareEl } = this.state;
    const popShareOpen = Boolean(anchorShareEl);
    const { classes } = this.props;
    var item = this.state.poiData;
    if (this.state.mounted) {
      let extra = {
        mon_open:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.mon &&
          item.opening_hours.days.mon[0] &&
          item.opening_hours.days.mon[0].start &&
          item.opening_hours.days.mon[0].start.hour
            ? item.opening_hours.days.mon[0].start.hour
            : "unknown",
        mon_close:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.mon &&
          item.opening_hours.days.mon[0] &&
          item.opening_hours.days.mon[0].end &&
          item.opening_hours.days.mon[0].end.hour
            ? item.opening_hours.days.mon[0].end.hour
            : "unknown",
        tue_open:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.tue &&
          item.opening_hours.days.tue[0] &&
          item.opening_hours.days.tue[0].start &&
          item.opening_hours.days.tue[0].start.hour
            ? item.opening_hours.days.tue[0].start.hour
            : "unknown",
        tue_close:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.tue &&
          item.opening_hours.days.tue[0] &&
          item.opening_hours.days.tue[0].end &&
          item.opening_hours.days.tue[0].end.hour
            ? item.opening_hours.days.tue[0].end.hour
            : "unknown",
        wed_open:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.wed &&
          item.opening_hours.days.wed[0] &&
          item.opening_hours.days.wed[0].start &&
          item.opening_hours.days.wed[0].start.hour
            ? item.opening_hours.days.wed[0].start.hour
            : "unknown",
        wed_close:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.wed &&
          item.opening_hours.days.wed[0] &&
          item.opening_hours.days.wed[0].end &&
          item.opening_hours.days.wed[0].end.hour
            ? item.opening_hours.days.wed[0].end.hour
            : "unknown",
        thu_open:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.thu &&
          item.opening_hours.days.thu[0] &&
          item.opening_hours.days.thu[0].start &&
          item.opening_hours.days.thu[0].start.hour
            ? item.opening_hours.days.thu[0].start.hour
            : "unknown",
        thu_close:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.thu &&
          item.opening_hours.days.thu[0] &&
          item.opening_hours.days.thu[0].end &&
          item.opening_hours.days.thu[0].end.hour
            ? item.opening_hours.days.thu[0].end.hour
            : "unknown",
        fri_open:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.fri &&
          item.opening_hours.days.fri[0] &&
          item.opening_hours.days.fri[0].start &&
          item.opening_hours.days.fri[0].start.hour
            ? item.opening_hours.days.fri[0].start.hour
            : "unknown",
        fri_close:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.fri &&
          item.opening_hours.days.fri[0] &&
          item.opening_hours.days.fri[0].end &&
          item.opening_hours.days.fri[0].end.hour
            ? item.opening_hours.days.fri[0].end.hour
            : "unknown",
        sat_open:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.sat &&
          item.opening_hours.days.sat[0] &&
          item.opening_hours.days.sat[0].start &&
          item.opening_hours.days.sat[0].start.hour
            ? item.opening_hours.days.sat[0].start.hour
            : "unknown",
        sat_close:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.sat &&
          item.opening_hours.days.sat[0] &&
          item.opening_hours.days.sat[0].end &&
          item.opening_hours.days.sat[0].end.hour
            ? item.opening_hours.days.sat[0].end.hour
            : "unknown",
        sun_open:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.sun &&
          item.opening_hours.days.sun[0] &&
          item.opening_hours.days.sun[0].start &&
          item.opening_hours.days.sun[0].start.hour
            ? item.opening_hours.days.sun[0].start.hour
            : "unknown",
        sun_close:
          item.opening_hours &&
          item.opening_hours.days &&
          item.opening_hours.days.sun &&
          item.opening_hours.days.sun[0] &&
          item.opening_hours.days.sun[0].end &&
          item.opening_hours.days.sun[0].end.hour
            ? item.opening_hours.days.sun[0].end.hour
            : "unknown",
      };

      const data = { ...item, ...extra };
      return (
        <div className={classes.rootreal}>
          <div className={classes.container}>
            <div className="row">
              <div className="col-md-5">
                <Card className={classes.margin}>
                  <CardHeader
                    title={data.name}
                    // subheader="September 14, 2016"
                  />

                  <Carousel infiniteLoop useKeyboardArrows autoPlay>
                    {data.images.map((item) => (
                      <div key={item.sizes.medium.url}>
                        {" "}
                        <img src={item.sizes.medium.url} />
                      </div>
                    ))}
                  </Carousel>
                  <CardContent>
                    <Typography component="p">{data.intro}</Typography>
                    {data.properties.map((item) =>
                      item.name !== "Hour" ? (
                        item.name !== "Website" ? (
                          <div className="row">
                            <div className="col-sm-4">
                              <b> {item.name} </b>
                            </div>
                            <div className="col-sm-8">
                              <p> {item.value} </p>
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-sm-4">
                              <b> {item.name} </b>
                            </div>
                            <div className="col-sm-8">
                              <a href={item.value}> {item.value} </a>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="row">
                          <div className="col-sm-4">
                            <b> {item.name} </b>
                          </div>
                          <div className="col-sm-8">
                            <p> {item.value} </p>
                          </div>
                          <p>
                            M: {data.mon_open} - {data.mon_close}
                            Tu: {data.tue_open} - {data.tue_close}
                            W: {data.wed_open} - {data.wed_close}
                            Th: {data.thu_open} - {data.thu_close} <br />
                            F: {data.fri_open} - {data.fri_close}
                            Sat: {data.sat_open} - {data.sat_close}
                            Sun: {data.sat_open} - {data.sun_close}
                          </p>
                        </div>
                      )
                    )}
                  </CardContent>
                  <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton
                      aria-owns={popShareOpen ? "share-popper" : undefined}
                      tooltip="Share"
                      color="primary"
                      touch={true}
                      tooltipPosition="bottom-right"
                      variant="extended"
                      onClick={this.handleShare}
                    >
                      <Share />
                    </IconButton>
                    <IconButton
                      tooltip="add to favorites"
                      touch={true}
                      tooltipPosition="bottom-left"
                      onClick={this.handleFavorite}
                    >
                      <ActionGrade
                        color={this.state.favorited ? "#2780e3" : ""}
                      />
                    </IconButton>

                    <IconButton
                      tooltip="add to my plan"
                      touch={true}
                      tooltipPosition="bottom-left"
                      onClick={this.handleAdd}
                    >
                      <ContentAdd color={this.state.saved ? "#2780e3" : ""} />
                    </IconButton>

                    <Popover
                      id="share-popper"
                      open={popShareOpen}
                      onClose={this.handleShareClose}
                      anchorEl={this.anchorShareEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transition
                    >
                      <Paper className={classes.Paper}>
                        <ClickAwayListener onClickAway={this.handleShareClose}>
                          <MenuList>
                            <Row style={{ margin: "0", padding: "0" }}>
                              <Facebook
                                style={{ width: "100px" }}
                                link="https://github.com"
                              />
                            </Row>
                            <Row style={{ margin: "0", padding: "0" }}>
                              <Twitter
                                style={{ width: "100px" }}
                                link="https://github.com"
                              />
                            </Row>
                            <Row style={{ margin: "0", padding: "0" }}>
                              <Tumblr
                                style={{ width: "100px" }}
                                link="https://github.com"
                              />
                            </Row>
                            <Row style={{ margin: "0", padding: "0" }}>
                              <Google
                                style={{ width: "100px" }}
                                link="https://github.com"
                              />
                            </Row>
                            <Row style={{ margin: "0", padding: "0" }}>
                              <Linkedin
                                style={{ width: "100px" }}
                                link="https://github.com"
                              />
                            </Row>
                            <Row style={{ margin: "0", padding: "0" }}>
                              <Mail
                                style={{ width: "100px" }}
                                link="https://github.com"
                              />
                            </Row>
                            <Row style={{ margin: "0", padding: "0" }}>
                              <Pinterest
                                style={{ width: "100px" }}
                                link="https://github.com"
                              />
                            </Row>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Popover>
                  </CardActions>
                </Card>
              </div>
              <div className="col-md-7" classNmae={classes.margin}>
                <Map
                  className={classes.map}
                  zoom={13}
                  center={[
                    data.coordinates.latitude,
                    data.coordinates.longitude,
                  ]}
                >
                  <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <CircleMarker
                    center={[
                      data.coordinates.latitude,
                      data.coordinates.longitude,
                    ]}
                    onMouseOver={(e) => {
                      e.target.openPopup();
                    }}
                    onMouseOut={(e) => {
                      e.target.closePopup();
                    }}
                  >
                    {" "}
                    <Popup>{data.name}</Popup>
                  </CircleMarker>
                  {this.state.similarPlaces.map((place, index) => {
                    return (
                      <CircleMarker
                        key={place.name}
                        center={[
                          place.coordinates.latitude,
                          place.coordinates.longitude,
                        ]}
                        fillOpacity={0.5}
                        stroke={false}
                        onMouseOver={(e) => {
                          e.target.openPopup();
                        }}
                        onMouseOut={(e) => {
                          e.target.closePopup();
                        }}
                        onClick={() => this.handleClick(place.name)}
                      >
                        <Popup>{place.name}</Popup>
                        {place.name === this.state.place && (
                          <Card className={classes.Zcard}>
                            <CardActionArea>
                              <CardMedia
                                className={classes.media}
                                image={place.images[0].sizes.medium.url}
                                title="Contemplative Reptile"
                              />
                              <CardContent>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="h2"
                                >
                                  {place.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  component="p"
                                >
                                  {place.snippet}
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                            <CardActions>
                              <Button size="small" color="primary">
                                Learn More
                              </Button>
                            </CardActions>
                          </Card>
                        )}
                      </CircleMarker>
                    );
                  })}
                </Map>
                <h4> More places like this: </h4>
                <div className={classes.root}>
                  <GridList className={classes.gridList} cols={2.5}>
                    {this.state.similarPlaces.map((tile) => {
                      return (
                        <GridListTile key={tile.images[0].sizes.medium.url}>
                          <img
                            src={tile.images[0].sizes.medium.url}
                            alt={tile.name}
                          />
                          <GridListTileBar
                            title={tile.name}
                            classes={{
                              root: classes.titleBar,
                              title: classes.title,
                            }}
                            actionIcon={
                              <IconButton aria-label={`star ${tile.name}`}>
                                <StarBorderIcon className={classes.title} />
                              </IconButton>
                            }
                          />
                        </GridListTile>
                      );
                    })}
                  </GridList>
                </div>
              </div>
            </div>
          </div>
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            action="undo"
            autoHideDuration={this.state.autoHideDuration}
            onActionClick={this.handleActionClick}
            onRequestClose={this.handleEventRequestClose}
          />
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

POI.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(POI);
