import React from "react";
import "./index.css";

import { Navigate, Route, Routes } from "react-router";
import Homepage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

import { Toaster } from "react-hot-toast";

import { axiosInstance } from "./lib/axios.js";
import { useQuery } from "@tanstack/react-query";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

const App = () => {
    // tanstack query basic tutorial
    // query & mutations
    // mutations: used with post,put,patch & delete requests
    // query: used with get requests

    // const { data, isLoading, error } = useQuery({
    //     queryKey: ["todos"],
    //     queryFn: async () => {
    //         // Using FETCH
    //         // const res = await fetch(
    //         //     "https://jsonplaceholder.typicode.com/todos"
    //         // );

    //         // const data = await res.json();

    //         // Using AXIOS
    //         const res = await axios.get(
    //             "https://jsonplaceholder.typicode.com/todos"
    //         );
    //         return res.data;
    //     },
    // });

    // console.log("DATA:", { data });
    // console.log({ isLoading });
    // console.log({ error });

    // USING TANSTACK QUERY to get authenticated user
    const {
        data: authData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await axiosInstance.get("/auth/me");
            return res.data;
        },
        retry: false, // auth check (do not retry to do request)
    });

    // console.log(authData?.data.user);
    const authUser = authData?.data.user;

    return (
        <div className="h-screen" data-theme="night">
            {/* SETTING UP OUR ROUTES */}
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <Homepage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/signup"
                    element={!authUser ? <SignupPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <LoginPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/notifications"
                    element={
                        authUser ? (
                            <NotificationPage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/onboarding"
                    element={
                        authUser ? <OnboardingPage /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/call"
                    element={authUser ? <CallPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/chat"
                    element={authUser ? <ChatPage /> : <Navigate to="/login" />}
                />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
