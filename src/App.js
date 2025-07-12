import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./components/dashboard/sidebar";
import ViewProducts from "./pages/product/viewProducts";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ViewProducts" element={<ViewProducts />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </div>
  );
}

export default App;
