import { Link } from "react-router-dom";
import { Avatar } from "./avatar";
import { useLocation } from "react-router-dom";

interface Friend {
  friendname: string;
  isSelected: boolean; // New prop for selected state
}

export const FriendsCard = function ({ friendname, isSelected }: Friend) {
  const location = useLocation();
  const check1 = location.pathname === "/friends";
  const check2 = location.pathname.includes("/private");

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between border rounded-lg shadow-md mt-5 w-11/12 p-4 mx-auto transition duration-200 ${
        isSelected
          ? "bg-blue-300 border-blue-400"
          : "border-gray-200 hover:bg-teal-400"
      }`}
    >
      {/* Friend Avatar and Name */}
      <div className="flex items-center space-x-4 mb-3 md:mb-0">
        <Avatar name={friendname} />
        <div className="text-base md:text-lg font-semibold text-gray-800">
          {friendname}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3">
        {check1 && (
          <Link to={`/message/private/${friendname}`}>
            <button className="bg-green-500 w-full md:w-auto px-4 py-1 text-sm md:text-base rounded-lg text-white hover:bg-green-600 transition duration-150">
              Ephemeral Chat
            </button>
          </Link>
        )}
        <Link to={check2 ? `/message/private/${friendname}` : `/message/${friendname}`}>
          <button className="bg-green-500 w-full md:w-auto px-4 py-1 text-sm md:text-base rounded-lg text-white hover:bg-green-600 transition duration-150">
            Message
          </button>
        </Link>
      </div>
    </div>
  );
};
