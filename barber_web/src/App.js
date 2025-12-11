// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientBooking from './containers/Client/ClientBooking';
import AdminDashboard from './containers/Admin/AdminDashboard'; 
import Layout from './containers/Layout'; // <-- ¡Solo importación!

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ClientBooking />} />
          <Route path="/admin" element={<AdminDashboard />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
// *** NO debe haber ninguna otra definición de 'Layout' aquí. ***