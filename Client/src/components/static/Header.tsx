import Logo from "../../assets/Logo.png"
import { Link } from "react-router-dom"

const Header = () => {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
    return (
        <div className="w-full h-auto px-[15px] bg-[#1c1a32] flex justify-between items-center">

            {/* Logo */}
            <div className="flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-[100px] h-[100px] object-cover" />
                <p className="text-[30px] font-bold text-white">
                    QuickCart
                </p>
            </div>

            {/* Navigation Links */}
            <ul className="flex items-center justify-center gap-[30px]">
            <Link to={"/"}>
            <li  className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]">Home</li>
            </Link>
            <Link to={"/product"}>
            <li  className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]">Products</li>
            </Link>
              <li  className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]" onClick={() => handleScroll("about")}>About</li>
              <li  className="text-white text-[17px] list-none cursor-pointer hover:text-[#e67e22]" onClick={() => handleScroll("contact")}>Contact</li>
                {/* <a  className="text-white text-[17px] hover:text-[#e67e22]">Login</a>
              <li  className="text-white text-[17px] hover:text-[#e67e22]">Register</a> */}
            </ul>

                
            {/* Login/Register Button */}
            <div className="flex items-center justify-center gap-[20px]">
               <Link to={"/login"}>
               <button className="text-white text-[17px] bg-[#24243e] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]  transition duration-300 px-[20px] py-[10px]">Login</button>
               </Link>
              <Link to={"/register"}>
               <button className="text-white text-[17px] px-[20px] py-[10px] bg-[#24243e] rounded-lg drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300">Register</button>
              </Link>
            </div>
        </div>
    ) 
}

export default Header
