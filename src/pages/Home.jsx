import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import DocumentSection from "../components/DocumentSection";
import AnalysisSection from "../components/AnalysisSection";
import LiveChatSection from "../components/LiveChatSection";
import LawyerConnectSection from "../components/LawyerConnectSection";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <DocumentSection />
      <AnalysisSection />
      <LiveChatSection />
      <LawyerConnectSection />
      <Footer />
    </>
  );
}
