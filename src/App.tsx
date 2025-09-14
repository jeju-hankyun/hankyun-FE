import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import React from 'react';
import AuthRouter from './AuthRouter';

function App() {
  return (
    <Router>
      <AuthRouter />
    </Router>
  );
}

export default App;
