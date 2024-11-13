import { Quote } from "../components/quote.tsx";
import { Input } from "../components/input";
import { Signup_type, SignupSchema } from "@adarsh7/chat-app";
import { useState } from "react";
import { Button } from "../components/button.tsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
interface SignupProps{
    onSignup:()=>void
}
export const Signup = function ({onSignup}:SignupProps) {
    const navigate = useNavigate();
    const [user_inputs, setUser] = useState<Signup_type>({ password: "", email: "", username: "" });
    const [error, setError] = useState<string | null>(null);

    const f1 = async function () {
        // Validate inputs against SignupSchema
        const validationResult = SignupSchema.safeParse(user_inputs);

        if (!validationResult.success) {
            // Handle validation error
            setError("Please fill all required fields correctly.");
            console.error(validationResult.error.errors); // Log detailed errors
            return; // Stop further execution if validation fails
        }

        // Reset error message if validation passes
        setError(null);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, user_inputs);
            const token = response.data.token;
            const username = response.data.username;
            if(token){
                localStorage.setItem("JWT", token);
                localStorage.setItem("username", username);
                alert("Signup Successful");
                onSignup();
                navigate("/friends");
            }

        } catch (e) {
            alert("User already exists or another error occurred.");
            console.log(e);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div>
                    <div className="h-screen flex items-center flex-col">
                        <div className="text-4xl mt-[100px] font-bold">Create an account</div>
                        <div className="text-slate-400 mt-4">
                            Already have an account?
                            <Link className="underline hover:underline-offset-2" to="/signin">Login</Link>
                        </div>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                        <Input label="Username" placeholder="Enter your username"
                               OnChange={event => setUser(prev => ({ ...prev, username: event.target.value }))} />
                        <Input label="Email" placeholder="abc@gmail.com" type="email"
                               OnChange={event => setUser(prev => ({ ...prev, email: event.target.value }))} />
                        <Input label="Password" placeholder="password" type="password"
                               OnChange={event => setUser(prev => ({ ...prev, password: event.target.value }))} />
                        <Button  className={"w-[380px] bg-black text-white mt-[30px] py-2 px-4 rounded-lg hover:bg-gray-800"} name="Signup" OnClick={f1} />
                    </div>
                </div>
                <div className="hidden lg:block">
                    <Quote />
                </div>
            </div>
        </>
    );
};
