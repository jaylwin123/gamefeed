import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import EditionView from "./pages/EditionView";
import NewsArticle from "./pages/NewsArticle";
import GamePage from "./pages/GamePage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edition/:id"
        element={
          <ProtectedRoute>
            <EditionView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:newsletterId/:newsIndex"
        element={
          <ProtectedRoute>
            <NewsArticle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/:slug"
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
