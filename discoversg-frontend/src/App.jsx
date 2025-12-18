import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  Outlet 
} from 'react-router-dom'; 

import { ThemeProvider, CssBaseline, GlobalStyles, Box } from '@mui/material';
import { theme } from '../theme/theme';

import NavBar from '../components/layout/Header';
import HeroCarousel from '../components/home/HeroCarousel';
import ContentSection from '../components/home/ContentSection';
import Footer from '../components/layout/Footer';

import TripPlanner from './pages/ItineraryPlanner'; 
import Login from './pages/login'; 
import SignUp from './pages/SignUp'; 

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { margin: 0, padding: 0, width: '100%', overflowX: 'hidden' }, '#root': { width: '100%', maxWidth: '100%' } }} />
      
      <Router>
        <Routes>
          
          <Route element={<MainLayout />}>
            
            <Route path="/" element={<HomeContent />} />
            
            <Route path="/planner" element={<TripPlanner />} />
            
            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<SignUp />} />
            
          </Route>
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}