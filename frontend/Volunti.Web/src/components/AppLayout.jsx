import Sidebar from "./sidebar/Sidebar";
import "./AppLayout.css";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout-main">{children}</div>
    </div>
  );
}
