const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0b1e] text-white">
      <h1 className="mb-4 text-4xl font-bold text-red-500">
        Payment Cancelled
      </h1>
      <p className="mb-6 text-lg">You have cancelled the checkout.</p>
      <a
        href="/cart"
        className="px-6 py-3 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
      >
        Return to Cart
      </a>
    </div>
  );
};

export default Cancel;
