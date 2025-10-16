import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { Box, Toolbar } from "@mui/material";
// import Sidebar from "./components/dashboard/sidebar";
import ViewProducts from "./pages/product/viewProducts";
import AddFeelings from "./pages/feelings/feelings";
import Forms from "./pages/product/add-forms/forms";
import Sidebar from "./components/dashboard/sidebar";
// import AddProduct from "./pages/product/add-forms/AddProduct";
import AddProduct from "./pages/product/addProduct";
import Test from "./pages/test/test";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          {/* <Sidebar /> */}
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {/* <Toolbar /> */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/addProduct" element={<AddProduct />} />
              <Route path="/ViewProducts" element={<Sidebar>  <ViewProducts /> </Sidebar>} />
              <Route path="/feelings" element={<AddFeelings />} />
              <Route path="/forms" element={<Sidebar> <Forms /> </Sidebar>} />
              <Route path="/Test" element={<Test />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </div>
  );
}

export default App;
