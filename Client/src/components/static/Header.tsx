import { useState } from "react";
import Logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../global/store";
import { UserType } from "../../global/useReducer";
import { logOut } from "../../global/useReducer";
import { FiShoppingCart, FiLogOut } from "react-icons/fi";
import UpdateProfileModal from "../../pages/Update_Profile"; // Adjust the path as needed

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as UserType | null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const handleProfileClick = () => {
    setShowProfileForm(true);
  };

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    // Close mobile menu after clicking a link
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    dispatch(logOut());
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="w-full h-auto px-[15px] bg-[#1c1a32] flex justify-between items-center relative">
      {/* Logo */}
      <div className="flex items-center justify-center py-2">
        <img
          src={Logo || "/placeholder.svg"}
          alt="Logo"
          className="w-[100px] h-[100px] tablet:w-[80px] tablet:h-[80px] mobile:w-[60px] mobile:h-[60px] object-cover"
        />
        <p className="text-[30px] tablet:text-[26px] mobile:text-[22px] font-bold text-white">
          QuickCart
        </p>
      </div>

      {/* Mobile Menu Button - Only visible on mobile and tablet */}
      <button
        onClick={toggleMobileMenu}
        className="hidden tablet:flex mobile:flex flex-col justify-center items-center gap-[6px] z-20 p-2"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-[30px] h-[3px] bg-white transition-all duration-300 ${
            mobileMenuOpen ? "transform rotate-45 translate-y-[9px]" : ""
          }`}
        ></span>
        <span
          className={`block w-[30px] h-[3px] bg-white transition-all duration-300 ${
            mobileMenuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block w-[30px] h-[3px] bg-white transition-all duration-300 ${
            mobileMenuOpen ? "transform -rotate-45 -translate-y-[9px]" : ""
          }`}
        ></span>
      </button>

      {/* Navigation Links - Hidden on mobile and tablet */}
      <ul className="flex items-center justify-center gap-[30px] tablet:hidden mobile:hidden">
        <Link to={"/"}>
          <li className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]">
            Home
          </li>
        </Link>
        <Link to={"/product"}>
          <li className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]">
            Products
          </li>
        </Link>
        <li
          className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]"
          onClick={() => handleScroll("about")}
        >
          About
        </li>
        <li
          className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]"
          onClick={() => handleScroll("contact")}
        >
          Contact
        </li>
      </ul>

      {/* Login/Register or User Profile - Hidden on mobile and tablet */}
      <div className="flex items-center justify-center gap-[20px] tablet:hidden mobile:hidden">
        {user ? (
          <div className="flex items-center gap-7">
            <Link to="/cart">
              <div className="relative cursor-pointer">
                <FiShoppingCart className="text-white text-2xl hover:text-[#e67e22] transition-colors" />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#e67e22] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
                </div>
            </Link>

            <div
              className="flex items-center gap-2 text-white transition duration-300 hover:cursor-pointer hover:underline"
              onClick={handleProfileClick}
            >
              <img
                src={user?.profileImages || "/default-avatar.png"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#e67e22]" 
              />
              <span className="text-white text-[17px] font-semibold">
                {user.firstname}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-white text-[17px] bg-[#e67e22] rounded-sm px-3 py-2 hover:bg-[#d35400] transition-colors w-[150px] justify-center"
            >
              <FiLogOut className="text-lg" />
              Logout
            </button>

            {showProfileForm && (
              <UpdateProfileModal
                user={user}
                onClose={() => setShowProfileForm(false)}
              />
            )}
          </div>
        ) : (
          <>
            <Link to={"/login"}>
              <button className="text-white text-[17px] bg-[#e67e22] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 px-[20px] py-[10px] w-[150px]">
                Login
              </button>
            </Link>
            <Link to={"/register"}>
              <button className="text-white text-[17px] px-[20px] py-[10px] bg-[#e67e22] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 w-[150px]">
                Register
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu - Only visible when toggled on mobile and tablet */}
      <div
        className={`fixed inset-0 bg-[#1c1a32] z-10 flex flex-col items-center justify-center transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } tablet:flex mobile:flex hidden`}
      >
        <ul className="flex flex-col items-center justify-center gap-[30px]">
          <Link to={"/"} onClick={() => setMobileMenuOpen(false)}>
            <li className="text-white text-[22px] mobile:text-[20px] list-none cursor-pointer hover:text-[#e67e22]">
              Home
            </li>
          </Link>
          <Link to={"/product"} onClick={() => setMobileMenuOpen(false)}>
            <li className="text-white text-[22px] mobile:text-[20px] list-none cursor-pointer hover:text-[#e67e22]">
              Products
            </li>
          </Link>
          <li
            className="text-white text-[22px] mobile:text-[20px] list-none cursor-pointer hover:text-[#e67e22]"
            onClick={() => handleScroll("about")}
          >
            About
          </li>
          <li
            className="text-white text-[22px] mobile:text-[20px] list-none cursor-pointer hover:text-[#e67e22]"
            onClick={() => handleScroll("contact")}
          >
            Contact
          </li>
        </ul>

        {/* Login/Register or User Profile for Mobile Menu */}
        <div className="mt-[40px] mobile:mt-[30px]">
          {user ? (
            <div className="flex flex-col gap-5">
              <div
                className="flex flex-col items-center gap-2"
                onClick={handleProfileClick}
              >
                {/* <img
                  src={user.profileImages || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#e67e22]"
                /> */}
                <span className="text-white text-[22px] mobile:text-[20px] list-none cursor-pointer hover:text-[#e67e22]">
                  Profile
                </span>
              </div>

              <div className="ml-5 ">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-white text-[17px] bg-[#e67e22] rounded-sm px-3 py-2 hover:bg-[#d35400] transition-colors w-[150px] justify-center"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>

                {showProfileForm && (
                  <UpdateProfileModal
                    user={user}
                    onClose={() => setShowProfileForm(false)}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-[20px] flex-col">
              <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
                <button className="text-white text-[18px] bg-[#e67e22]rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 px-[30px] py-[12px] w-[200px] mobile:w-[180px]">
                  Login
                </button>
              </Link>
              <Link to={"/register"} onClick={() => setMobileMenuOpen(false)}>
                <button className="text-white text-[18px] px-[30px] py-[12px] bg-[#e67e22] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 w-[200px] mobile:w-[180px]">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
