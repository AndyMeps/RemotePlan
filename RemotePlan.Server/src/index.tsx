import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootNode = document.getElementById('app');
ReactDOM.render(<BrowserRouter>
    <App />
</BrowserRouter>, rootNode);
