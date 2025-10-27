import IssueSelector from "./components/IssueSelector";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
   <div className="bg-white min-h-screen">
    <Navbar />
    <IssueSelector />
   </div>
  );
}
