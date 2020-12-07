import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Snackbar from "material-ui/Snackbar";
import DayPlanActivityTile from "../comps/DayPlanActivityTile";
import "../css/activitypage.css";
import ActionGrade from "material-ui/svg-icons/action/grade";
import IconButton from "material-ui/IconButton";
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

/*
href="https://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2Fsharingbuttons.io&amp;title=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;summary=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;source=http%3A%2F%2Fsharingbuttons.io" 
href="https://facebook.com/sharer/sharer.php?u=http%3A%2F%2Fsharingbuttons.io"


href="https://twitter.com/intent/tweet/?text=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;url=http%3A%2F%2Fsharingbuttons.io"

href="https://plus.google.com/share?url=http%3A%2F%2Fsharingbuttons.io" 

href="https://www.tumblr.com/widgets/share/tool?posttype=link&amp;title=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;caption=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;content=http%3A%2F%2Fsharingbuttons.io&amp;canonicalUrl=http%3A%2F%2Fsharingbuttons.io&amp;shareSource=tumblr_share_button"


href="mailto:?subject=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;body=http%3A%2F%2Fsharingbuttons.io" 
 href="https://pinterest.com/pin/create/button/?url=http%3A%2F%2Fsharingbuttons.io&amp;media=http%3A%2F%2Fsharingbuttons.io&amp;description=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking."
 
*/
const notify = (msg) => {
  toast(msg, {
    position: "bottom-right",
  });
};
const styles = (theme) => ({
  tapDisplay: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  blue: {
    color: "#2780e3",
  },
  typography: {
    padding: theme.spacing.unit * 2,
    margin: "auto",
  },

  titleStyle: {
    color: "rgb(0, 188, 212)",
  },

  paper: {
    padding: theme.spacing.unit * 2,
    margin: "auto",
    zIndex: "100",
  },
});

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      autoHideDuration: 4000,
      message: "Plan added to your calendar",
      mounted: false,
      open: false,
      flavorited: false,
      popShareOpen: false,
      saved: false,
      anchorShareEl: null,
      noResult: false,
      apiData: [],
      location: "San Francisco",
    };

    this.getPlanInfo = this.getPlanInfo.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.noResult !== nextProps.noResult) {
      this.setState({ noResult: nextProps.noResult });
    }
    if (this.state.apiData !== nextProps.data) {
      this.setState({ apiData: nextProps.data });
    }

    if (
      this.state.location !== nextProps.location &&
      nextProps.location !== null
    ) {
      this.setState({ location: nextProps.location });
    }
    this.setState({ mounted: true });
  }

  getPlanInfo() {
    this.setState({
      open: true,
    });
  }
  /*this.state.back4app.create("Plan", {
      start: new Date(data.days[0].date + "Z"),
      end: new Date(data.days[data.days.length - 1].date + "Z"),
      days: data.days.length,
      location: data.location.name,
      spend: this.state.budget,
      userID: localStorage.getItem("id_token")
    });*/
  handleShare = (event) => {
    this.setState({
      anchorShareEl: event.currentTarget,
    });
  };

  handleAdd = () => {
    let saved = this.state.saved;
    if (!saved) {
      notify("added to plan");
    }
    this.setState({
      saved: !saved,
    });
  };

  handleFavorite = () => {
    let favorited = this.state.favorited;
    if (!favorited) {
      notify("added to flavorited");
    }

    this.setState({
      favorited: !favorited,
    });
  };

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

  handleTapChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleActionClick = () => {
    this.setState({
      open: false,
    });
    alert("Event removed from your calendar.");
  };

  handleShareClose = () => {
    this.setState({
      anchorShareEl: null,
    });
  };

  render() {
    const { classes } = this.props;
    let apiData = [];
    let dateData = [];
    const { anchorShareEl } = this.state;
    const popShareOpen = Boolean(anchorShareEl);

    if (this.props.noResult === false) {
      for (let i = 0; i < this.props.data.results[0].days.length; i++) {
        apiData[i] = [];
        for (
          let j = 0;
          j < this.props.data.results[0].days[i].itinerary_items.length;
          j++
        ) {
          var poi = this.props.data.results[0].days[i].itinerary_items[j];
          let item = poi.poi;
          let imageSource = item.images.length === 0 ? null : item.images;
          let data = {
            date: this.props.data.results[0].days[i].date,
            icons: [],
            id: item.id,
            name: item.name,
            title: poi.title,
            snippet: item.snippet,
            desc: poi.description,
            coordinates: item.coordinates,
            language: item.snippet_language_info,
            image: imageSource,
            price: item.price_tier,
          };

          apiData[i].push(data);
        }
        dateData.push(this.props.data.results[0].days[i].date);
      }
      return (
        <div>
          <div className={classes.tapDisplay}>
            <AppBar position="static" color="white">
              <Tabs
                value={this.state.tabValue}
                onChange={this.handleTapChange}
                indicatorColor="primary"
                textColor="primary"
                scrollable
                scrollButtons="auto"
              >
                {apiData.map((data, index) => (
                  <Tab label={"Day " + (index + 1)} />
                ))}
                <div>
                  {" "}
                  <div>
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
                  </div>
                </div>
              </Tabs>
            </AppBar>
            {apiData.map(
              (data, index) =>
                this.state.tabValue === index &&
                data.map((tile, j) => (
                  <DayPlanActivityTile data={tile} className={classes} />
                ))
            )}
          </div>

          <Snackbar
            open={this.state.open}
            message={this.state.message}
            action="undo"
            autoHideDuration={this.state.autoHideDuration}
            onActionClick={this.handleActionClick}
            onRequestClose={this.handleEventRequestClose}
          />
          <ToastContainer />
        </div>
      );
    } else {
      return (
        <div>
          <h5> No results found.</h5>
          <p> - Check if your spelling is correct </p>
          <p> - Explore destinations </p>
          <p> - Contact us </p>
        </div>
      );
    }
  }

  //.value_midrange;
  //let cost = this.calculateCost(costMid,dateData.length);
  //1 image name, reviews,adored by, more info (hang).
  //Inside: Bookings for activities, or more for (breakfast).
}

Day.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Day);
