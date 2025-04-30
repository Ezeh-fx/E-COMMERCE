import { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";
import bg from "../assets/bg_img.png";
import { GRID1 } from "../components/static/data";
import { GRID2 } from "../components/static/data";
import about from "../assets/About.png";
import contact from "../assets/Contact.png"
import { FaFacebook } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);
  return (
    <div className="w-full bg-[#0D0B1E]">
      {loading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1a32]">
          <ThreeCircles
            visible={true}
            height="100"
            width="100"
            color="#e67e22"
            ariaLabel="three-circles-loading"
          />
          <p className="mt-3 text-lg font-medium text-[#e67e22]">Loading...</p>
        </div>
      ) : (
        <>
          {/* Main Content */}
          <div className="w-full h-[87vh] relative overflow-hidden">
            {/* Background Image */}
            <img
              src={bg}
              alt="Background"
              className="object-cover w-full h-full"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
              <h1
                className="mb-4 text-[48px] leading-[100%] font-bold md:text-6xl"
                style={{ fontFamily: '"Life Savers", cursive' }}
              >
                Trucks That Don’t Flinch. Deals That Don’t Wait
              </h1>
              <p className="mb-6 text-lg md:text-2xl">
                Fast, Secure, and Easy Transfers
              </p>
              <button
                className="bg-[#f39c12] text-white font-bold py-3 px-6  hover:bg-[#e67e22] transition rounded-[24px] bg-[#E56623B2]
 drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] w-[385px] h-[75px] text-[24px] leading-[100%]"
              >
                Veiw Product
              </button>
            </div>
          </div>

          {/* Display Hot Product */}
          <div className="flex flex-col gap-[150px]">
            <h1 className="text-[40px] font-bold text-center text-white mt-10">
              Hot Products
            </h1>
            <div className=" w-full h-[500px]  grid grid-cols-4  place-items-center ">
              {GRID1.map((items, i) => (
                <div
                  key={i}
                  className="w-[90%] h-[100%] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] gap-5 flex flex-col"
                >
                  {/* Product Image*/}
                  <div>
                    <img src={items.img} alt="" />
                  </div>

                  {/* Product Discription */}
                  <div>
                    <p className="font-normal text-[24px] text-[#FFFFFF] leading-[100%]">
                      {items.title}
                    </p>
                  </div>

                  {/* Product Price */}
                  <p className="text-[#FFFFFF]">{items.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Displat Least Product */}
          <div className="flex flex-col gap-[150px] mt-10">
            <h1 className="text-[40px] font-bold text-center text-white mt-10">
              Least Products
            </h1>
            <div className="grid w-full h-auto grid-cols-4 gap-5 place-items-center">
              {GRID2.map((items, i) => (
                <div
                  key={i}
                  className="w-[90%] h-[100%] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] gap-5 flex flex-col mb-20"
                >
                  {/* Product Image*/}
                  <div>
                    <img src={items.img} alt="" />
                  </div>

                  {/* Product Discription */}
                  <div>
                    <p className="font-normal text-[24px] text-[#FFFFFF] leading-[100%]">
                      {items.title}
                    </p>
                  </div>

                  {/* Product Price */}
                  <p className="text-[#FFFFFF]">{items.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About Us */}
          <div className="flex flex-col items-center justify-center w-full h-auto gap-10 px-5 mt-20">
            {/* Heading */}
            <h1 className="text-[40px] font-bold text-center text-white mt-10">
              About Us
            </h1>

            {/* About Image/Text */}
            <div className="flex w-full gap-5  h-[420px] mt-20 justify-around">
              {/* Image */}
              <img
                src={about}
                alt=""
                className="w-[627px] h-full object-cover"
              />

              {/* Text */}
              <div className="w-[50%] h-[100%]  flex justify-center items-center">
                <p className="text-[32px] font-normal leading-[100%] text-white">
                  Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos. Curabitur tempus urna at
                  turpis condimentum lobortis. Ut commodo efficitur neque. Ut
                  diam quam, semper iaculis condimentum ac, vestibulum eu
                  nisl.Yorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>

            <p className="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Curabitur tempus urna at turpis condimentum
              lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis
              condimentum ac, vestibulum eu nisl. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Nunc vulputate libero et velit
              interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos.
              Curabitur tempus urna at turpis condimentum lobortis. Ut commodo
              efficitur neque. Ut diam quam, semper iaculis condimentum ac,
              vestibulum eu nisl.
            </p>

            <p className="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Curabitur tempus urna at turpis condimentum
              lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis
              condimentum ac, vestibulum eu nisl. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Nunc vulputate libero et velit
              interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos.
              Curabitur tempus urna at turpis condimentum lobortis. Ut commodo
              efficitur neque. Ut diam quam, semper iaculis condimentum ac,
              vestibulum eu nisl.
            </p>
          </div>

          {/* Contact us */}
          <div className="flex flex-col items-center justify-center w-full h-auto gap-10 mt-20">
            <h1 className="text-[40px] font-bold text-center text-white mt-10">
              Contact us
            </h1>

            <div className="flex items-center justify-around w-full h-auto ">
              <img src={contact} alt="" className="w-[40%] "/>
              
              <div className="w-auto h-full font-normal text-[32px] leading-[100%] text-white flex flex-col gap-5">
                  <span>Info at quickcart@gmail.com</span>
                  <span>tele: +23490000000011</span>


                  <div className="flex items-center gap-2">
                  <FaFacebook />
                  <p>@quickcart</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                  <BsTwitterX />
                  <p>@quickcart</p>
                  </div>

                  <p className="text-[20px] flex justify-center items-center gap-1">Want to message us click  <IoIosArrowRoundForward size={30}/>
                  <span className="text-[#E67E25] cursor-pointer hover:underline">Contact Us</span></p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
