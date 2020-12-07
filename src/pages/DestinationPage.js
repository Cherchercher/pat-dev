import React from "react";
import Triposo from "../api/Triposo";
import CostHighlights from "../comps/CostHighlights";
import Loading from "react-loading-animation";
import noImage from "../assets/noimagefound.jpeg";
import BudgetYourTrip from "../api/BudgetYourTrip";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../css/destinationPage.scss";

//Temporarily store data here
const PostsData = [
  {
    category: "News",
    title: "CNN Acquire BEME",
    text: "CNN purchased Casey Neistat's Beme app for $25million.",
    image: "https://source.unsplash.com/user/erondu/600x400",
  },
  {
    category: "Travel",
    title: "Nomad Lifestyle",
    text: "Learn our tips and tricks on living a nomadic lifestyle",
    image: "https://source.unsplash.com/user/_vickyreyes/600x400",
  },
  {
    category: "Development",
    title: "React and the WP-API",
    text: "The first ever decoupled starter theme for React & the WP-API",
    image: "https://source.unsplash.com/user/ilyapavlov/600x400",
  },
  {
    category: "News",
    title: "CNN Acquire BEME",
    text: "CNN purchased Casey Neistat's Beme app for $25million.",
    image: "https://source.unsplash.com/user/erondu/600x400",
  },
  {
    category: "Travel",
    title: "Nomad Lifestyle",
    text: "Learn our tips and tricks on living a nomadic lifestyle",
    image: "https://source.unsplash.com/user/_vickyreyes/600x400",
  },
  {
    category: "Development",
    title: "React and the WP-API",
    text: "The first ever decoupled starter theme for React & the WP-API",
    image: "https://source.unsplash.com/user/ilyapavlov/600x400",
  },
];

const styles = (theme) => ({
  root: {
    // display: "flex",
    // marginRight: "10px",
    // marginLeft: "15%",
    marginTop: "170px",
    [theme.breakpoints.up("md")]: {
      marginTop: "150px",
    },
  },
});

class DestinationPage extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      hotspots: [],
      hotels: [],
      costs: [],
      dayplans: [],
      flights: [],
      hotelsReady: false,
      hotspotsReady: false,
      locationInfo: "",
      //cost
      BudgetYourTrip: new BudgetYourTrip(),
      budgetData: [],
      budget: [],
      spend: "Medium",
      currency: "USD",
      costHighlights: [],
      costReady: false,
    };
  }
  handleChangeBudget = (event) => {
    this.setState({ spend: event.target.value });
    if (event.target.value === "Luxury") {
      this.setState({ budget: this.state.budgetData.valueLux });
    } else if (event.target.value === "Budget") {
      this.setState({ budget: this.state.budgetData.valueBudget });
    } else {
      this.setState({ budget: this.state.budgetData.valueMid });
    }
  };
  async componentDidMount() {
    const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
      searchParams = new URLSearchParams(queryParamsString);
    var location_id = searchParams.get("location_id");
    var location_name = searchParams.get("location_name");
    var type = searchParams.get("type");

    if (location_id === null) {
      location_id = "Los_Angeles";
    }
    if (location_name === null) {
      location_name = "Los Angeles";
    }
    if (type === null) {
      type = "city";
    }

    this.setState({
      location_id: location_id,
      location_name: location_name,
    });
    let locationInfo;
    try {
      // const start = this.props.date.start_date;
      // const end = this.props.date.end_date;

      const results = await this.props.Triposo.getLocationInfo(
        location_id,
        type
      );
      locationInfo = results.results[0];

      this.setState({
        posts: PostsData,
        locationInfo: locationInfo,
        locationInfoReady: true,
      });

      try {
        const hotspots = await this.props.Triposo.getHot(
          locationInfo.coordinates.latitude,
          locationInfo.coordinates.longitude
        );
        console.log(hotspots.results[0].pois);
        this.setState({
          hotspots: hotspots.results[0].pois,
          hotspotsReady: true,
        });
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }

    try {
      const hotels = await this.props.Triposo.getHotel(location_id);
      this.setState({
        hotels: hotels.results,
        hotelsReady: true,
      });
    } catch (e) {
      console.log(e);
    }

    try {
      const geoId = await this.state.BudgetYourTrip.getIdByName(location_name);
      if (geoId.status === true) {
        var toquery = geoId.data[0].geonameid;
        for (var i = 0; i < geoId.data.length; i++) {
          if (geoId.data[i].asciiname === location_name) {
            toquery = geoId.data[i].geonameid;
          }
        }
      }

      const budgets = await this.state.BudgetYourTrip.getBudgetById(toquery);
      const costHighlights = await this.state.BudgetYourTrip.getHighlightById(
        toquery
      );

      this.setState({ costHighlights: costHighlights });
      const costs = budgets.data.costs;
      var costArr = [{}];
      for (let i = 0; i < costs.length; i++) {
        const catID = costs[i].category_id;
        const catInfo = this.state.BudgetYourTrip.catDict[catID];
        const costInfo = Object.assign({}, costs[i], catInfo);
        costArr[i] = costInfo;
      }

      const currency = budgets.data.info.currency_code;
      let cat = [];
      let valueBudget = [];
      let valueMid = [];
      let valueLux = [];

      costArr.map((data) => {
        valueMid.push(Math.round(data.value_midrange));
        valueBudget.push(Math.round(data.value_budget));
        valueLux.push(Math.round(data.value_luxury));
        cat.push(data.name);
      });
      let budget = {
        cat: cat,
        valueBudget: valueBudget,
        valueMid: valueMid,
        valueLux: valueLux,
        currency: currency,
      };
      this.setState({ budgetData: budget, budget: valueMid, costReady: true });
      console.log(budget, valueMid);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { classes } = this.props;
    const {
      location_name,
      locationInfo,
      locationInfoReady,
      hotelsReady,
      hotels,
      hotspots,
      hotspotsReady,
    } = this.state;
    console.log(location_name);
    const renderLocationInfo = () => {
      if (locationInfoReady) {
        return <Intro location_name={location_name} location={locationInfo} />;
      } else {
        return <Loading />;
      }
    };
    const renderHotels = () => {
      if (hotelsReady) {
        return (
          <div>
            <Title title="Hotels" link="poi" />
            <div className="app-card-list marginLeft15" id="app-card-list">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  index={hotel.id}
                  intro={hotel.snippet}
                  name={hotel.name}
                  coordinates={hotel.coordinates}
                  image={
                    hotel.images && hotel.images.length > 1
                      ? hotel.images[0].sizes.medium.url
                      : noImage
                  }
                />
              ))}
            </div>
          </div>
        );
      } else {
        return <Loading />;
      }
    };
    const renderHotspots = () => {
      if (hotspotsReady) {
        console.log(hotspots);
        return (
          <div>
            <Title title="Local Favorates" link="poi" />
            <div className="app-card-list" id="app-card-list">
              {hotspots.map((hotspot) => (
                <HotelCard
                  key={hotspot.id}
                  index={hotspot.id}
                  intro={hotspot.snippet}
                  name={hotspot.name}
                  coordinates={hotspot.coordinates}
                  image={
                    hotspot.images && hotspot.images.length > 1
                      ? hotspot.images[0].sizes.medium.url
                      : noImage
                  }
                />
              ))}
            </div>
          </div>
        );
      } else {
        return null;
      }
    };
    return (
      <div className={classes.root}>
        {renderLocationInfo()}
        {/* <header className="app-header"></header> */}
        <Title title="Point of Interests" link="poi" />
        <div className="app-card-list" id="app-card-list">
          {Object.keys(this.state.posts).map((key) => (
            <Card key={key} index={key} details={this.state.posts[key]} />
          ))}
        </div>
        {renderHotels()}
        {renderHotspots()}
      </div>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
      <div className="app-title-content">
        <h3>{this.props.title}</h3>
        <a> view more</a>
      </div>
    );
  }
}

class Intro extends React.Component {
  render() {
    const image =
      this.props.location.images && this.props.location.images.length > 1
        ? this.props.location.images[0].sizes.medium.url
        : noImage;
    return (
      <section>
        <div
          data-scrollax="properties: { translateY: '30%' }"
          className="overlay-width-70"
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="overlay"></div>
        <div className="marginLeft15">
          <div className="flex marginBottom15">
            <h3>{this.props.location_name}</h3>
            <button className="floatRight btn marginLeft15 marginTop15">
              <FontAwesomeIcon icon={faTasks} className="marginRight10" />
              Start Planning
            </button>
          </div>
          <p>{this.props.location.snippet}</p>
          <div className="flex">
            learn more:
            <div className="">
              <a href="#">Art</a>
              <a href="#">Cuisine</a>
              <a href="#">Cost</a>
              <a href="#">Best Time to visit</a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class Button extends React.Component {
  render() {
    return (
      <button className="btn">
        <FontAwesomeIcon icon={faChevronRight} className="marginRight10" />
        Find out more
      </button>
    );
  }
}

class CardHeader extends React.Component {
  render() {
    const { image, category } = this.props;
    var style = {
      backgroundImage: "url(" + image + ")",
      backgroundRepeat: "no-repeat",
      height: "200px",
      width: "328px",
    };
    return (
      <header style={style} className="card-header">
        <h4 className="card-header--title"></h4>
      </header>
    );
  }
}

class CardBody extends React.Component {
  render() {
    return (
      <div className="card-body">
        {/* <p className="date">hi</p> */}

        <h5>{this.props.title}</h5>

        <p className="body-content">{this.props.text}</p>

        <Button />
      </div>
    );
  }
}

class Card extends React.Component {
  render() {
    return (
      <article className="card">
        <CardHeader
          category={this.props.details.category}
          image={this.props.details.image}
        />
        <CardBody
          title={this.props.details.title}
          text={this.props.details.text}
        />
      </article>
    );
  }
}

class HotelCard extends React.Component {
  render() {
    return (
      <article className="card">
        <CardHeader category={this.props.intro} image={this.props.image} />
        <CardBody title={this.props.name} text={this.props.intro} />
      </article>
    );
  }
}

export default withStyles(styles)(DestinationPage);
