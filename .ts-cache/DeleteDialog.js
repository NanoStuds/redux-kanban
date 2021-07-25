import React from 'react';
import styled from 'styled-components';
import * as color from './color';
import { Button, DangerButton } from './Button';
export function DeleteDialog({ onConfirm, onCancel, className, }) {
    return (React.createElement(Container, { className: className },
        React.createElement(Message, null, "Are you sure to delete?"),
        React.createElement(ButtonRow, null,
            React.createElement(DeleteButton, { onClick: onConfirm }),
            React.createElement(CancelButton, { autoFocus: true, onClick: onCancel }))));
}
const Container = styled.div `
  min-width: 350px;
  box-shadow: 0 8px 12px hsla(0, 0%, 0%, 0.2);
  border: solid 1px ${color.Silver};
  border-radius: 4px;
  background-color: ${color.White};
`;
const Message = styled.div `
  min-height: 100px;
  padding: 16px;
  color: ${color.Black};
  font-size: 14px;
  line-height: 1.7;
`;
const ButtonRow = styled.div `
  display: flex;
  padding: 0 16px 16px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;
const DeleteButton = styled(DangerButton).attrs({
    children: 'Delete',
}) ``;
const CancelButton = styled(Button).attrs({
    children: 'Cancel',
}) ``;
