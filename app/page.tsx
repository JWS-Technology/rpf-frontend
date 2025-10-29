import DialPad from "./components/DialPad";
import EmergencySection from "./components/EmergencySection";
import Footer from "./components/Footer";
import IssueSelector from "./components/IssueSelector";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="bg-white min-h-screen flex flex-col items-center py-14 px-3 space-y-14">
        <IssueSelector />
        <DialPad />
        <EmergencySection />
      </div>
      <Footer />
    </div>
  );
}
