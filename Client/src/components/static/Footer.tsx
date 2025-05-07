import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a23] text-white px-6 py-10 tablet:px-4 mobile:px-3 mobile:py-8">
      <div className="flex flex-wrap gap-8 mx-auto text-[20px] tablet:text-[18px] mobile:text-[16px] w-7xl justify-around tablet:flex-col mobile:flex-col tablet:gap-10 mobile:gap-8">
        {/* About Us */}
        <div className="tablet:text-center mobile:text-center">
          <h3 className="mb-3 font-bold tablet:text-[22px] mobile:text-[20px]">ABOUT US</h3>
          <p className="tablet:max-w-none mobile:max-w-none">
            We deliver top-quality transportation vehicles with <br className="tablet:hidden mobile:hidden" /> unbeatable reliability and performance. <br className="tablet:hidden mobile:hidden" /> Your trusted partner for heavy-duty solutions.
          </p>
        </div>

        <div className="flex gap-8 tablet:justify-around mobile:flex-col mobile:gap-8 mobile:items-center">
          {/* Quick Links */}
          <div className="mobile:text-center">
            <h3 className="mb-3 font-bold tablet:text-[22px] mobile:text-[20px]">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Products</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="mobile:text-center">
            <h3 className="mb-3 font-bold tablet:text-[22px] mobile:text-[20px]">CONTACT US</h3>
            <p>Email:<br />quicktrans@gmail.com</p>
            <p className="mt-2">Phone:<br />+123 456 7890</p>
            <div className="flex justify-start gap-4 mt-4 text-xl mobile:justify-center">
              <a href="#" className="hover:text-[#e67e22] transition-colors"><FaFacebookF /></a>
              <a href="#" className="hover:text-[#e67e22] transition-colors"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-xs text-center tablet:mt-8 mobile:mt-6">
        © 2025 QuickTrans. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;