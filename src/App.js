import "./App.scss";

import React from "react";
import AppBar from "components/AppBar/AppBar";
import "./App.scss";
import BoardBar from "components/BoardBar/BoardBar";
import BoardContent from "components/BoardContent/BoardContent";

function App() {
  return (
    <div className="trello-master">
      <AppBar />
      <BoardBar />
      <BoardContent />
    </div>
  );
}

export default App;
