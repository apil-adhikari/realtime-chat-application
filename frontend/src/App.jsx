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

    const { data, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await axiosInstance.get("/users/me");
            return res.data;
        },
        retry: false,
    });

    console.log(data);

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
