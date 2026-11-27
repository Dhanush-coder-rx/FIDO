
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './Components/LoginPages/Home';
import Login from './Components/LoginPages/Login';
import Register from './Components/LoginPages/Register';
import UserDashboard from './Components/Dashboard/UserDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
