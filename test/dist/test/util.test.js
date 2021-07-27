"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baretest_1 = __importDefault(require("baretest"));
const assert_1 = __importDefault(require("assert"));
const util_1 = require("../src/util");
const test = baretest_1.default('util');
setImmediate(() => test.run());
test('randomID: 重複しない', async () => {
    // 10,000 程度なら重複する確率はゼロ
    const size = 10000;
    const unique = new Set();
    for (let i = 0; i < size; i++) {
        const id = util_1.randomID();
        unique.add(id);
    }
    // Set オブジェクトは重複した値を保持しないので、id が重複すると unique.size の値が size より小さくなる
    assert_1.default.equal(unique.size, size);
});
test('randomID: 書式パターンどおりに生成される', async () => {
    const pattern = /^[0-9A-Za-z_-]{12}$/;
    const id = util_1.randomID();
    assert_1.default.ok(pattern.test(id), `${id} does not match ${pattern}`);
});
test('sortBy', async () => {
    const sorted = util_1.sortBy([
        {
            id: '3',
        },
        {
            id: '2',
        },
        {
            id: '1',
        },
    ], {
        A: '1',
        '1': '2',
        '1.5': null,
        '2': 'A',
        B: '3',
        '3': 'B',
    }, 'A');
    const expected = [
        {
            id: '1',
        },
        {
            id: '2',
        },
    ];
    assert_1.default.deepStrictEqual(sorted, expected);
});
test('reorderPatch', async () => {
    const patch = util_1.reorderPatch({
        A: '1',
        '1': '2',
        '1.5': null,
        '2': 'A',
        B: '3',
        '3': 'B',
    }, '1', 'A');
    const expected = {
        A: '2',
        '2': '1',
        '1': 'A',
    };
    assert_1.default.deepStrictEqual(patch, expected);
});
