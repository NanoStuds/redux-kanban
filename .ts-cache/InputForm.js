import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as color from './color';
import { Button, ConfirmButton } from './Button';
export function InputForm({ value, onChange, onConfirm, onCancel, className, }) {
    const disabled = !(value === null || value === void 0 ? void 0 : value.trim());
    const handleConfirm = () => {
        if (disabled)
            return;
        onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm();
    };
    const ref = useAutoFitToContentHeight(value);
    return (React.createElement(Container, { className: className },
        React.createElement(Input, { autoFocus: true, placeholder: "Enter a note", value: value, onChange: ev => onChange === null || onChange === void 0 ? void 0 : onChange(ev.currentTarget.value), onKeyDown: ev => {
                if (!((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter'))
                    return;
                handleConfirm();
            } }),
        React.createElement(ButtonRow, null,
            React.createElement(AddButton, { disabled: disabled, onClick: handleConfirm }),
            React.createElement(CancelButton, { onClick: onCancel }))));
}
/**
  * テキストエリアの高さを内容に合わせて自動調整する
  *
  * @param content テキストエリアの内容
  */
function useAutoFitToContentHeight(content) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const { borderTopWidth, borderBottomWidth } = getComputedStyle(el);
        el.style.height = 'auto'; // 一度 auto にしないと高さが縮まなくなる
        el.style.height = `calc(${borderTopWidth} + ${el.scrollHeight}px + ${borderBottomWidth})`;
    }, 
    // 内容が変わるたびに高さを再計算
    [content]);
    return ref;
}
const Container = styled.div ``;
const Input = styled.textarea `
  display: block;
  width: 100%;
  margin-bottom: 8px;
  border: solid 1px ${color.Silver};
  border-radius: 3px;
  padding: 6px 8px;
  background-color: ${color.White};
  font-size: 14px;
  line-height: 1.7;

  :focus {
    outline: none;
    border-color: ${color.Blue};
  }
`;
const ButtonRow = styled.div `
  display: flex;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;
const AddButton = styled(ConfirmButton).attrs({
    children: 'Add',
}) ``;
const CancelButton = styled(Button).attrs({
    children: 'Cancel',
}) ``;
