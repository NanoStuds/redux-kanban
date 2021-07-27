"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baretest_1 = __importDefault(require("baretest"));
const assert_1 = __importDefault(require("assert"));
const immer_1 = __importDefault(require("immer"));
const reducer_1 = require("../src/reducer");
const test = baretest_1.default('reducer');
setImmediate(() => test.run());
const initialState = {
    filterValue: '',
    cardsOrder: {},
};
test('Filter.SetFilter', async () => {
    const prev = immer_1.default(initialState, draft => {
        draft.filterValue = 'hello';
    });
    const next = reducer_1.reducer(prev, {
        type: 'Filter.SetFilter',
        payload: {
            value: 'welcome',
        },
    });
    const expected = immer_1.default(prev, draft => {
        draft.filterValue = 'welcome';
    });
    assert_1.default.deepStrictEqual(next, expected);
});
test('App.SetCards', async () => {
    const prev = immer_1.default(initialState, draft => {
        draft.columns = [
            {
                id: 'A',
            },
            {
                id: 'B',
            },
        ];
    });
    const next = reducer_1.reducer(prev, {
        type: 'App.SetCards',
        payload: {
            cards: [
                {
                    id: '3',
                },
                {
                    id: '2',
                },
                {
                    id: '1',
                },
            ],
            cardsOrder: {
                A: '1',
                '1': '2',
                '2': 'A',
                B: '3',
                '3': 'B',
            },
        },
    });
    const expected = immer_1.default(prev, draft => {
        draft.cardsOrder = {
            A: '1',
            '1': '2',
            '2': 'A',
            B: '3',
            '3': 'B',
        };
        draft.columns = [
            {
                id: 'A',
                cards: [
                    {
                        id: '1',
                    },
                    {
                        id: '2',
                    },
                ],
            },
            {
                id: 'B',
                cards: [
                    {
                        id: '3',
                    },
                ],
            },
        ];
    });
    assert_1.default.deepStrictEqual(next, expected);
});
test('Dialog.ConfirmDelete', async () => {
    const prev = immer_1.default(initialState, draft => {
        draft.deletingCardID = '3';
        draft.cardsOrder = {
            A: '1',
            '1': '2',
            '2': 'A',
            B: '3',
            '3': 'B',
        };
        draft.columns = [
            {
                id: 'A',
                cards: [
                    {
                        id: '1',
                    },
                    {
                        id: '2',
                    },
                ],
            },
            {
                id: 'B',
                cards: [
                    {
                        id: '3',
                    },
                ],
            },
        ];
    });
    const next = reducer_1.reducer(prev, {
        type: 'Dialog.ConfirmDelete',
    });
    const expected = immer_1.default(prev, draft => {
        draft.deletingCardID = undefined;
        draft.cardsOrder = {
            ...draft.cardsOrder,
            B: 'B',
            '3': null,
        };
        const column = draft.columns[1];
        column.cards = [];
    });
    assert_1.default.deepStrictEqual(next, expected);
});
test('Card.Drop', async () => {
    const prev = immer_1.default(initialState, draft => {
        draft.draggingCardID = '1';
        draft.cardsOrder = {
            A: '1',
            '1': '2',
            '2': 'A',
            B: '3',
            '3': 'B',
        };
        draft.columns = [
            {
                id: 'A',
                cards: [
                    {
                        id: '1',
                    },
                    {
                        id: '2',
                    },
                ],
            },
            {
                id: 'B',
                cards: [
                    {
                        id: '3',
                    },
                ],
            },
        ];
    });
    const next = reducer_1.reducer(prev, {
        type: 'Card.Drop',
        payload: {
            toID: '3',
        },
    });
    const expected = immer_1.default(prev, draft => {
        draft.draggingCardID = undefined;
        draft.cardsOrder = {
            ...draft.cardsOrder,
            A: '2',
            B: '1',
            '1': '3',
        };
        const [card] = draft.columns[0].cards.splice(0, 1);
        draft.columns[1].cards.unshift(card);
    });
    assert_1.default.deepStrictEqual(next, expected);
});
test('InputForm.ConfirmInput', async () => {
    const prev = immer_1.default(initialState, draft => {
        draft.cardsOrder = {
            A: '1',
            '1': '2',
            '2': 'A',
            B: '3',
            '3': 'B',
        };
        draft.columns = [
            {
                id: 'A',
                text: 'hello',
                cards: [
                    {
                        id: '1',
                    },
                    {
                        id: '2',
                    },
                ],
            },
            {
                id: 'B',
                cards: [
                    {
                        id: '3',
                    },
                ],
            },
        ];
    });
    const next = reducer_1.reducer(prev, {
        type: 'InputForm.ConfirmInput',
        payload: {
            columnID: 'A',
            cardID: 'new',
        },
    });
    const expected = immer_1.default(prev, draft => {
        draft.cardsOrder = {
            ...draft.cardsOrder,
            A: 'new',
            new: '1',
        };
        const column = draft.columns[0];
        column.text = '';
        column.cards.unshift({
            id: 'new',
            text: 'hello',
        });
    });
    assert_1.default.deepStrictEqual(next, expected);
});
