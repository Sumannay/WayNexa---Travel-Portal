import { AlertCircle, X } from "lucide-react";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import BrowseLayout from "./components/BrowseLayout";
import RequireAdmin from "./components/RequireAdmin";
import RequireAuth from "./components/RequireAuth";
import { WayNexaProvider } from "./context/WayNexa";
import { useWayNexa } from "./context/WayNexaContext";
import AdminDashboard from "./pages/AdminDashboard";
import AITravelAssistant from "./pages/AITravelAssistant";
import AuthPage from "./pages/AuthPage";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import DestinationDetails from "./pages/DestinationDetails";
import Explore from "./pages/Explore";
import FavoritesPage from "./pages/FavoritesPage";
import Flights from "./pages/Flights";
import Home from "./pages/Home";
import HotelDetailsPage from "./pages/HotelDetailsPage";
import Hotels from "./pages/Hotels";
import InfoPage from "./pages/InfoPage";
import Profile from "./pages/Profile";
import ReviewsPage from "./pages/ReviewsPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import Transport from "./pages/Transport";
import TripBuilder from "./pages/TripBuilder";
import Trips from "./pages/Trips";

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fbfaf7] px-6 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[#4a8558]">WayNexa</p>
        <h1 className="mt-3 text-7xl font-black tracking-tighter">404</h1>
        <h2 className="mt-2 text-2xl font-black">That path has drifted away.</h2>
        <p className="mt-3 text-slate-500">Let’s get you back to somewhere beautiful.</p>
        <a href="/" className="mt-7 inline-block rounded-full bg-[#183927] px-5 py-3 text-sm font-bold text-white">
          Go home
        </a>
      </div>
    </main>
  );
}

function ActivityTracker() {
  const { user, trackActivity } = useWayNexa();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user) return;
    const section = pathname.split("/").filter(Boolean)[0] || "home";
    void trackActivity("page_view", { section });
  }, [pathname, trackActivity, user]);

  return null;
}

function AccountServiceNotice() {
  const { accountError, dismissAccountError } = useWayNexa();
  if (!accountError) return null;
  return (
    <div role="alert" className="fixed inset-x-4 top-24 z-[100] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-rose-200 bg-white p-4 text-sm text-rose-800 shadow-xl sm:left-auto sm:right-4 sm:mx-0">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 font-semibold">{accountError}</p>
      <button type="button" onClick={dismissAccountError} aria-label="Dismiss account notice" className="rounded-lg p-1 hover:bg-rose-50">
        <X size={17} />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <WayNexaProvider>
      <BrowserRouter>
        <ActivityTracker />
        <AccountServiceNotice />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<BrowseLayout />}>
            <Route path="/explore" element={<Explore />} />
            <Route path="/destinations" element={<Navigate to="/explore" replace />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/destination/:id" element={<DestinationDetails />} />
            <Route path="/places/:id" element={<DestinationDetails />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetailsPage />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:id" element={<Trips />} />
            <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/:resource" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          </Route>
          <Route path="/booking" element={<RequireAuth><Booking /></RequireAuth>} />
          <Route path="/booking/:id" element={<RequireAuth><Booking /></RequireAuth>} />
          <Route path="/confirmation" element={<RequireAuth><Confirmation /></RequireAuth>} />
          <Route path="/confirmation/:id" element={<RequireAuth><Confirmation /></RequireAuth>} />
          <Route path="/trips/create" element={<TripBuilder />} />
          <Route path="/trip-builder" element={<TripBuilder />} />
          <Route path="/ai-assistant" element={<AITravelAssistant />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<InfoPage kind="forgot" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </WayNexaProvider>
  );
}
