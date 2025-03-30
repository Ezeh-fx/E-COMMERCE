import React from "react";

interface AlertProps {
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
  return (
    <div className="flex items-center px-4 py-3 text-white bg-red-500 rounded-lg shadow-md">
      <strong className="mr-2">Error!</strong>
      <span>{message}</span>
    </div>
  );
};

export default Alert;