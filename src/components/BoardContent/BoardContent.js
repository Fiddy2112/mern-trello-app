import Column from "components/Column/Column";
import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { initialData } from "actions/initialData";
import "./BoardContent.scss";
import BoardNotFound from "components/NotFound/BoardNotFound/BoardNotFound";
import { mapOrder } from "utilities/Sorts";

function BoardContent(props) {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFromDb = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    console.log("boardFromDb: ", boardFromDb);
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
  console.log("columns: ", columns);
  return (
    <div className="board-content">
      {columns.map((column, index) => (
        <Column key={index} column={column} />
      ))}
    </div>
  );
}

export default BoardContent;
