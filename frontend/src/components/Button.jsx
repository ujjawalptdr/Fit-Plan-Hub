const Button = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
