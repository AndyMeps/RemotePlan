import * as React from "react";
import { Home, Room } from "@views";
import { createGlobalStyle } from "styled-components";
import { Routes, Route } from "react-router-dom";

const AppStyle = createGlobalStyle`
  html {
    font-size: 14px;
  }

  html, body, #app {
    height: 100%;
    margin: 0;
  }
`;

const App = () => {
  return (
    <>
      <AppStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="room/:roomId" element={<Room />} />
      </Routes>
    </>
  );
};

export default App;
