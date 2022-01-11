import * as React from "react";
import { Home, Room } from "@views";
import { createGlobalStyle, ThemeProvider, DefaultTheme } from "styled-components";
import { Routes, Route } from "react-router-dom";

const theme: DefaultTheme = {
  colors: {
    background: {
      one: '#121212',
      two: '#212121',
      three: '#616161',
      four: '#757575',
      five: '#fff',
    },
    text: {
      primary: '#121212',
      contrast: '#fff',
      alternativeContrast: '#121212',
    },
    primary: '#028fa3',
    danger: '#8f0031',
    warn: '#f79b19'
  }
};
const AppStyle = createGlobalStyle`
  html {
    font-size: 14px;
  }

  html, body, #app {
    height: 100%;
    margin: 0;
  }

  body {
    background-color: ${props => props.theme.colors.background.one};
  }
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="room/:roomId" element={<Room />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
