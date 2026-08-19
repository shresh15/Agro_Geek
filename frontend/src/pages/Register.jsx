import { useNavigate } from "react-router-dom";
import bgimg from "../assets/bg.jpg";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-gray-200 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <h1 className="text-4xl font-bold mb-6 text-green-900">
        Registration Page
      </h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/details?role=farmer")}
          className="px-6 py-3 bg-teal-700 text-white rounded-lg shadow-lg hover:bg-black transition"
        >
          Register as a Seller
        </button>
        <button
          onClick={() => navigate("/details?role=company")}
          className="px-6 py-3 bg-emerald-300 text-black rounded-lg shadow-lg hover:bg-black hover:text-white transition"
        >
          Register as a Company Owner
        </button>
      </div>
    </div>
  );
};

export default Register;
