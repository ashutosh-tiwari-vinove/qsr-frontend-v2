import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerPage from "./pages/customerPage";
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
          <Route path="/customer" element={<CustomerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

