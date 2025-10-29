import DialPad from "./components/DialPad";
import EmergencySection from "./components/EmergencySection";
import Footer from "./components/Footer";
import IssueSelector from "./components/IssueSelector";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
   <div className="bg-white min-h-screen">
    <Navbar />
    <IssueSelector />
    <DialPad />
    <EmergencySection />
    <Footer />
   </div>
  );
}
