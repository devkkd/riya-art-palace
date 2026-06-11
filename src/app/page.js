import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryBanner from "./components/CategoryBanner";
import Collections from "./components/Collections";
import BestSelling from "./components/BestSelling";
import AboutSection from "./components/AboutSection";
import Global from "./components/Global";
import Reviews from "./components/Reviews";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Story from "./components/Story"
import ValuesSection from "./components/ValuesSection.jsx";
import FollowUs from "./components/FollowUs";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CategoryBanner />
      <Collections />
      <BestSelling />
      <AboutSection />
      <Story />
      <Global />
      <Reviews />
      <ContactSection />
      <ValuesSection />
      <FollowUs />
      <Footer />
    </>
  );
}