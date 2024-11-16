import { Button } from "./button";
import { Avatar } from "./avatar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Link } from "react-router-dom";

interface Username {
    username: string;
}

export const User = function ({ username }: Username) {
    return (
        <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4 max-w-xl mx-auto hover:shadow-lg transition-shadow">
            {/* Left section with Avatar and Username */}
            <div className="flex items-center space-x-4">
                <Avatar name={username} />
                <div className="flex flex-col justify-center">
                    <div className="text-lg font-semibold text-gray-800">{username}</div>
                    <Link to={`/profile/${username}`} className="text-sm text-blue-500 hover:underline">
                        View Profile
                    </Link>
                </div>
            </div>

            {/* Right section with Add Friend button */}
            <div className="flex items-center">
                <Button className={"bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"}
                    name="Add Friend" 
                    OnClick={async function() {
                        try {
                            const response = await axios.post(
                                `${BACKEND_URL}/api/v1/user/add/friends`,
                                { username },
                                { headers: {"Content-Type": "application/json", Authorization: localStorage.getItem("JWT") } ,withCredentials:true}
                            );
                            if (response.data) {
                                console.log(response.data);
                                alert(response.data.message);
                            }
                        } catch (error) {
                            console.error(error);
                            alert("Failed to add friend. Please try again.");
                        }
                    }}  
                    
                />
            </div>
        </div>
    );
};
