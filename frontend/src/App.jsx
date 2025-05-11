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

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";

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
  const { isLoading, authUser } = useAuthUser();
  // console.log(authUser);
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme="dark">
      {/* SETTING UP OUR ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Homepage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        ></Route>

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignupPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <NotificationPage /> : <Navigate to="/login" />
          }
        />

        {/* FURHTER STEP CAN BE:
          - IF USER IS AUTHENTICATED -> SHOW ONBOARDING PAGE
          - IF USER HAS ALREADY ONBOARDED, NAVIGATE TO LOGIN PAGE
            */}

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
