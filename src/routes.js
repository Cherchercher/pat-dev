import React, { Suspense, useState, lazy } from "react";
import { Route, Router } from "react-router-dom";
import { SyncRouting } from "react-router-redux-sync";
import PersonaPage from "./pages/PersonaPage";
import Callback from "./Callback/Callback";
import Auth from "./Auth/Auth";
import Triposo from "./api/Triposo";
// import "./css/aboutTemplate.css";
import "./css/global.scss";
import history from "./history";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Header from "./comps/Header";
import { Provider } from "react-redux";
import store from "./store";
import { createMuiTheme } from "@material-ui/core/styles";
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const Test = lazy(() => import("./pages/Test"));
const DestinationPage = lazy(() => import("./pages/DestinationPage"));
const PlanPage = lazy(() => import("./pages/PlanPage"));
const CovidPage = lazy(() => import("./pages/CovidPage"));
const DayPlanPage = lazy(() => import("./pages/DayPlanPage"));
const TourPage = lazy(() => import("./pages/TourPage"));
const CostPage = lazy(() => import("./pages/CostPage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const POI = lazy(() => import("./comps/POI"));
const LocationPage = lazy(() => import("./pages/LocationPage"));

const auth = new Auth();
const basename = process.env.REACT_APP_ROUTER_BASENAME || "/";

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0876C4" },
  },
});

let styles = {
  marginLeft: "15%",
  marginTop: "64px",
};
const triposo = new Triposo();
export const makeMainRoutes = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Suspense fallback={<div>Loading...</div>}>
          <Router history={history} basename={basename}>
            <div>
              <Route
                render={(props) => {
                  SyncRouting(props);
                  return <Header Triposo={triposo} auth={auth} {...props} />;
                }}
              />
              <Route
                path="/"
                exact
                render={(props) => {
                  SyncRouting(props);
                  return (
                    <ExplorePage parentStyles={styles} auth={auth} {...props} />
                  );
                }}
              />

              <Route
                path="/aboutus"
                render={(props) => <AboutUsPage auth={auth} {...props} />}
              />
              <Route
                path="/destination"
                render={(props) => <DestinationPage auth={auth} {...props} />}
              />
              <Route
                path="/test"
                render={(props) => <Test auth={auth} {...props} />}
              />
              <Route
                path="/covid19"
                render={(props) => (
                  <CovidPage Triposo={triposo} auth={auth} {...props} />
                )}
              />
              <Route
                path="/persona"
                render={(props) => <PersonaPage auth={auth} {...props} />}
              />
              <Route
                path="/dayplan/:location_id?/:location_name?"
                render={(props) => {
                  SyncRouting(props);
                  return <DayPlanPage auth={auth} {...props} />;
                }}
              />
              <Route
                path="/poi/:id"
                render={(props) => <POI auth={auth} {...props} />}
              />

              <Route
                path="/location"
                render={(props) => {
                  return <LocationPage auth={auth} {...props} />;
                }}
              />

              <Route
                path="/plans"
                render={(props) => <PlanPage auth={auth} {...props} />}
              />
              <Route
                path="/costs/:location_id?/:location_name?"
                render={(props) => {
                  SyncRouting(props);
                  return <CostPage auth={auth} {...props} />;
                }}
              />
              <Route
                path="/explore"
                render={(props) => <ExplorePage auth={auth} {...props} />}
              />
              <Route
                path="/Bookings/:location_id?/:location_name?"
                render={(props) => {
                  SyncRouting(props);
                  return <TourPage auth={auth} {...props} />;
                }}
              />

              <Route
                path="/callback"
                render={(props) => {
                  handleAuthentication(props);
                  return <Callback auth={auth} {...props} />;
                }}
              />
            </div>
          </Router>
        </Suspense>
      </MuiThemeProvider>
    </Provider>
  );
};
