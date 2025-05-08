import { useEffect, useState } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  message: yup.string().required("Message is required"),
});

const ContactUs = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  interface FormData {
    name: string;
    message: string;
  }

  const handleSendEmail = (data: FormData) => {
    const subject = encodeURIComponent(`New Contact from ${data.name}`);
    const body = encodeURIComponent(data.message);
    const mailtoLink = `mailto:emekaezeh2009@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    setSuccess(true);
    reset();

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#0D0B1E] text-white relative">
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
        <div className="flex flex-col items-center justify-center px-6 py-16 tablet:px-8 mobile:px-4">
          <header className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-bold tablet:text-3xl mobile:text-2xl">
              Contact Us
            </h1>
            <p className="text-lg text-gray-300 tablet:text-base mobile:text-sm">
              We’d love to hear from you!
            </p>
          </header>

          <form
            onSubmit={handleSubmit(handleSendEmail)}
            className="bg-[#1c1a32] w-full max-w-lg p-8 rounded-xl shadow-md tablet:p-6 mobile:p-4"
          >
            <label htmlFor="name" className="block mb-2 text-sm font-semibold">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="John Doe"
              className="w-full p-3 mb-2 rounded-md bg-[#29274c] text-white border-none focus:outline-none text-sm"
            />
            {errors.name && (
              <p className="mb-4 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}

            <label htmlFor="message" className="block mb-2 text-sm font-semibold">
              Your Message
            </label>
            <textarea
              id="message"
              {...register("message")}
              placeholder="Type your message here..."
              rows={6}
              className="w-full p-3 mb-2 rounded-md bg-[#29274c] text-white border-none focus:outline-none text-sm"
            />
            {errors.message && (
              <p className="mb-4 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#f39c12] text-black font-bold rounded-lg hover:bg-[#e67e22] transition text-base"
            >
              Send Message
            </button>
          </form>

          {success && (
            <div className="fixed z-50 px-6 py-3 text-white bg-green-500 rounded-lg shadow-lg bottom-6 right-6 animate-bounce mobile:bottom-4 mobile:right-4 mobile:text-sm">
              Message sent successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactUs;
