import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Findadoctor from "./pages/Findadoctor";
import AskDoctor from "./pages/AskDoctor";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import Corporates from "./pages/Corporates";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";  


function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/find-a-doctor" element={<Findadoctor/>} />
        <Route path="/ask-a-question" element={<AskDoctor/>} /> 
        <Route path="/medical-services" element={<Services/>} />
        <Route path="/blogs" element={<Blogs/>} />
        <Route path="/corporates" element={<Corporates/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} /> 
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;