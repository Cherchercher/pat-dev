class News {
  constructor() {
    this.url = "https://newsapi.org/v2/everything?";
    this.apiKey = "7d9a27ee6d4b4a37ac5d13cefb1767b0";
  }

  async getEverythingAbout(topic = "travel") {
    const result = await fetch(
      this.url + "q=" + topic + "&apiKey=" + this.apiKey
    );
    const payload = await result.json();
    return payload;
  }
}

export default News;
