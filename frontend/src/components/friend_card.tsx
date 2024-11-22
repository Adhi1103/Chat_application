import { Link } from "react-router-dom"; 
import { Avatar } from "./avatar";
import { useLocation } from "react-router-dom";
interface Friend {
  friendname: string;
  isSelected: boolean; // New prop for selected state
}

export const FriendsCard = function ({ friendname, isSelected }: Friend) {
  console.log(friendname)
  const location=useLocation();
  const check1=location.pathname==="/friends"
  const check2=location.pathname.includes("/private");
  console.log(location.pathname);
  console.log(check2)
  return (
    <div className={`flex flex-row items-center   justify-between border rounded-lg shadow-md mt-5 w-10/12 md:w-11/12 p-4 mx-auto transition duration-200 ${
      isSelected ? "bg-blue-300 border-blue-400" : "bg-inherit border-gray-200 hover:bg-teal-400"
    }`}>
      <div className="flex items-center space-x-4">
        <Avatar name={friendname} />
        <div className="text-lg font-semibold text-gray-100">{friendname}</div>
      </div>
      <div className="flex flex-row">
        {check1?<Link to={`/message/private/${friendname}`}>
<button className="bg-green-500 mr-[15px] px-4 py-1 rounded-lg text-white hover:bg-green-600 transition duration-150">Ephemeral Chat</button>
</Link>:<div></div>}

        
      <Link to={check2?`/message/private/${friendname}`:`/message/${friendname}`}>
        <button className="bg-green-500 px-4 py-1 rounded-lg text-white hover:bg-green-600 transition duration-150">
          Message
        </button>
      </Link>
      </div>
    </div>
  );
};
