import { AppBar } from "../components/app_bar";
import { useFriends } from "../hooks";
import { User_Skeleton } from "../components/user_skeleton";
import { FriendsCard } from "../components/friend_card";

interface FriendProps {
    selectedFriend: string;
}

export const Friend = function ({ selectedFriend }: FriendProps) {
    const { friends, loading } = useFriends();
    const user = localStorage.getItem("username");

    return (
        <div className=" h-screen bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 flex flex-col overflow-y-auto">
            {/* AppBar */}
            <div>
                <AppBar name={user || "?"} label="Add friend" />
            </div>

            {/* Scrollable container */}
            <div className="h-full overflow-y-auto ">
                {loading ? (
                    <div>
                        <User_Skeleton />
                        <User_Skeleton />
                        <User_Skeleton />
                        <User_Skeleton />
                        <User_Skeleton />
                        <User_Skeleton />
                    </div>
                ) : (
                    friends.map((friend) => (
                        <div key={friend}>
                            <FriendsCard
                                friendname={friend}
                                isSelected={friend === selectedFriend} // Pass isSelected prop
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
