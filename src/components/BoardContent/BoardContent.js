import React, { useEffect, useRef, useState } from "react";
import { initialData } from "actions/initialData";
import { Container, Draggable } from "react-smooth-dnd";
import Column from "components/Column/Column";
import BoardNotFound from "components/NotFound/BoardNotFound/BoardNotFound";
import { isEmpty } from "lodash";
import { mapOrder } from "utilities/Sorts";
import { applyDrag } from "utilities/DragDrop";
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

import "./BoardContent.scss";

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const newColumnInputRef = useRef(null);

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

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnForm]);

  if (isEmpty(board)) {
    return <BoardNotFound />;
  }

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };

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

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      id: `column-${Math.random().toString(36).substr(2, 5)}`, // 5 random characters, will remove when implement code api
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };
    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);

    // update the board(columnsOrder)
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    // async boardColumnOrder & boardColumns
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);

    // reset characters newColumnTitle
    setNewColumnTitle("");
    toggleOpenNewColumnForm();
  };

  const onUpdateColumn = (newColumnToUpdate) => {
    // edit & remove column
    const columnIdToUpdate = newColumnToUpdate.id;

    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (item) => item.id === columnIdToUpdate
    );
    if (newColumnToUpdate._destroy) {
      //remove column
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      //update column
      console.log(newColumnToUpdate);
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }

    // update the board(columnsOrder)
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    // async boardColumnOrder & boardColumns
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
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
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer className="trello-container">
        {!openNewColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon"></i>
              Add another card
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title..."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>
                Add Column
              </Button>
              <span
                className="cancel-icon"
                onClick={() => setOpenNewColumnForm(!openNewColumnForm)}
              >
                <i className="fa fa-times icon"></i>
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
}

export default BoardContent;
