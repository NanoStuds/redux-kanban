import React from 'react';
import styled from 'styled-components';
export function Overlay({ onClick, className, children, }) {
    return (React.createElement(Container, { className: className, onClick: ev => {
            if (ev.target !== ev.currentTarget)
                return;
            onClick === null || onClick === void 0 ? void 0 : onClick();
        } }, children));
}
const Container = styled.div `
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 8%, 0.4);
`;
