import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '@/modules/home';

// Demo component to test the landing page
export default function LandingDemo() {
    return (
        <BrowserRouter>
            <HomePage />
        </BrowserRouter>
    );
}
