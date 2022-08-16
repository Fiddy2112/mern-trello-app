import React from "react";
import "./Card.scss";

function Card(props) {
  const { card } = props;
  return (
    <li className="card-item">
      {/* {!card.cover ? (
        <img
          src="https://images.unsplash.com/photo-1660316498598-02d702dcd91c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
          alt="unsplash-img"
        />
      ) : (
        <img src={card.cover} alt="unsplash-img" />
      )} */}
      {card.cover && <img src={card.cover} alt="unsplash-img" />}
      Title: {card.title}
    </li>
  );
}

export default Card;
