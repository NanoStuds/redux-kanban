import React, { useState } from 'react';
import styled from 'styled-components';
import * as color from './color';
import { Card } from './Card';
import { PlusIcon } from './icon';
import { InputForm as _InputForm } from './InputForm';
export function Column({ title, filterValue: rawFilterValue, cards: rawCards, onCardDragStart, onCardDrop, onCardDeleteClick, text, onTextChange, onTextConfirm, onTextCancel, }) {
    var _a, _b, _c;
    const filterValue = rawFilterValue === null || rawFilterValue === void 0 ? void 0 : rawFilterValue.trim();
    const keywords = (_a = filterValue === null || filterValue === void 0 ? void 0 : filterValue.toLowerCase().split(/\s + /g)) !== null && _a !== void 0 ? _a : [];
    const cards = rawCards === null || rawCards === void 0 ? void 0 : rawCards.filter(({ text }) => keywords === null || keywords === void 0 ? void 0 : keywords.every(w => text === null || text === void 0 ? void 0 : text.toLowerCase().includes(w)));
    const totalCount = (_b = rawCards === null || rawCards === void 0 ? void 0 : rawCards.length) !== null && _b !== void 0 ? _b : -1;
    const [inputMode, setInputMode] = useState(false);
    const toggleInput = () => setInputMode(v => !v);
    const confirmInput = () => {
        onTextConfirm === null || onTextConfirm === void 0 ? void 0 : onTextConfirm();
    };
    const cancelInput = () => {
        setInputMode(false);
        onTextCancel === null || onTextCancel === void 0 ? void 0 : onTextCancel();
    };
    const [draggingCardID, setDraggingCardID] = useState(undefined);
    const handleCardDragStart = (id) => {
        setDraggingCardID(id);
        onCardDragStart === null || onCardDragStart === void 0 ? void 0 : onCardDragStart(id);
    };
    return (React.createElement(Container, null,
        React.createElement(Header, null,
            totalCount >= 0 && React.createElement(CountBadge, null, totalCount),
            React.createElement(ColumnName, null, title),
            React.createElement(AddButton, { onClick: toggleInput })),
        inputMode && (React.createElement(InputForm, { value: text, onChange: onTextChange, onConfirm: confirmInput, onCancel: cancelInput })),
        !cards ? (React.createElement(Loading, null)) : (React.createElement(React.Fragment, null,
            filterValue && React.createElement(ResultCount, null,
                cards.length,
                " results"),
            React.createElement(VerticalScroll, null,
                cards.map(({ id, text }, i) => {
                    var _a;
                    return (React.createElement(Card.DropArea, { key: id, disabled: draggingCardID !== undefined &&
                            (id === draggingCardID || ((_a = cards[i - 1]) === null || _a === void 0 ? void 0 : _a.id) === draggingCardID), onDrop: () => onCardDrop === null || onCardDrop === void 0 ? void 0 : onCardDrop(id) },
                        React.createElement(Card, { text: text, onDragStart: () => handleCardDragStart(id), onDragEnd: () => setDraggingCardID(undefined), onDeleteClick: () => onCardDeleteClick === null || onCardDeleteClick === void 0 ? void 0 : onCardDeleteClick(id) })));
                }),
                React.createElement(Card.DropArea, { style: { height: '100%' }, disabled: draggingCardID !== undefined &&
                        ((_c = cards[cards.length - 1]) === null || _c === void 0 ? void 0 : _c.id) === draggingCardID, onDrop: () => onCardDrop === null || onCardDrop === void 0 ? void 0 : onCardDrop(null) }))))));
}
const Container = styled.div `
  display: flex;
  flex-flow: column;
  width: 355px;
  height: 100%;
  border: solid 1px ${color.Silver};
  border-radius: 6px;
  background-color: ${color.LightSilver};

  > :not(:last-child) {
    flex-shrink: 0;
  }
`;
const Header = styled.div `
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
`;
const CountBadge = styled.div `
  margin-right: 8px;
  border-radius: 20px;
  padding: 2px 6px;
  color: ${color.Black};
  background-color: ${color.Silver};
  font-size: 12px;
  line-height: 1;
`;
const ColumnName = styled.div `
  color: ${color.Black};
  font-size: 14px;
  font-weight: bold;
`;
const AddButton = styled.button.attrs({
    type: 'button',
    children: React.createElement(PlusIcon, null),
}) `
  margin-left: auto;
  color: ${color.Black};

  :hover {
    color: ${color.Blue};
  }
`;
const InputForm = styled(_InputForm) `
  padding: 8px;
`;
const Loading = styled.div.attrs({
    children: 'Loading...',
}) `
  padding: 8px;
  font-size: 14px;
`;
const ResultCount = styled.div `
  color: ${color.Black};
  font-size: 12px;
  text-align: center;
  `;
const VerticalScroll = styled.div `
  height: 100%;
  padding: 8px;
  overflow-y: auto;
  flex: 1 1 auto;

  > :not(:first-child) {
    margin-top: 8px;
  }
`;
