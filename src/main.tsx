import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import App from "./App";
import "./index.css";
import './i18n';
import Register from "./components/auth/Register";
import Pricing from "./components/landing-page/Pricing";
import About from "./components/landing-page/About";
import Login from "./components/auth/Login";
import Beranda from "./components/after-login/Beranda";
import CustomHyperlink from "./components/after-login/CustomHyperlink";
import ViewOutput from "./components/after-login/ViewOutput";
import Output from "./components/after-login/Output";
import Catalog from "./components/after-login/Catalog";
import CustomCatalog from "./components/after-login/CustomCatalog";
import ViewCatalog from "./components/after-login/ViewCatalog";
import OutputCatalog from "./components/after-login/OutputCatalog";
import Statistik from "./components/after-login/Stastitik";
import Profile from "./components/after-login/Profile";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/custom-hyperlink/:id" element={<CustomHyperlink />} />
        <Route path="/view-output/:id" element={<ViewOutput />} />
        <Route path="/:domain/:id" element={<Output/>} />
        <Route path="/catalog" element={<Catalog/>} />
        <Route path="/custom-catalog/:id" element={<CustomCatalog />} />
        <Route path="/view-catalog/:id" element={<ViewCatalog />} />
        <Route path="/:domain/catalog/:id" element={<OutputCatalog />} />
        <Route path="/statistic" element={<Statistik />} />
        <Route path="/profile" element={<Profile />} />


      </Routes>
    </Router>
  </React.StrictMode>
);
