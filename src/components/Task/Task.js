import React from "react";
import "./Task.scss";

function Task(props) {
  return <li className="task-item">{props.children}</li>;
}

export default Task;
