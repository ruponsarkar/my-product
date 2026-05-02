import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { Box } from "@mui/material";
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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Reports from "./pages/reports";
import Users from "./pages/users";
import Settings from "./pages/settings";

const withProtection = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          {/* <Sidebar /> */}
          <Box component="main" sx={{ flexGrow: 1,  }}>
            {/* <Toolbar /> */}
            <Routes>
              <Route path="/" element={withProtection(<Sidebar> <Dashboard /> </Sidebar>)} />
              <Route path="/login" element={<Login />} />
              <Route path="/addProduct" element={withProtection(<Sidebar><AddProduct /></Sidebar>)} />
              <Route path="/updateProduct/:id" element={withProtection(<Sidebar><AddProduct /></Sidebar>)} />
              <Route path="/ViewProducts" element={withProtection(<Sidebar>  <AllProducts /> </Sidebar>)} />
              <Route path="/product/:slug" element={withProtection(<Sidebar>  <ProductDetails /> </Sidebar>)} />
              <Route path="/sell/:slug" element={withProtection(<Sidebar>  <Sell /> </Sidebar>)} />
              <Route path="/order/:slug" element={withProtection(<Sidebar>  <Order /> </Sidebar>)} />
              <Route path="/Analytics" element={withProtection(<Sidebar>  <Analytics /> </Sidebar>)} />
              <Route path="/users" element={withProtection(<Sidebar>  <Users /> </Sidebar>)} />
              <Route path="/settings" element={withProtection(<Sidebar>  <Settings /> </Sidebar>)} />
              <Route path="/reports" element={withProtection(<Sidebar>  <Reports /> </Sidebar>)} />


              <Route path="/feelings" element={withProtection(<AddFeelings />)} />
              <Route path="/forms" element={withProtection(<Sidebar> <Forms /> </Sidebar>)} />
              <Route path="/Test" element={withProtection(<Test />)} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </div>
  );
}

export default App;
