import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { Box, Toolbar } from "@mui/material";
// import Sidebar from "./components/dashboard/sidebar";
import AllProducts from "./pages/product/allProducts";
import AddFeelings from "./pages/feelings/feelings";
import Forms from "./pages/product/add-forms/forms";
import Sidebar from "./components/dashboard/sidebar";
// import AddProduct from "./pages/product/add-forms/AddProduct";
import AddProduct from "./pages/product/addProduct";
import Test from "./pages/test/test";
import ProductDetails from "./pages/product/details";
import Sell from "./pages/POS/sell";
import Order from "./pages/POS/order";
import Login from "./pages/login/login";
import Analytics from "./pages/analytics";
function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          {/* <Sidebar /> */}
          <Box component="main" sx={{ flexGrow: 1,  }}>
            {/* <Toolbar /> */}
            <Routes>
              <Route path="/" element={<Sidebar> <Dashboard /> </Sidebar>} />
              <Route path="/login" element={<Login />} />
              <Route path="/addProduct" element={<AddProduct />} />
              <Route path="/updateProduct/:id" element={<AddProduct />} />
              <Route path="/ViewProducts" element={<Sidebar>  <AllProducts /> </Sidebar>} />
              <Route path="/product/:slug" element={<Sidebar>  <ProductDetails /> </Sidebar>} />
              <Route path="/sell/:slug" element={<Sidebar>  <Sell /> </Sidebar>} />
              <Route path="/order/:slug" element={<Sidebar>  <Order /> </Sidebar>} />
              <Route path="/Analytics" element={<Sidebar>  <Analytics /> </Sidebar>} />


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
