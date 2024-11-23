import { useParams } from "react-router-dom";
import { MessageBox } from "../components/messages_box";
import { Friend } from "./friends";

export const Message = function () {
    const { username } = useParams();

    return (
        <div className="h-screen flex justify-between  overflow-y-hidden ">
            {/* Friends list (hidden on mobile, scrollable on md and larger) */}
            <div className="  hidden md:block w-[500px] ">
                <Friend selectedFriend={username || "?"} />
            </div>

            {/* Message box (scrollable) */}
            <div className=" h-full">
                <MessageBox name={username || "?"} />
            </div>
        </div>
    );
};
