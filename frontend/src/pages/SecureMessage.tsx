import { useParams } from "react-router-dom";
import { Friend } from "./friends";
import { SecureMessageBox } from "../components/secure_messagebox";

export const SecureMessage = function () {
    const { username } = useParams();

    return (
        <div className="h-screen flex justify-between  overflow-y-hidden ">
            {/* Friends list (hidden on mobile, scrollable on md and larger) */}
            <div className="  hidden md:block w-[500px] ">
                <Friend selectedFriend={username || "?"} />
            </div>

            {/* Message box (scrollable) */}
            <div className=" h-full">
                <SecureMessageBox name={username || "?"} />
            </div>
        </div>
    );
};
