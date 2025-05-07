import { useState } from "react";
import Logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    // Close mobile menu after clicking a link
    setMobileMenuOpen(false);
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
        <p className="text-[30px] tablet:text-[26px] mobile:text-[22px] font-bold text-white">QuickCart</p>
      </div>

      {/* Mobile Menu Button - Only visible on mobile and tablet */}
      <button 
        onClick={toggleMobileMenu} 
        className="hidden tablet:flex mobile:flex flex-col justify-center items-center gap-[6px] z-20 p-2"
        aria-label="Toggle menu"
      >
        <span className={`block w-[30px] h-[3px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'transform rotate-45 translate-y-[9px]' : ''}`}></span>
        <span className={`block w-[30px] h-[3px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-[30px] h-[3px] bg-white transition-all duration-300 ${mobileMenuOpen ? 'transform -rotate-45 -translate-y-[9px]' : ''}`}></span>
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

      {/* Login/Register Button - Hidden on mobile and tablet */}
      <div className="flex items-center justify-center gap-[20px] tablet:hidden mobile:hidden">
        <Link to={"/login"}>
          <button className="text-white text-[17px] bg-[#24243e] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 px-[20px] py-[10px]">
            Login
          </button>
        </Link>
        <Link to={"/register"}>
          <button className="text-white text-[17px] px-[20px] py-[10px] bg-[#24243e] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300">
            Register
          </button>
        </Link>
      </div>

      {/* Mobile Menu - Only visible when toggled on mobile and tablet */}
      <div 
        className={`fixed inset-0 bg-[#1c1a32] z-10 flex flex-col items-center justify-center transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
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

        <div className="flex items-center justify-center gap-[20px] mt-[40px] mobile:mt-[30px] flex-col mobile:flex-col">
          <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
            <button className="text-white text-[18px] bg-[#24243e] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 px-[30px] py-[12px] w-[200px] mobile:w-[180px]">
              Login
            </button>
          </Link>
          <Link to={"/register"} onClick={() => setMobileMenuOpen(false)}>
            <button className="text-white text-[18px] px-[30px] py-[12px] bg-[#24243e] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 w-[200px] mobile:w-[180px]">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;