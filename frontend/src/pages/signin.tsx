import { Input } from "../components/input";
import { useState } from "react";
import { Signin_type, SigninSchema } from "@adarsh7/chat-app";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import axios from 'axios';
import { BACKEND_URL } from "../config";

interface SigninProps {
    onLogin: () => void; // Define the type for the onLogin function
  }
export const Signin = function({onLogin}:SigninProps) {
    const navigate = useNavigate();
    const [post_inputs, setPost] = useState<Signin_type>({ password: "", email: "" });
    const [error, setError] = useState<string | null>(null);
    //axios.defaults.withCredentials = true;
    async function send_request() {
        // Validate inputs using SigninSchema
        const validationResult = SigninSchema.safeParse(post_inputs);

        if (!validationResult.success) {
            // Handle validation error
            setError("Please enter a valid email and password.");
            console.error(validationResult.error.errors); // Log detailed errors
            return; // Stop further execution if validation fails
        }

        // Reset error message if validation passes
        setError(null);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, post_inputs, );
            const token = response.data.token;
            const username = response.data.username;

            if (token) {
                localStorage.setItem("JWT", token);
                localStorage.setItem("username", username);
                alert("Signed in Successfully");
                onLogin();
                navigate("/friends");
            } else {
                alert(response.data.message);
            }
        } catch (e) {
            alert("An error occurred. Please try again.");
            console.log(e);
        }
    }

    return (
        <>
            <div className="h-screen flex items-center flex-col">
                <div className="text-4xl mt-[100px] font-bold">Sign in to your account</div>
                <div className="text-slate-400 mt-4">
                    Do not have an account? <Link className="underline hover:underline-offset-2" to="/signup">Signup</Link>
                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
                <Input
                    label="Email"
                    placeholder="abc@gmail.com"
                    type="email"
                    OnChange={event => setPost(prev => ({ ...prev, email: event.target.value }))}
                />
                <Input
                    label="Password"
                    placeholder="password"
                    type="password"
                    OnChange={event => setPost(prev => ({ ...prev, password: event.target.value }))}
                />
                <Button name="Signin" OnClick={send_request} className={"w-[380px] bg-black text-white mt-[30px] py-2 px-4 rounded-lg hover:bg-gray-800"} />
            </div>
        </>
    );
};
