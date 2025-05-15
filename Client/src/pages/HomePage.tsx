import { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";
import bg from "../assets/bg_img.png";
import about from "../assets/About.png";
import contact from "../assets/Contact.png";
import { FaFacebook } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getAllProducts, ProductPayload } from "../Api/ProductApi/ProductApi";
import ProductSidebar from "./Product_Detail";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    AOS.init({ duration: 1000, once: true }); // ✅ Initialize scroll animation
  }, []);

  const [products, setProducts] = useState<ProductPayload[]>([]);
  const [hotProducts, setHotProducts] = useState<ProductPayload[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        if (res && Array.isArray(res.data)) {
          const sorted = [...res.data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setHotProducts(sorted.slice(0, 4)); // Newest 4 products
          setProducts(sorted.slice().reverse()); // Least recent products
        } else {
          console.error("Invalid product data format:", res);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    // Add a class to the body to prevent scrolling when sidebar is open
    document.body.style.overflow = "hidden";
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSelectedProductId(null);
    // Restore scrolling when sidebar is closed
    document.body.style.overflow = "auto";
  };

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
          {/* Product Sidebar */}
          <ProductSidebar
            productId={selectedProductId}
            onClose={closeSidebar}
          />

          {/* Main Content */}
          <div className="w-full h-[87vh] relative overflow-hidden">
            {/* Background Image */}
            <img
              src={bg || "/placeholder.svg"}
              alt="Background"
              className="object-cover w-full h-full"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
              <h1
                className="mb-4 text-[48px] leading-[100%] font-bold tablet:text-[38px] mobile:text-[28px]"
                style={{ fontFamily: '"Life Savers", cursive' }}
              >
                Trucks That Don't Flinch. Deals That Don't Wait
              </h1>
              <p className="mb-6 text-2xl tablet:text-xl mobile:text-base">
                Fast, Secure, and Easy Transfers
              </p>
              <Link to={"/product"}>
                <button
                  className="bg-[#e67e22] text-white font-bold py-3 px-6 hover:bg-[#e67e22] transition rounded-[24px] 
                  drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] w-[385px] h-[75px] text-[24px] leading-[100%] tablet:w-[300px] tablet:h-[60px] tablet:text-[20px] mobile:w-[240px] mobile:h-[50px] mobile:text-[18px] mobile:py-2"
                >
                  Veiw Product
                </button>
              </Link>
            </div>
          </div>

          {/* Hot Products Section - Improved for mobile */}
          <section className="flex flex-col items-center gap-[60px] mt-10 tablet:gap-[40px] mobile:gap-[30px] px-4 tablet:px-3 mobile:px-2">
            <h1 className="text-[40px] font-bold text-center text-white tablet:text-[36px] mobile:text-[30px]">
              Hot Products
            </h1>

            {/* Improved Grid Layout */}
            <div className="grid w-full grid-cols-4 gap-6 mobile:grid-cols-1 mobile:gap-6 tablet:grid-cols-2 tablet:gap-4  mobile:w-[90%] tablet:w-[90%]">
              {hotProducts.map((product) => (
                <div
                  key={product.createdAt}
                  data-aos="fade-up" // ✅ Animation added here
                  className="w-full bg-[#1c1a32] rounded-lg flex flex-col gap-3 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2845] cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Image container with fixed aspect ratio */}
                  <div className="w-full pt-[75%] relative">
                    <img
                      src={product.productImage}
                      alt={typeof product.name === "string" ? product.name : ""}
                      className="absolute top-0 left-0 object-cover w-full h-full"
                    />
                  </div>

                  {/* Content container with consistent padding */}
                  <div className="flex flex-col flex-grow gap-3 p-4">
                    <p className="text-white text-[20px] tablet:text-[18px] mobile:text-[18px] font-medium line-clamp-2 min-h-[56px] mobile:min-h-[50px]">
                      {product.name}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-white text-[18px] tablet:text-[16px] mobile:text-[16px] font-bold">
                        {product.price}$
                      </p>
                      <button className="bg-[#E56623B2] text-white px-4 py-2 mobile:px-3 mobile:py-1.5 rounded-[10px] hover:bg-[#e67e22] transition-colors duration-300 text-sm mobile:text-sm whitespace-nowrap">
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Least Products Section - Improved for mobile */}
          <section className="flex flex-col items-center gap-[60px] mt-20 tablet:gap-[40px] tablet:mt-16 mobile:gap-[30px] mobile:mt-12 px-4 tablet:px-3 mobile:px-2">
            <h1 className="text-[40px] font-bold text-center text-white tablet:text-[36px] mobile:text-[30px]">
              Least Products
            </h1>

            {/* Improved Grid Layout */}
            <div className="grid w-full grid-cols-4 gap-6 tablet:grid-cols-2 tablet:gap-4 mobile:grid-cols-1 mobile:gap-6  mobile:w-[90%] tablet:w-[90%]">
              {products.slice(0, 16).map((product) => (
                <div
                  key={product._id}
                  data-aos="fade-up" // ✅ Animation added here
                  className="w-full bg-[#1c1a32] rounded-lg flex flex-col gap-3 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2845] cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Image container with fixed aspect ratio */}
                  <div className="w-full pt-[75%] relative">
                    <img
                      src={product.productImage}
                      alt={typeof product.name === "string" ? product.name : ""}
                      className="absolute top-0 left-0 object-cover w-full h-full"
                    />
                  </div>

                  {/* Content container with consistent padding */}
                  <div className="flex flex-col flex-grow gap-3 p-4">
                    <p className="text-white text-[20px] tablet:text-[18px] mobile:text-[18px] font-medium line-clamp-2 min-h-[56px] mobile:min-h-[50px]">
                      {product.name}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-white text-[18px] tablet:text-[16px] mobile:text-[16px] font-bold">
                        {product.price}$
                      </p>
                      <button className="bg-[#E56623B2] text-white px-4 py-2 mobile:px-3 mobile:py-1.5 rounded-[10px] hover:bg-[#e67e22] transition-colors duration-300 text-sm mobile:text-sm whitespace-nowrap">
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About Us */}
          <div
            className="flex flex-col items-center justify-center w-full h-auto gap-10 px-6 mt-20 tablet:px-5 mobile:px-4 tablet:mt-16 mobile:mt-12 tablet:gap-8 mobile:gap-6"
            id="about"
          >
            {/* Heading */}
            <h1 className="text-[40px] font-bold text-center text-white mt-10 tablet:text-[32px] mobile:text-[28px] tablet:mt-8 mobile:mt-6">
              About Us
            </h1>

            {/* About Image/Text */}
            <div className="flex w-full gap-5 h-[420px] mt-20 tablet:mt-12 mobile:mt-8 justify-around tablet:flex-col tablet:h-auto">
              {/* Image */}
              <img
                src={about || "/placeholder.svg"}
                alt=""
                className="w-[627px] h-full object-cover tablet:w-full tablet:h-auto"
              />

              {/* Text */}
              <div className="w-[50%] h-[100%] flex justify-center items-center tablet:w-full tablet:h-auto tablet:mt-6">
                <p className="text-[32px] font-normal leading-[100%] text-white tablet:text-[24px] mobile:text-[18px] tablet:leading-relaxed">
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

            <p className="text-white tablet:text-[15px] mobile:text-[14px] leading-relaxed">
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

            <p className="text-white tablet:text-[15px] mobile:text-[14px] leading-relaxed">
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
          <div
            className="flex flex-col items-center justify-center w-full h-auto gap-10 mt-20 tablet:mt-16 mobile:mt-12 tablet:gap-8 mobile:gap-6"
            id="contact"
          >
            <h1 className="text-[40px] font-bold text-center text-white mt-10 tablet:text-[32px] mobile:text-[28px] tablet:mt-8 mobile:mt-6">
              Contact us
            </h1>

            <div className="flex items-center justify-around w-full h-auto px-6 tablet:px-5 mobile:px-4 tablet:flex-col">
              <img
                src={contact || "/placeholder.svg"}
                alt=""
                className="w-[40%] tablet:w-full"
              />

              <div className="w-auto h-full font-normal text-[32px] leading-[100%] text-white flex flex-col gap-5 tablet:w-full tablet:mt-8 mobile:mt-6 tablet:text-[26px] mobile:text-[20px] tablet:gap-4 mobile:gap-3 tablet:leading-relaxed">
                <span>Info at quickcart@gmail.com</span>
                <span>tele: +23490000000011</span>

                <div className="flex items-center gap-2">
                  <FaFacebook className="tablet:text-[22px] mobile:text-[18px]" />
                  <p>@quickcart</p>
                </div>

                <div className="flex items-center gap-2">
                  <BsTwitterX className="tablet:text-[22px] mobile:text-[18px]" />
                  <p>@quickcart</p>
                </div>

                <p className="text-[20px] flex justify-center items-center gap-1 tablet:text-[18px] mobile:text-[16px] mobile:mb-5 tablet:mb-5">
                  Want to message us click{" "}
                  <IoIosArrowRoundForward
                    size={30}
                    className="tablet:w-6 tablet:h-6 mobile:w-5 mobile:h-5"
                  />
                  <Link to={"/contact"}>
                    <span className="text-[#E67E25] cursor-pointer hover:underline">
                      Contact Us
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
