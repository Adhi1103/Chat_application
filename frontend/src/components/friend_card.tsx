import { Link } from "react-router-dom"; 
import { Avatar } from "./avatar";

interface Friend {
  friendname: string;
  isSelected: boolean; // New prop for selected state
}

export const FriendsCard = function ({ friendname, isSelected }: Friend) {
  return (
    <div className={`flex flex-row items-center justify-between border rounded-lg shadow-md mt-5 w-10/12 md:w-11/12 p-4 mx-auto transition duration-200 ${
      isSelected ? "bg-blue-100 border-blue-400" : "bg-white border-gray-200 hover:bg-gray-50"
    }`}>
      <div className="flex items-center space-x-4">
        <Avatar name={friendname} />
        <div className="text-lg font-semibold text-gray-700">{friendname}</div>
      </div>
      <Link to={`/message/${friendname}`}>
        <button className="bg-green-500 px-4 py-1 rounded-lg text-white hover:bg-green-600 transition duration-150">
          Message
        </button>
      </Link>
    </div>
  );
};
