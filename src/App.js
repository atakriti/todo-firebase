import React from "react";
import Todos from "./Todos";
import {Routes,Route} from "react-router-dom"
import Register from "./Register";
import Header from "./Header";
import "./index.css"
import Home from "./Home";
function App() {
  return (
    <div className="min-h-screen border-2 max-w-7xl mx-auto ">
      <Header/>
      <Routes>

        <Route path="/todos" element={<Todos />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
    </div>
  );
}

export default App;
