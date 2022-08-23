import Card from "components/Card/Card";
import ConfirmModal from "components/Common/ConfirmModal";
import parse from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Dropdown, Form, Button } from "react-bootstrap";
import { Container, Draggable } from "react-smooth-dnd";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import { cloneDeep } from "lodash";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditable";
import { mapOrder } from "utilities/Sorts";
import { createNewCard, updateColumn } from "actions/ApiCall";

import "./Column.scss";

function Column(props) {
  const { column, onCardDrop, onUpdateColumnState } = props;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const [newCardTitle, setNewCardTitle] = useState("");

  const [columnTitle, setColumnTitle] = useState("");
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);

  const cards = mapOrder(column.cards, column.cardOrder, "_id");
  const newCardTextareaRef = useRef(null);
  //remove column
  const onConfirmModalAction = (action) => {
    if (action === MODAL_ACTION_CONFIRM) {
      // delete column
      const newColumn = {
        ...column,
        _destroy: true,
      };
      updateColumn(newColumn._id, newColumn).then((removedColumn) => {
        onUpdateColumnState(removedColumn);
      });
    }
    toggleShowConfirmModal();
  };
  // Update column
  const handleColumnTitleBlur = () => {
    if (column.title !== columnTitle) {
      // update column
      const newColumn = {
        ...column,
        title: columnTitle,
      };

      //call api update column
      updateColumn(newColumn._id, newColumn).then((updatedColumn) => {
        updatedColumn.cards = newColumn.cards;
        onUpdateColumnState(updatedColumn);
      });
    }
  };

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus();
      return;
    }

    //add new card
    const newCardToAdd = {
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim(),
    };
    // Call API
    createNewCard(newCardToAdd).then((card) => {
      let newColumn = cloneDeep(column);
      newColumn.cards.push(card);
      newColumn.cardOrder.push(card._id);

      // update the column
      onUpdateColumnState(newColumn);

      // reset characters newCardTitle
      setNewCardTitle("");
      toggleOpenNewCardForm();
    });
  };

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
    }
  }, [openNewCardForm]);

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          {/* {column.title} */}
          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onClick={selectAllInlineText}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onMouseDown={(e) => e.preventDefault()}
            spellCheck="false"
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              id="dropdown-split-basic"
              size="sm"
              className="dropdown-btn"
            />

            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>
                Remove column...
              </Dropdown.Item>
              <Dropdown.Item>
                Move All cards in this column (beta)...
              </Dropdown.Item>
              <Dropdown.Item>
                Archive All cards in this column (beta)...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          orientation="vertical"
          groupName="col"
          onDrop={(dropResult) => onCardDrop(column._id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "card-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this card..."
              className="textarea-enter-new-card"
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNewCard()}
            />
          </div>
        )}
      </div>
      <footer>
        {openNewCardForm && (
          <div className="add-new-card-actions">
            <Button variant="success" size="sm" onClick={addNewCard}>
              Add Card
            </Button>
            <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
              <i className="fa fa-times icon"></i>
            </span>
          </div>
        )}
        {!openNewCardForm && (
          <div className="footer-actions" onClick={toggleOpenNewCardForm}>
            <i className="fa fa-plus icon"></i>
            Add another card
          </div>
        )}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={parse(
          `Are you sure you want to remove the column <strong>${column.title}</strong>? <br/>All cards in this column will be <strong style='color:red'>removed</strong>.`
        )}
      />
    </div>
  );
}

export default Column;
