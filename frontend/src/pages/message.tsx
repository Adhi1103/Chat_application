import { useParams } from "react-router-dom";
import { MessageBox } from "../components/messages_box";
import { Friend } from "./friends";

export const Message = function() {
    const { username } = useParams();

    return (
        <div className="flex justify-between">
            {/* Hide on mobile, show on md and larger */}
            <div className="hidden md:block w-[500px]">
                <Friend selectedFriend={username || "?"} />
            </div>
            <div className="w-[500px]">
                <MessageBox name={username || "?"} />
            </div>
        </div>
    );
};
