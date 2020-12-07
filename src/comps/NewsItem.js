import React, { Component } from "react";
import { Button } from "react-bootstrap";

const styles = {
  news_item: {
    // flex: 1,
    flexDirection: "row",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E4",
  },
  description: {
    "font-weight": "20",
  },
  news_text: {
    // flex: 2,
    flexDirection: "row",
    padding: 10,
  },
  number: {
    flex: 0.5,
  },
  text_container: {
    flex: 3,
  },
  pretext: {
    color: "#3F3F3F",
    fontSize: 20,
  },
  title: {
    fontWeight: "bold",
    color: "#000",
    fontFamily: "georgia",
  },
  news_photo: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 200,
    height: 180,
  },
};

const NewsItem = ({ news, index }) => {
  function getPretext(news) {
    if (news.pretext) {
      return <p style={styles.pretext}>{news.pretext}</p>;
    }
  }

  function onPress(news) {
    alert(news.title);
  }

  let number = (index + 1).toString();
  return (
    <Button
      key={index}
      style={{ "white-space": "normal", "text-transform": "none" }}
      noDefaultStyles={true}
      onClick={onPress.bind(this, news)}
    >
      <div style={styles.news_item}>
        <div style={styles.news_text}>
          <div style={styles.number}>
            <h2 style={styles.title}>{number}.</h2>
          </div>
          <div style={styles.text_container}>
            {getPretext(news)}
            <p style={styles.title}>{news.title}</p>
            <p style={styles.description}>{news.description}</p>
          </div>
        </div>
        <div style={styles.news_photo}>
          <img src={news.urlToImage} style={styles.photo} />
        </div>
      </div>
    </Button>
  );
};

export default NewsItem;
