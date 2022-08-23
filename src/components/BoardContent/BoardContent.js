import React, { useEffect, useRef, useState } from "react";
import {
  fetchBoardDetails,
  createNewColumn,
  updateBoard,
  updateColumn,
  updateCard,
} from "actions/ApiCall";
import { Container, Draggable } from "react-smooth-dnd";
import Column from "components/Column/Column";
import BoardNotFound from "components/NotFound/BoardNotFound/BoardNotFound";
import { isEmpty, cloneDeep } from "lodash";
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
    const boardId = "63009ee1c97d286525b6b3d7";
    fetchBoardDetails(boardId).then((board) => {
      setBoard(board);

      //sort column
      mapOrder(board.columns, board.columnOrder, "_id");
      // boardFromDb.columns.sort((a, b) => {
      //   return (
      //     boardFromDb.columnOrder.indexOf(a._id) -
      //     boardFromDb.columnOrder.indexOf(b._id)
      //   );
      // });
      setColumns(board.columns);
    });
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
    let newColumns = cloneDeep(columns);
    newColumns = applyDrag(newColumns, dropResult);

    // update the board(columnsOrder)
    let newBoard = cloneDeep(board);
    newBoard.columnOrder = newColumns.map((c) => c._id);
    // async boardColumnOrder & boardColumns
    newBoard.columns = newColumns;
    // call api update columnOrder in board detail
    setColumns(newColumns);
    setBoard(newBoard);
    updateBoard(newBoard._id, newBoard).catch(() => {
      setColumns(columns);
      setBoard(board);
    });
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns);

      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((c) => c._id);
      setColumns(newColumns);

      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        // action: move card inside its column
        // - call api update cardOrder in current column
        updateColumn(currentColumn._id, currentColumn).catch(() => {
          setColumns(columns);
        });
      } else {
        // action: move card between to column
        // - call api update cardOrder in current column
        updateColumn(currentColumn._id, currentColumn).catch(() => {
          setColumns(columns);
        });
        if (dropResult.addedIndex !== null) {
          let currentCard = cloneDeep(dropResult.payload);
          currentCard.columnId = currentColumn._id;
          // - call api update columnId in current card
          updateCard(currentCard._id, currentCard);
        }
      }
    }
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim(),
    };
    // Call API
    createNewColumn(newColumnToAdd).then((column) => {
      let newColumns = [...columns];
      newColumns.push(column);

      // update the board(columnsOrder)
      let newBoard = { ...board };
      newBoard.columnOrder = newColumns.map((c) => c._id);
      // async boardColumnOrder & boardColumns
      newBoard.columns = newColumns;

      setColumns(newColumns);
      setBoard(newBoard);

      // reset characters newColumnTitle
      setNewColumnTitle("");
      toggleOpenNewColumnForm();
    });
  };

  const onUpdateColumnState = (newColumnToUpdate) => {
    // edit & remove column
    const columnIdToUpdate = newColumnToUpdate._id;

    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (item) => item._id === columnIdToUpdate
    );
    if (newColumnToUpdate._destroy) {
      //remove column
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      //update column
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }

    // update the board(columnsOrder)
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c._id);
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
              onUpdateColumnState={onUpdateColumnState}
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
