import React from "react";
import "./App.css";
import Member from "./pages/Member";
import Paket from "./pages/Paket";
import User from "./pages/User";
import Transaksi from "./pages/Transaksi";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import FormTransaksi from "./pages/FormTransaksi";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar><Dashboard /><Footer /></Navbar>} />
                <Route path="/auth" element={<Login />} />
                <Route path="/member"
                    element={<Navbar><Member /><Footer /></Navbar>} />
                <Route path="/paket"
                    element={<Navbar><Paket /><Footer /></Navbar>} />
                <Route path="/user"
                    element={<Navbar><User /><Footer /></Navbar>} />
                <Route path="/transaksi"
                    element={<Navbar><Transaksi /><Footer /></Navbar>} />
                <Route path="/form_transaksi"
                    element={<Navbar><FormTransaksi /><Footer /></Navbar>} />
            </Routes>
        </BrowserRouter>
    );
} 
