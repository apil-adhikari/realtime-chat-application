import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UserIcon } from "lucide-react";

const Sidebar = () => {
  // Get authenticated user:
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname; // Gives the current url path

  return (
    <aside className="w-64 base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* LOGO */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex item-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-2xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            LinkUP
          </span>
        </Link>
      </div>

      {/* SIDEBAR */}
      <nav className="flex flex-col p-4 space-y-1">
        {/* HOME */}
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-75" />
          <span>Home</span>
        </Link>

        {/* FRIENDS */}
        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UserIcon className="size-5 text-base-content opacity-75" />
          <span>Friends</span>
        </Link>

        {/* NOTIFICATION */}
        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-75" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar ">
            <div className="w-10 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User avatar"
                className="animate-pulse"
              />
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullname}</p>

            <p className="text-sm text-success flex items-center gap-1 ">
              {/* DOT */}
              <span className="size-2 rounded-full bg-success inline-block animate-bounce" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
