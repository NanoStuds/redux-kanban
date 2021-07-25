import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import produce from 'immer';
import { randomID, sortBy, reorderPatch } from './util';
import { api } from './api';
import { Header as _Header } from './Header';
import { Column } from './Column';
import { DeleteDialog } from './DeleteDialog';
import { Overlay as _Overlay } from './Overlay';
export function App() {
    const [filterValue, setFilterValue] = useState('');
    const [{ columns, cardsOrder }, setData] = useState({ cardsOrder: {} });
    useEffect(() => {
        ;
        (async () => {
            const columns = await api('GET /v1/columns', null);
            setData(produce((draft) => {
                draft.columns = columns;
            }));
            const [unorderedCards, cardsOrder] = await Promise.all([
                api('GET /v1/cards', null),
                api('GET /v1/cardsOrder', null),
            ]);
            setData(produce((draft) => {
                var _a;
                draft.cardsOrder = cardsOrder;
                (_a = draft.columns) === null || _a === void 0 ? void 0 : _a.forEach(column => {
                    column.cards = sortBy(unorderedCards, cardsOrder, column.id);
                });
            }));
        })();
    }, []);
    const [draggingCardID, setDraggingCardID] = useState(undefined);
    const dropCardTo = (toID) => {
        const fromID = draggingCardID;
        if (!fromID)
            return;
        setDraggingCardID(undefined);
        if (fromID === toID)
            return;
        const patch = reorderPatch(cardsOrder, fromID, toID);
        setData(produce((draft) => {
            var _a, _b, _c;
            draft.cardsOrder = {
                ...draft.cardsOrder,
                ...patch,
            };
            const unorderedCards = (_b = (_a = draft.columns) === null || _a === void 0 ? void 0 : _a.flatMap(c => { var _a; return (_a = c.cards) !== null && _a !== void 0 ? _a : []; })) !== null && _b !== void 0 ? _b : [];
            (_c = draft.columns) === null || _c === void 0 ? void 0 : _c.forEach(column => {
                column.cards = sortBy(unorderedCards, draft.cardsOrder, column.id);
            });
        }));
        api('PATCH /v1/cardsOrder', patch);
    };
    const setText = (columnID, value) => {
        setData(produce((draft) => {
            var _a;
            const column = (_a = draft.columns) === null || _a === void 0 ? void 0 : _a.find(c => c.id === columnID);
            if (!column)
                return;
            column.text = value;
        }));
    };
    const addCard = (columnID) => {
        const column = columns === null || columns === void 0 ? void 0 : columns.find(c => c.id === columnID);
        if (!column)
            return;
        const text = column.text;
        const cardID = randomID();
        const patch = reorderPatch(cardsOrder, cardID, cardsOrder[columnID]);
        setData(produce((draft) => {
            var _a;
            const column = (_a = draft.columns) === null || _a === void 0 ? void 0 : _a.find(c => c.id === columnID);
            if (!(column === null || column === void 0 ? void 0 : column.cards))
                return;
            column.cards.unshift({
                id: cardID,
                text: column.text,
            });
            column.text = '';
            draft.cardsOrder = {
                ...draft.cardsOrder,
                ...patch,
            };
        }));
        api('POST /v1/cards', {
            id: cardID,
            text,
        });
        api('PATCH /v1/cardsOrder', patch);
    };
    const [deletingCardID, setDeletingCardID] = useState(undefined);
    const deleteCard = () => {
        const cardID = deletingCardID;
        if (!cardID)
            return;
        setDeletingCardID(undefined);
        setData(produce((draft) => {
            var _a, _b;
            const column = (_a = draft.columns) === null || _a === void 0 ? void 0 : _a.find(col => { var _a; return (_a = col.cards) === null || _a === void 0 ? void 0 : _a.some(c => c.id === cardID); });
            if (!column)
                return;
            column.cards = (_b = column.cards) === null || _b === void 0 ? void 0 : _b.filter(c => c.id !== cardID);
        }));
    };
    return (React.createElement(Container, null,
        React.createElement(Header, { filterValue: filterValue, onFilterChange: setFilterValue }),
        React.createElement(MainArea, null,
            React.createElement(HorizontalScroll, null, !columns ? (React.createElement(Loading, null)) : (columns.map(({ id: columnID, title, cards, text }) => (React.createElement(Column, { key: columnID, title: title, filterValue: filterValue, cards: cards, onCardDragStart: cardID => setDraggingCardID(cardID), onCardDrop: entered => dropCardTo(entered !== null && entered !== void 0 ? entered : columnID), onCardDeleteClick: cardID => setDeletingCardID(cardID), text: text, onTextChange: value => setText(columnID, value), onTextConfirm: () => addCard(columnID) })))))),
        deletingCardID && (React.createElement(Overlay, { onClick: () => setDeletingCardID(undefined) },
            React.createElement(DeleteDialog, { onConfirm: deleteCard, onCancel: () => setDeletingCardID(undefined) })))));
}
const Container = styled.div `
  display: flex;
  flex-flow: column;
  height: 100%;
`;
const Header = styled(_Header) `
  flex-shrink: 0;
`;
const MainArea = styled.div `
  height: 100%;
  padding: 16px 0;
  overflow-y: auto;
`;
const HorizontalScroll = styled.div `
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;

  > * {
    margin-left: 16px;
    flex-shrink: 0;
  }

  ::after {
    display: block;
    flex: 0 0 16px;
    content: '';
  }
`;
const Loading = styled.div.attrs({
    children: 'Loading...',
}) `
  font-size: 14px;
`;
const Overlay = styled(_Overlay) `
  display: flex;
  justify-content: center;
  align-items: center;
  `;
