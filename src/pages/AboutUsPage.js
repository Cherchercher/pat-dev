import React from "react";
import { Preloader } from "react-preloading-screen";
import Services from "../comps/HomeFive/Services";
import TagManager from "react-gtm-module";
import Footer from "../comps/Layout/Footer";
import "../css/home-five.css";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    marginRight: "10px",
    marginLeft: "10px",
    marginTop: "200px",
    [theme.breakpoints.up("md")]: {
      marginTop: "170px",
    },
  },
});

class AboutUsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
    };
  }

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  login() {
    this.props.auth.login();
  }

  authenticate() {
    var ret = this.props.auth.handleAuthentication();
    return ret;
  }

  async componentDidMount() {
    const tagManagerArgs = {
      gtmId: "GTM-N3RP2F7",
    };
    TagManager.initialize(tagManagerArgs);
    this.setState({ mounted: true });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Preloader>
          <Services />
          <Footer />
        </Preloader>
      </div>
    );
  }
}

export default withStyles(styles)(AboutUsPage);
