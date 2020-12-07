import RadialChart from "../comps/RadialChart";
import CostHighlights from "../comps/CostHighlights";
import BudgetYourTrip from "../api/BudgetYourTrip";
import React from "react";
import Loading from "react-loading-animation";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const styles = (theme) => ({
  root: {
    marginRight: "10px",
    marginLeft: "10px",
    marginTop: "200px",
    [theme.breakpoints.up("md")]: {
      marginTop: "170px",
    },
  },
  highlights: {
    maxWidth: 600,
  },
  select: {
    marginTop: "20px",
    marginRight: "10px",
    marginLeft: "10px",
  },
});

class CostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      BudgetYourTrip: new BudgetYourTrip(),
      budgetData: [],
      budget: [],
      spend: "Medium",
      currency: "USD",
      highlights: [],
    };
  }

  async componentDidUpdate() {
    const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
      searchParams = new URLSearchParams(queryParamsString);
    var location = searchParams.get("location_name").split(",")[0];
    if (location === "null") {
      location = "Los Angeles";
    }
    const geoId = await this.state.BudgetYourTrip.getIdByName(location);

    if (geoId.status === true) {
      var toquery = geoId.data[0].geonameid;
      for (var i = 0; i < geoId.data.length; i++) {
        if (geoId.data[i].asciiname === location) {
          toquery = geoId.data[i].geonameid;
        }
      }
    }

    const budgets = await this.state.BudgetYourTrip.getBudgetById(toquery);
    const highlights = await this.state.BudgetYourTrip.getHighlightById(
      toquery
    );
    this.setState({ highlights: highlights });
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
    };
    this.setState({
      budgetData: budget,
      budget: valueMid,
      mounted: true,
      currency: currency,
    });
  }

  async componentDidMount() {
    const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
      searchParams = new URLSearchParams(queryParamsString);
    var location = searchParams.get("location_name").split(",")[0];
    if (location === "null") {
      /*cheapest?*/
      location = "Los Angeles";
    }
    const geoId = await this.state.BudgetYourTrip.getIdByName(location);
    if (geoId.status === true) {
      var toquery = geoId.data[0].geonameid;
      for (var i = 0; i < geoId.data.length; i++) {
        if (geoId.data[i].asciiname === location) {
          toquery = geoId.data[i].geonameid;
        }
      }
    }

    const budgets = await this.state.BudgetYourTrip.getBudgetById(toquery);
    const highlights = await this.state.BudgetYourTrip.getHighlightById(
      toquery
    );
    this.setState({ highlights: highlights });
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
    this.setState({ budgetData: budget, budget: valueMid, mounted: true });
  }

  handleChange = (event) => {
    this.setState({ spend: event.target.value });
    if (event.target.value === "Luxury") {
      this.setState({ budget: this.state.budgetData.valueLux });
    } else if (event.target.value === "Budget") {
      this.setState({ budget: this.state.budgetData.valueBudget });
    } else {
      this.setState({ budget: this.state.budgetData.valueMid });
    }
  };

  render() {
    const { classes } = this.props;
    if (this.state.mounted) {
      return (
        <div className={classes.root}>
          <div className="row">
            <FormControl className={classes.select}>
              <Select
                value={this.state.spend}
                onChange={this.handleChange.bind(this)}
                displayEmpty
              >
                <MenuItem value={"Budget"}>Budget</MenuItem>
                <MenuItem value={"Medium"}>Mid-range</MenuItem>
                <MenuItem value={"Luxury"}>Luxury</MenuItem>
              </Select>
            </FormControl>{" "}
            <h3> spend estimate ({this.state.currency})/day </h3>
          </div>
          <div>
            <RadialChart
              budget={this.state.budget}
              cat={this.state.budgetData.cat}
            />
          </div>
          <div className={classes.highlights}>
            <h3>Cost highlights</h3>
            <CostHighlights highlights={this.state.highlights} />
          </div>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

CostPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CostPage);
