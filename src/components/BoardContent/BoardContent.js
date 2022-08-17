import React, { useEffect, useState } from "react";
import { initialData } from "actions/initialData";
import { Container, Draggable } from "react-smooth-dnd";
import Column from "components/Column/Column";
import BoardNotFound from "components/NotFound/BoardNotFound/BoardNotFound";
import { isEmpty } from "lodash";
import { mapOrder } from "utilities/Sorts";
import { applyDrag } from "utilities/DragDrop";
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
    // drag the column
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    // update the board(columnsOrder)
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    // async boardColumnOrder & boardColumns
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((c) => c.id);

      setColumns(newColumns);
    }
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
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon"></i>
        Add another card
      </div>
    </div>
  );
}

export default BoardContent;
