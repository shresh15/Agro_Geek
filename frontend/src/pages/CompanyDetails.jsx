import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_ENV_BACKEND_URL || "http://localhost:8000";

const CompanyDetails = () => {
  const { category } = useParams(); // Get category from URL
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [category]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/farmer/submissions?category=${category}`
      );

      if (response.data && Array.isArray(response.data.data)) {
        setSubmissions(response.data.data);
      } else {
        setSubmissions([]);
        setError("Invalid response format.");
      }
    } catch (error) {
      setError(
        `Error fetching data: ${error.response?.data?.message || error.message}`
      );
    }
    setLoading(false);
  };

  // Function to handle interest
  const handleInterestClick = async (submissionId) => {
    const companyDetails = {
      companyName: "ABC Industries", // Replace with actual company name
      contact: "9876543210", // Replace with actual company contact
      email: "abc@example.com", // Replace with actual company email
      location: "Kolkata, India", // Replace with actual company location
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/farmer/notify-farmer`,
        {
          submissionId,
          companyDetails,
        }
      );

      if (response.data.success) {
        alert("Interest sent successfully!");
      } else {
        alert("Failed to send interest.");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      alert("Error sending interest.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        {category.replace("_", " ").toUpperCase()} Details
      </h2>

      {loading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {submissions.length === 0 && !loading && (
        <p className="text-center text-lg">No data found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            {/* Display Image */}
            {submission.imagePaths && submission.imagePaths.length > 0 && (
              <img
                src={`${BACKEND_URL}/${submission.imagePaths[0]}`}
                alt={submission.entityName}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-xl font-semibold mb-2">
              {submission.entityName}
            </h3>
            <p>
              <strong>Amount:</strong> {submission.amount}
            </p>
            <p>
              <strong>Price per kg:</strong> {submission.pricePerAmount} {submission.isNegotiable ? "💸 (Negotiable)" : "🔒 (Fixed)"}
            </p>
            <p>
              <strong>Location:</strong> {submission.location}
            </p>
            <p>
              <strong>Address:</strong> {submission.address || "N/A"}
            </p>
            <p>
              <strong>Delivery Days:</strong> {submission.deliveryDays}
            </p>
            <p>
              <strong>Moisture Level:</strong> {submission.moistureLevel || "N/A"}
            </p>
            <p>
              <strong>Purity:</strong> {submission.isContaminationFree ? "✅ Free from plastic/synthetic material" : "⚠️ Not self-declared"}
            </p>
            {submission.subType && (
              <p>
                <strong>Botanical Specie:</strong> {submission.subType}
              </p>
            )}
            <p>
              <strong>Packaging:</strong> {submission.packagingType || "N/A"}
            </p>
            <p>
              <strong>Min Order Qty (MOQ):</strong> {submission.minOrderQuantity ? `${submission.minOrderQuantity} kg` : "N/A"}
            </p>
            <p>
              <strong>Logistics:</strong> {submission.pickupAvailability || "N/A"}
            </p>
            <p>
              <strong>Seller Profile:</strong> {submission.sellerType || "Individual farmer"}
            </p>
            <p>
              <strong>Contact:</strong> {submission.contactNumber || "N/A"}
            </p>

            {/* Interest Button */}
            {/* <button
              onClick={() => handleInterestClick(submission._id)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Yes, I am Interested
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDetails;
