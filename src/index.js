import "react-app-polyfill/ie9";
import ReactDOM from "react-dom";
import "./css/index.css";
import "./css/pagecontainer.css";
import "bootstrap/dist/css/bootstrap.css";
import { makeMainRoutes } from "./routes";
import registerServiceWorker from "./registerServiceWorker";

const routes = makeMainRoutes();

ReactDOM.render(
  routes,
  document.getElementById("root"),
  registerServiceWorker()
);
