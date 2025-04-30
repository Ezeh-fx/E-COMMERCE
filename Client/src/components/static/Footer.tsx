import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a23] text-white px-6 py-10 ">
      <div className="flex gap-8 mx-auto text-[20px] w-7xl  justify-around">
        {/* About Us */}
        <div>
          <h3 className="mb-3 font-bold">ABOUT US</h3>
          <p>
            We deliver top-quality transportation vehicles with <br /> unbeatable reliability and performance. <br /> Your trusted partner for heavy-duty solutions.
          </p>
        </div>

      <div className="flex gap-8">
          {/* Quick Links */}
          <div>
          <h3 className="mb-3 font-bold">QUICK LINKS</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Products</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="mb-3 font-bold">CONTACT US</h3>
          <p>Email:<br />quicktrans@gmail.com</p>
          <p className="mt-2">Phone:<br />+123 456 7890</p>
          <div className="flex gap-4 mt-4 text-xl">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
      </div>

      <div className="mt-10 text-xs text-center">
        © 2025 QuickTrans. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
