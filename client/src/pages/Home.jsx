import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Background from "../components/landing/Background";

import About from "../components/About";
import Features from "../components/Features";
import Footer from "../components/Footer";

import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <Background />
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Footer />
    </div>
  );
}

export default Home;