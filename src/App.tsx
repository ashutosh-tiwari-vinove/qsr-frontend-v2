import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerPage from "./pages/customerPage";
import KitchenPage from "./pages/kitchenPage";
import OpsPage from "./pages/opsPage";
import LandingPage from "./pages/landingPage";
import { useCurrency } from "./hooks/useCurrency";
import "./App.css";

function CurrencyInitializer() {
  useCurrency();
  return null;
}

export default function App() {
  return (
    <div className="main-container">
      <BrowserRouter>
        <CurrencyInitializer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/ops" element={<OpsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

