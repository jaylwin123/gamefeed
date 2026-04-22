import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import EditionView from "./pages/EditionView";
import NewsArticle from "./pages/NewsArticle";
import GamePage from "./pages/GamePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/edition/:id" element={<EditionView />} />
      <Route path="/news/:newsletterId/:newsIndex" element={<NewsArticle />} />
      <Route path="/game/:slug" element={<GamePage />} />
    </Routes>
  );
}
