import Card from "components/Card/Card";
import ConfirmModal from "components/Common/ConfirmModal";
import parse from "html-react-parser";
import React, { useCallback, useEffect, useState } from "react";
import { ButtonGroup, Dropdown, Form } from "react-bootstrap";
import { Container, Draggable } from "react-smooth-dnd";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditable";
import { mapOrder } from "utilities/Sorts";

import "./Column.scss";

function Column(props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const [columnTitle, setColumnTitle] = useState("");
  const handleColumnTitleChange = useCallback((e) => {
    setColumnTitle(e.target.value);
  }, []);
  const { column, onCardDrop, onUpdateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, "id");

  const onConfirmModalAction = (action) => {
    if (action === MODAL_ACTION_CONFIRM) {
      // delete column
      const newColumn = {
        ...column,
        _destroy: true,
      };
      onUpdateColumn(newColumn);
    }
    console.log("action: ", action);
    toggleShowConfirmModal();
  };

  const handleColumnTitleBlur = () => {
    // update column
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    onUpdateColumn(newColumn);
  };

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

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
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
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
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon"></i>
          Add another card
        </div>
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
