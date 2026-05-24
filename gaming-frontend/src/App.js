import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Games from "./pages/Games";
import Wishlist from "./pages/Wishlist";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import GameDetails from "./pages/GameDetails";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import PurchaseHistory from "./pages/PurchaseHistory";
import Receipt from "./pages/Receipt";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/games" element={<Games />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<PurchaseHistory />} />
        <Route path="/receipt/:id" element={<Receipt />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;