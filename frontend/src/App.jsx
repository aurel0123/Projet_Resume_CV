// filepath: /c:/Users/CHRISTO/Downloads/Projet_Resume_CV/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./composant/Home";
import Register from "./composant/pages/Register";
import Login from "./composant/pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;