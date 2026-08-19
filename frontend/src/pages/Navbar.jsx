import React from "react";

const Navbar = ({
  profilePicture,
  showDropdown,
  setShowDropdown,
  handleLogout,
  onMyListingsClick,
  onPotentialBuyersClick,
}) => {
  return (
    <div className="flex flex-row justify-center items-center">
      <div
        id="whitebg"
        className="h-15 w-[80vw] text-green-900 font-semibold text-lg flex flex-row justify-center items-center justify-between mt-10 mb-10 rounded-lg"
      >
        <div className="flex flex-row justify-center items-center">
          {/* 🔹 Agrogeek Logo */}
          <div className="ml-10 py-1">
            <img
              src="/Agro_Geek logo.png"
              alt="Agrogeek Logo"
              className="h-12 object-contain"
            />
          </div>
        </div>

        {/* 🔹 Profile Section with Dropdown & History */}
        <div className="flex flex-row items-center gap-4 mr-10">
          {onMyListingsClick && (
            <button
              onClick={onMyListingsClick}
              className="bg-green-800 hover:bg-green-700 text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg font-bold transition duration-200 shadow hover:shadow-lg select-none shrink-0"
            >
              My Listings
            </button>
          )}

          {onPotentialBuyersClick && (
            <button
              onClick={onPotentialBuyersClick}
              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg font-bold transition duration-200 shadow hover:shadow-lg select-none shrink-0"
            >
              Potential Buyers
            </button>
          )}

          {/* 🔹 Profile Picture with Dropdown */}
          <div className="relative">
            <div
              className="bg-green-900 h-12 w-12 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white">👤</span>
              )}
            </div>

            {/* 🔹 Logout Dropdown */}
            {showDropdown && (
              <div 
                className="absolute top-full mt-2 w-32 bg-white shadow-lg rounded-md border border-slate-100 z-50"
                style={{ right: 0 }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-semibold transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
