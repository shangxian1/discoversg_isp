import './css/App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from 'react-router-dom';

import { ThemeProvider, CssBaseline, GlobalStyles, Box } from '@mui/material';
import { theme } from '../theme/theme';
import React, { useState, useEffect } from 'react';
import NavBar from './components/layout/Header';
import HeroCarousel from './components/home/HeroCarousel';
import ContentSection from './components/home/ContentSection';
import Footer from './components/layout/Footer';
import UserHome from './pages/UserHome';
import TripPlanner from './pages/ItineraryPlanner';
import Login from './pages/login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Activities from './pages/ActivitiesPage';
import Profile from './pages/Profile';
import ItineraryPage from './pages/ItineraryPage';
import ActivityDetails from './pages/ActivityDetails';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import YourActivities from './pages/YourActivities'

const HomeContent = () => (
  <>
    <HeroCarousel />
    <ContentSection />
  </>
);

const MainLayout = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
    <NavBar />

    <Box sx={{ flexGrow: 1 }}>
      <Outlet />
    </Box>

    <Footer />
  </Box>
);


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: { margin: 0, padding: 0, width: '100%', overflowX: 'hidden' },
        '#root': { width: '100%', maxWidth: '100%' }
      }} />

      <Routes>
        <Route element={<MainLayout />}>
          {/* Always show the Landing/Main Home Page at the root */}
          <Route path="/" element={<HomeContent />} />

          {/* Dedicated route for the User Home Page (Dashboard) */}
          <Route path="/home" element={<UserHome />} />

          <Route path="/activities" element={<Activities />} />
          <Route path="/planner" element={<TripPlanner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/feed' element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/activity/:id" element={<ActivityDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/your-activities" element={<YourActivities />} />

        </Route>
      </Routes>
    </ThemeProvider>
  );
}