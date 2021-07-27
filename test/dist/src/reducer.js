"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
const immer_1 = __importDefault(require("immer"));
const util_1 = require("./util");
const initialState = {
    filterValue: '',
    cardsOrder: {},
};
exports.reducer = immer_1.default((draft, action) => {
    var _a, _b, _c, _d, _e, _f, _g;
    switch (action.type) {
        case 'Filter.SetFilter': {
            const { value } = action.payload;
            draft.filterValue = value;
            return;
        }
        case 'App.SetColumns': {
            const { columns } = action.payload;
            draft.columns = columns;
            return;
        }
        case 'App.SetCards': {
            const { cards: unorderedCards, cardsOrder } = action.payload;
            draft.cardsOrder = cardsOrder;
            (_a = draft.columns) === null || _a === void 0 ? void 0 : _a.forEach(column => {
                column.cards = util_1.sortBy(unorderedCards, cardsOrder, column.id);
            });
            return;
        }
        case 'Card.SetDeletingCard': {
            const { cardID } = action.payload;
            draft.deletingCardID = cardID;
            return;
        }
        case 'Dialog.ConfirmDelete': {
            const cardID = draft.deletingCardID;
            if (!cardID)
                return;
            draft.deletingCardID = undefined;
            const column = (_b = draft.columns) === null || _b === void 0 ? void 0 : _b.find(col => { var _a; return (_a = col.cards) === null || _a === void 0 ? void 0 : _a.some(c => c.id === cardID); });
            if (!(column === null || column === void 0 ? void 0 : column.cards))
                return;
            column.cards = column.cards.filter(c => c.id !== cardID);
            const patch = util_1.reorderPatch(draft.cardsOrder, cardID);
            draft.cardsOrder = {
                ...draft.cardsOrder,
                ...patch,
            };
            return;
        }
        case 'Dialog.CancelDelete': {
            draft.deletingCardID = undefined;
            return;
        }
        case 'Card.StartDragging': {
            const { cardID } = action.payload;
            draft.draggingCardID = cardID;
            return;
        }
        case 'Card.Drop': {
            const fromID = draft.draggingCardID;
            if (!fromID)
                return;
            draft.draggingCardID = undefined;
            const { toID } = action.payload;
            if (fromID === toID)
                return;
            const patch = util_1.reorderPatch(draft.cardsOrder, fromID, toID);
            draft.cardsOrder = {
                ...draft.cardsOrder,
                ...patch,
            };
            const unorderedCards = (_d = (_c = draft.columns) === null || _c === void 0 ? void 0 : _c.flatMap(c => { var _a; return (_a = c.cards) !== null && _a !== void 0 ? _a : []; })) !== null && _d !== void 0 ? _d : [];
            (_e = draft.columns) === null || _e === void 0 ? void 0 : _e.forEach(column => {
                column.cards = util_1.sortBy(unorderedCards, draft.cardsOrder, column.id);
            });
            return;
        }
        case 'InputForm.SetText': {
            const { columnID, value } = action.payload;
            const column = (_f = draft.columns) === null || _f === void 0 ? void 0 : _f.find(c => c.id === columnID);
            if (!column)
                return;
            column.text = value;
            return;
        }
        case 'InputForm.ConfirmInput': {
            const { columnID, cardID } = action.payload;
            const column = (_g = draft.columns) === null || _g === void 0 ? void 0 : _g.find(c => c.id === columnID);
            if (!(column === null || column === void 0 ? void 0 : column.cards))
                return;
            column.cards.unshift({
                id: cardID,
                text: column.text,
            });
            column.text = '';
            const patch = util_1.reorderPatch(draft.cardsOrder, cardID, draft.cardsOrder[columnID]);
            draft.cardsOrder = {
                ...draft.cardsOrder,
                ...patch,
            };
            return;
        }
        default: {
            const _ = action;
        }
    }
}, initialState);
