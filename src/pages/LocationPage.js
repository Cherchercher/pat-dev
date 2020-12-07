import React, { Component } from "react";
import PropTypes from "prop-types";
import Loading from "react-loading-animation";
import { withStyles } from "@material-ui/core/styles";
import TagManager from "react-gtm-module";
import Typography from "@material-ui/core/Typography";
import Triposo from "../api/Triposo";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import "../css/citybook.css";

//move credentials to hidden files

const styles = (theme) => ({
  root: {
    display: "flex",
    marginRight: "10px",
    marginLeft: "10px",
    marginTop: "170px",
    [theme.breakpoints.up("md")]: {
      marginTop: "150px",
    },
  },
  // root: {
  //   display: "flex",
  //   [theme.breakpoints.down("sm")]: {
  //     marginTop: "100px"
  //   },
  //   [theme.breakpoints.down("md")]: {
  //     marginTop: "180px"
  //   },
  //   [theme.breakpoints.up("md")]: {
  //     marginTop: "150px"
  //   },
  //   marginRight: "10px",
  //   marginLeft: "10px"
  // },
  menuButton: {
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  layout: {
    width: "auto",
    [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: "none",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },

  content: {
    flexGrow: 1,
    padding: 0,
  },
});

class LocationPage extends Component {
  constructor() {
    super();
    this.state = {
      mobileOpen: false,
      setMobileOpen: false,
      pageData: null,
      location_id: "Los_Angeles",
      location_name: "Los Angeles",
      noResult: true,
      type: "city",
      cities: [],
      mounted: false,
      pois: [], //hot only here
      hotels: [],
      costs: [],
      dayplans: [],
      flights: [],
    };
  }

  // componentWillMount() {
  //   this.unlisten = this.props.history.listen((location, action) => {});
  // }

  toDayPlan(e, id, name) {
    e.preventDefault();

    this.props.history.push(`/dayplan?location_id=${id}&location_name=${name}`);
  }

  // componentWillUnmount() {
  //   this.unlisten();
  // }

  async componentDidMount() {
    const tagManagerArgs = {
      gtmId: "GTM-N3RP2F7",
    };
    TagManager.initialize(tagManagerArgs);
    try {
      // const start = this.props.date.start_date;
      // const end = this.props.date.end_date;
      const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
        searchParams = new URLSearchParams(queryParamsString);
      var location_id = searchParams.get("location_id");
      var location_name = searchParams.get("location_name");
      var type = searchParams.get("type");

      if (location_id === "null") {
        location_id = "Los_Angeles";
      }
      if (location_name === "null") {
        location_name = "Los Angeles";
      }
      if (type === "null") {
        type = "city";
      }

      // const suggestionsList = await fetch(
      //   "https://planatripback-dev.herokuapp.com/triposo/location/" +
      //     location_id +
      //     "/" +
      //     type
      // );

      console.log(location_id, type);
      const results = await this.props.Triposo.getLocationInfo(
        location_id,
        type
      );
      console.log(results);
      const cities = await this.props.Triposo.getCitiesInCountry(location_id);

      // const cityList = await fetch(
      //   "https://planatripback-dev.herokuapp.com/triposo/cities/" + location_id
      // );

      if (results.error) {
        this.setState({
          noResult: true,
        });
      } else {
        this.setState({
          pageData: results,
          mounted: true,
          noResult: false,
          cities: cities.results,
          type: type,
          location_id: location_id,
          location_name: location_name,
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({ noResult: true });
    }
  }

  //   <section
  //   className="scroll-con-sec hero-section"
  //   data-scrollax-parent="true"
  //   id="sec1"
  // >
  //   <div
  //     className="overlay-width-70"
  //     style={{
  //       backgroundImage: `url(${location.images[0].sizes["medium"]["url"]})`
  //     }}
  //   ></div>
  //   <div className="hero-section-wrap fl-wrap">
  //     <div className="container">
  //       <div className="intro-item fl-wrap">
  //         <h2> {location_name} </h2>
  //         <p> {location.intro} </p>
  //       </div>
  //       <div className="main-search-input-wrap">
  //         <div className="main-search-input fl-wrap"></div>
  //       </div>
  //     </div>
  //   </div>
  // </section>

  render() {
    if (this.state.mounted) {
      const location = this.state.pageData.results[0];
      const { classes } = this.props;
      // var { pageData, noResult, location_name } = this.state;
      const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
        searchParams = new URLSearchParams(queryParamsString);
      const location_name = searchParams.get("location_name");
      const type = searchParams.get("type");
      if (type !== "city") {
        return (
          <React.Fragment>
            <main className={classes.root}>
              <div className={classes.layout}>
                <Grid container spacing={2}>
                  {this.state.cities.map((card) => (
                    <Grid item key={card} sm={6}>
                      <div
                        onClick={(e) => this.toDayPlan(e, card.id, card.title)}
                      >
                        <Card className={classes.card}>
                          <CardMedia
                            className={classes.cardMedia}
                            image={card.images[0].sizes.medium.url}
                            title={card.name}
                          />
                          <CardContent className={classes.cardContent}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {card.name}
                            </Typography>
                            <Typography>{card.snippet}</Typography>
                          </CardContent>
                          <CardActions>
                            <Button size="small" color="primary">
                              Learn more
                            </Button>
                          </CardActions>
                        </Card>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </main>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            {/* <main className={classes.root}>
              <div className={classes.layout}>
                <section
                  className="parallax-section"
                  data-scrollax-parent="true"
                  id="sec1"
                >
                  <div
                    data-scrollax="properties: { translateY: '30%' }"
                    className="overlay-width-70"
                    style={{
                      backgroundImage: `url(${location.images[0].sizes["medium"]["url"]})`,
                    }}
                  ></div>
                  <div className="overlay"></div>
                  <div className="container">
                    <div className="section-title">
                      <h2>{location_name}</h2>
                      <div className="section-subtitle">{location_name}</div>
                      <span className="section-separator"></span>
                      <h3>{location.snippet}</h3>
                    </div>
                    <div className="section-title center-align">
                      <div className="breadcrumbs fl-wrap">
                        <a href="#">Art</a>
                        <span>Cuisine</span>
                      </div>
                      <span className="section-separator"></span>
                    </div>
                  </div>
                  <div className="header-sec-link">
                    <div className="container">
                      <a href="#sec2" className="custom-scroll-link">
                        Let's Go
                      </a>
                    </div>
                  </div>
                </section>

                <section id="sec2">
                  <div className="container">
                    <div className="section-title">
                      <h2>Featured Categories</h2>
                      <div className="section-subtitle">
                        Catalog of Categories
                      </div>
                      <span className="section-separator"></span>
                      <p>{location.snippet}</p>
                    </div>

                    <div className="gallery-items fl-wrap mr-bot spad">
                      <div className="gallery-item">
                        <div className="grid-item-holder">
                          <div className="listing-item-grid">
                            <img src="images/all/1.jpg" alt="" />
                            <div className="listing-counter">
                              <span>10+ </span> Point of Interests
                            </div>
                            <div className="listing-item-cat">
                              <h3>
                                <a href="listing.html"></a>
                              </h3>
                              <p>
                                Say goodbye to FOMO. View popular places to
                                visit, local hotspots, and personalized
                                recommendations based on your interest.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="gallery-item gallery-item-second">
                        <div className="grid-item-holder">
                          <div className="listing-item-grid">
                            <img src="images/bg/1.jpg" alt="" />
                            <div className="listing-counter">
                              <span>View </span> Plans
                            </div>
                            <div className="listing-item-cat">
                              <h3>
                                <a href="listing.html">Plans</a>
                              </h3>
                              <p>
                                AI generated + inspiring plans shared by your
                                community
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="gallery-item">
                        <div className="grid-item-holder">
                          <div className="listing-item-grid">
                            <img src="images/all/1.jpg" alt="" />
                            <div className="listing-counter">
                              <span>20+ </span> Data Points
                            </div>
                            <div className="listing-item-cat">
                              <h3>
                                <a href="listing.html">Cost</a>
                              </h3>
                              <p>
                                Cost of your trip estimated from historical
                                travel data. View cost by categories, adjusted
                                to your spending habbits.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="gallery-item">
                        <div className="grid-item-holder">
                          <div className="listing-item-grid">
                            <img
                              src="../assets/images/accomondations.jpg"
                              alt=""
                            />
                            <div className="listing-counter">
                              <span>10+ </span> Accomondations
                            </div>
                            <div className="listing-item-cat">
                              <h3>
                                <a href="listing.html">
                                  Hotels, Lodges, Airbnb
                                </a>
                              </h3>
                              <p>
                                There is an accomondation for every type of
                                traveler.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="gallery-item">
                        <div className="grid-item-holder">
                          <div className="listing-item-grid">
                            <img src="../assets/images/fomo.jpg" alt="" />
                            <div className="listing-counter">
                              <span>100+ </span> items
                            </div>
                            <div className="listing-item-cat">
                              <h3>
                                <a href="listing.html">Shop - Store</a>
                              </h3>
                              <p>
                                Pack all that you need for your trip. Go hiking,
                                surfing, partying, no second thought needed.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

            {/* 
                //             <a href="listing.html" className="btn  big-btn circle-btn dec-btn  color-bg flat-btn">View All<i className="fa fa-eye"></i></a>
                // */}
            {/* </section> */}

            {/* <div className="container">
              <div className="row">
                <h3 className="ml-4">Day Plans</h3>
              </div> */}

            {/* <GridList style={styles.gridList} cols={2.2}>
                {data.map(tile => {
                  return (
                    <ActivityTile
                      data={tile}
                      styles={styles}
                      getActivity={this.getActivity}
                    />
                  );
                })}
              </GridList> */}
            {/* </div>

              <div className="container">
              <div className="row">
                <h3 className="ml-4">Day Plans</h3>
              </div> */}

            {/* <GridList style={styles.gridList} cols={2.2}>
                {data.map(tile => {
                  return (
                    <ActivityTile
                      data={tile}
                      styles={styles}
                      getActivity={this.getActivity}
                    />
                  );
                })}
              </GridList> */}
            {/* </div>

              <div className="container">
              <div className="row">
                <h3 className="ml-4">Point of Interests</h3>
              </div> */}

            {/* <GridList style={styles.gridList} cols={2.2}>
                {data.map(tile => {
                  return (
                    <ActivityTile
                      data={tile}
                      styles={styles}
                      getActivity={this.getActivity}
                    />
                  );
                })}
              </GridList> */}
            {/* </div> */}
            {/* </div>
            </main> */}
            {/* Footer */}
            <footer className={classes.footer}>
              <Typography variant="h6" align="center" gutterBottom>
                @CopyRight 2020
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                color="textSecondary"
                component="p"
              >
                Plan A Trip Co.
              </Typography>
            </footer>
            {/* End footer */}
          </React.Fragment>
        );
      }
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state, props) {
  return {
    date: state.date,
  };
}

LocationPage.propTypes = {
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, null)(LocationPage));
