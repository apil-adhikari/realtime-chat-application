import React from "react";
import "./index.css";

import { Route, Routes } from "react-router";
import Homepage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

import { Toaster } from "react-hot-toast";
const App = () => {
    return (
        <div className="h-screen" data-theme="night">
            {/* SETTING UP OUR ROUTES */}

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/call" element={<CallPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
