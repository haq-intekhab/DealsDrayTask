import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-full h-fit">
      <Outlet />
    </div>
  )
};

export default Layout;