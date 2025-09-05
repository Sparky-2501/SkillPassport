import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (visited) {
      setHasVisited(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {!hasVisited ? (
          <Route path="*" element={<Landing setHasVisited={setHasVisited} />} />
        ) : (
          <Route path="*" element={<Dashboard />} />
        )}
      </Routes>
    </Router>
  );
}