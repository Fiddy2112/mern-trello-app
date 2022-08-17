import React, { useEffect, useState } from "react";
import { initialData } from "actions/initialData";
import { Container, Draggable } from "react-smooth-dnd";
import Column from "components/Column/Column";
import BoardNotFound from "components/NotFound/BoardNotFound/BoardNotFound";
import { isEmpty } from "lodash";
import { mapOrder } from "utilities/Sorts";
import "./BoardContent.scss";

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFromDb = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDb) {
      setBoard(boardFromDb);

      //sort column
      mapOrder(boardFromDb.columns, boardFromDb.columnOrder, "id");
      // boardFromDb.columns.sort((a, b) => {
      //   return (
      //     boardFromDb.columnOrder.indexOf(a.id) -
      //     boardFromDb.columnOrder.indexOf(b.id)
      //   );
      // });
      setColumns(boardFromDb.columns);
    }
  }, []);

  if (isEmpty(board)) {
    return <BoardNotFound />;
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult);
  };

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "column-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} />
          </Draggable>
        ))}
      </Container>
    </div>
  );
}

export default BoardContent;
