import React from 'react';
import { createRoot } from 'react-dom/client';
import PrintableQuote from './print';
import './index.css';

createRoot(document.getElementById('root')!).render(<PrintableQuote />);
