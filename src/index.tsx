import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter} from 'react-router-dom';

import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    <React.StrictMode>
        {/* Pour être déployé sur des hébergeurs static style GitHub pages */}
        {/* Peut être facilement changer par BrowserRouter si plus utile */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
