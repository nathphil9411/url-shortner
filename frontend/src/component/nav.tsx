import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/Auth";

const Nav = () => {
  const UseAuth = useContext(AuthContext);
  const location = useLocation();
  return (
    <nav className="w-full bg-white  px-12 py-4 flex flex-row justify-between items-center">
      <Link to="/">
        <h1 className="font-bold text-xl text-violet-400">
          URL<span className="text-violet-500">SCISSOR</span>.
        </h1>
      </Link>

      <div className="flex flex-row gap-3">
        {!UseAuth?.user && (
          <Link
            to={"/auth?mode=login"}
            className="py-1.5 px-5 border border-violet-600 text-violet-600 rounded-md font-medium hover:bg-violet-500 hover:text-white duration-300 transition-all w-fit"
          >
            Login
          </Link>
        )}

        {UseAuth?.user && location.pathname.toLowerCase() !== "/dashboard" && (
          <Link
            to={"/dashboard"}
            className="py-1.5 px-5 border border-violet-600 text-violet-600 rounded-md font-medium hover:bg-violet-500 hover:text-white duration-300 transition-all w-fit"
          >
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
