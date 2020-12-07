import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";
import "../css/legend.css";

class Legend extends MapControl {
  createLeafletElement() {}

  componentDidMount() {
    // get color depending on population density value

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const colorMap = {
        mild: "green",
        stable: "blue",
        caution: "orange",
        danger: "red",
      };

      let labels = [];

      for (const [key, value] of Object.entries(colorMap)) {
        labels.push('<i style="background:' + value + '"></i> ' + key);
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    const { map } = this.props.leaflet;
    legend.addTo(map);
  }
}

export default withLeaflet(Legend);
