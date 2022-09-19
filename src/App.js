import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import MainNavigation from "./components/layout/MainNavigation";
import AdminVideos from "./components/videoGrid/AdminVideos";

import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage";
import MyPage from "./pages/MyPage";
import UserListPage from "./pages/UserListPage";

import AuthContext from "./store/auth-context";
import AnalysisPage from "./pages/AnalysisPage";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Router>
      <MainNavigation />
      <Routes>
        <Route path="/" exact element={<MainPage />} />
        {!authCtx.isLoggedIn && <Route path="/auth" element={<AuthPage />} />}
        {authCtx.isLoggedIn && <Route path="/my-page" element={<MyPage />} />}
        <Route path="/user-list" element={<UserListPage />} />
        <Route path="/video-list" element={<AdminVideos />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
