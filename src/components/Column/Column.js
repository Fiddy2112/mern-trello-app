import Task from "components/Task/Task";
import React from "react";
import "./Column.scss";

function Column(props) {
  const { name, thumb, title } = props;
  return (
    <div className="column">
      <header>{name}</header>
      <ul className="task-list">
        <Task>
          <img src={thumb} alt="unsplash-img" />
          Title: {title}
        </Task>
        <Task>Add what you'd like to work on below</Task>
        <Task>Add what you'd like to work on below</Task>
        <Task>Add what you'd like to work on below</Task>
        <Task>Add what you'd like to work on below</Task>
        <Task>Add what you'd like to work on below</Task>
      </ul>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;
