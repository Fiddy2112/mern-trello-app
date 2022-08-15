import Column from "components/Column/Column";
import React from "react";
import "./BoardContent.scss";

function BoardContent(props) {
  return (
    <div className="board-content">
      <Column
        name="Brainstorm"
        thumb="https://images.unsplash.com/photo-1660316498598-02d702dcd91c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
        title="Fiddy"
      />
      <Column
        name="Brainstorm"
        thumb="https://images.unsplash.com/photo-1657299156271-d5a435dd65b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyMXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
        title="Fiddy"
      />
      <Column
        name="Brainstorm"
        thumb="https://images.unsplash.com/photo-1660337294765-2a20770826aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=300&q=60"
        title="Fiddy"
      />
    </div>
  );
}

export default BoardContent;
