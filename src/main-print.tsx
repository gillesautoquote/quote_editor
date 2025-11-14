import React from 'react';
import { createRoot } from 'react-dom/client';
import PrintableQuote from './print';
import './index.css';
import './Components/QuoteEditor/styles/print.css';

createRoot(document.getElementById('root')!).render(<PrintableQuote />);
