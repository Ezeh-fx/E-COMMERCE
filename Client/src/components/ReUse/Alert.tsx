import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Alert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    visible && (
      <motion.div
        initial={{ opacity: 0, x: 50, y: 50 }} // Start from bottom-right
        animate={{ opacity: 1, x: 0, y: 0 }}   // Move to position
        exit={{ opacity: 0, x: 50, y: 50 }}    // Slide out when disappearing
        transition={{ duration: 0.5 }}
        className="fixed px-4 py-2 text-white bg-red-500 rounded-lg shadow-lg bottom-5 right-5"
      >
        {message}
      </motion.div>
    )
  );
};

export default Alert;