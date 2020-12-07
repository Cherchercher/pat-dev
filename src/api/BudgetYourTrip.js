import fetchJsonp from "fetch-jsonp";

class BudgetYourTrip {
  constructor() {
    this.url = "https://www.budgetyourtrip.com/api/v3/";

    this.catDict = {
      "0": {
        name: "Total Cost",
        description:
          "Overall total average cost for this location. Note that these total costs are not a direct sum of all of the category costs, but instead are a specifically calculated amount based on actual travel spending.",
        sumtype: "0",
      },
      "1": {
        name: "Accommodation",
        description:
          "From camping to luxury hotels, costs are for one person and assume double occupancy.",
        sumtype: "1",
      },
      "2": {
        name: "Intercity Transportation",
        description:
          "All transit (bus, planes, cars) between cities within the same country.",
        sumtype: "1",
      },
      "3": {
        name: "Local Transportation",
        description:
          "Travel within one city, including taxi rides, public transit, and personal driving.",
        sumtype: "1",
      },
      "4": {
        name: "Food",
        description: "All meals and snacks over the course of one day.",
        sumtype: "2",
      },
      "5": {
        name: "Water",
        description: "One day's purchase of bottled water.",
        sumtype: "2",
      },
      "6": {
        name: "Entertainment",
        description:
          "All activities, from tickets to a show to park ent…ce fees. Costs are for one item of entertainment.",
        sumtype: "1",
      },
      "7": {
        name: "Souvenirs",
        description: "All purchases from gifts to personal keepsakes.",
        sumtype: "1",
      },
      "8": {
        name: "Communication",
        description:
          "Phone calls, internet access, or postage for one day's time.",
        sumtype: "2",
      },
      "9": {
        name: "Living Expenses",
        description:
          "Personal purchases from shampoo to laundry. Costs are for one day's time.",
        sumtype: "2",
      },
      "10": {
        name: "Visas",
        description: "Required entry and exit fees.",
        sumtype: "1",
      },
      "11": {
        name: "Scams, Robberies, and Mishaps",
        description: "It happens to everyone! You may as well fess up now.",
        sumtype: "1",
      },
      "12": {
        name: "Alcohol",
        description: "Drinks imbibed, from bar hopping to wine country.",
        sumtype: "2",
      },
      "13": {
        name: "Tips and Handouts",
        description: "Tips for guides or service providers.",
        sumtype: "1",
      },
      "14": {
        name: "International Transportation",
        description:
          "Travel between countries including planes, ferries, buses, etc.",
        sumtype: "1",
      },
      "15": {
        name: "All Inclusive Tour or Cruise",
        description: "Tours such as safaris, boat cruises, or multi-day tours.",
        sumtype: "1",
      },
      "16": {
        name: "Charitable Donations",
        description: "Donations or contributions.",
        sumtype: "1",
      },
      "17": {
        name: "Conference Fees",
        description: "Conventions, business events, conference entry fees.",
        sumtype: "1",
      },
      "18": {
        name: "Health Care",
        description: "Insurance, medicine, doctors visits, etc.",
        sumtype: "1",
      },
    };
  }

  async getIdByName(name) {
    var split = name
      .split(",")[0]
      .toLowerCase()
      .replace("_", "%20");
    const geo = await fetchJsonp(
      this.url + "search/locationdata/" + split,
      this.settings
    );
    return geo.json();
  }

  async getBudgetById(id) {
    const BudgetData = await fetchJsonp(
      this.url + "costs/locationinfo/" + id,
      this.settings
    );
    return BudgetData.json();
  }
  async getHighlightById(id) {
    const BudgetData = await fetchJsonp(
      this.url + "costs/highlights/" + id,
      this.settings
    );
    return BudgetData.json();
  }
}

export default BudgetYourTrip;
