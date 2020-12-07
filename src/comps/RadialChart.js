import Chart from "react-apexcharts";
import React from "react";

const description = [
  "From camping to luxury hotels, costs are for one person and assume double occupancy.",
  "Travel within one city, including taxi rides, public transit, and personal driving.",
  "All meals and snacks over the course of one day.",
  "One day's purchase of bottled water.",
  "All activities, from tickets to a show to park ent…ce fees. Costs are for one item of entertainment.",
  "All purchases from gifts to personal keepsakes.",
  "Phone calls, internet access, or postage for one day's time.",
  "Personal purchases from shampoo to laundry. Costs are for one day's time.",
  "It happens to everyone! You may as well fess up now.",
  "Drinks imbibed, from bar hopping to wine country.",
  "Tips for guides or service providers.",
  "Overall total average cost based on actual travel spending.",
];

class RadialChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        colors: [
          function({ value, seriesIndex, w }) {
            if (value < 15) {
              return "#32CD32";
            } else if (value >= 15 && value < 55) {
              return "#1e90FF";
            } else {
              return "#D9534F";
            }
          },
        ],
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },

        responsive: [
          {
            breakpoint: 1000,
            options: {
              chart: {
                width: "100%",
                height: 380,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "13px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function(w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 249;
            },
          },
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            return (
              '<div className="arrow_box">' +
              "<span>" +
              description[dataPointIndex] +
              "</span>" +
              "</div>"
            );
          },
          fixed: {
            enabled: true,
            position: "bottomLeft",
          },
        },
        xaxis: {
          categories: [
            "South Korea",
            "Canada",
            "United Kingdom",
            "Netherlands",
            "Italy",
            "France",
            "Japan",
            "United States",
            "China",
            "Germany",
          ],
        },
      },
      series: [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ],
    };
  }

  componentDidMount() {
    var max = Math.max(...this.props.budget);
    this.setState((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: this.props.cat,
        },
        colors: [
          function({ value, seriesIndex, w }) {
            if (value < 0.15 * max) {
              return "#32CD32";
            } else if (value >= 0.15 * max && value < 0.5 * max) {
              return "#1e90FF";
            } else {
              return "#D9534F";
            }
          },
        ],
      },
    }));

    var series = { ...this.state.series };
    series = [{ data: this.props.budget }];
    this.setState({ series: series });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.options.xaxis.categories !== nextProps.cat) {
      this.setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: nextProps.cat,
          },
        },
      }));
    }

    if (this.props.budget !== nextProps.budget) {
      var series = { ...this.state.series };
      series = [{ data: nextProps.budget }];
      var max = Math.max(...nextProps.budget);
      this.setState({ series: series });
      this.setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          colors: [
            function({ value, seriesIndex, w }) {
              if (value < 0.15 * max) {
                return "#32CD32";
              } else if (value >= 0.15 * max && value < 0.5 * max) {
                return "#1e90FF";
              } else {
                return "#D9534F";
              }
            },
          ],
        },
      }));
    }
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          width={500}
        />
      </div>
    );
  }
}

export default RadialChart;
