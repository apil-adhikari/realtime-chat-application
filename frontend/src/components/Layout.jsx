import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSidebar }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col  ">
          <Navbar />

          {/* Main component to show should be passed a props to this component */}
          <main className="flex flex-1 overflow-y-auto"> {children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
