import { useEffect, useState } from "react";
import { AppBar } from "../components/app_bar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Avatar } from "../components/avatar";
import { BACKEND_URL } from "../config";

interface User {
  username: string | null;
  email: string | null;
}

export const UserDetail = function () {
  const userBios = [
    "Living my best life 🌟 | Coffee lover ☕ | Traveler 🌍",
    "Just another soul in this crazy world ✌️ | Stay positive 💪",
    "Dreaming big, working hard 💫 | Fitness junkie 🏋️‍♀️",
    "Making memories one day at a time 📸 | Music is life 🎶",
    "Explorer of new places 🌄 | Snack enthusiast 🍕 | Cat mom 🐱",
    "Tech geek 💻 | Bookworm 📚 | Always seeking new adventures 🗺️",
    "Chasing dreams, catching flights ✈️ | Life is a beautiful ride 🎢",
    "Living for the moments that take my breath away 🌹 | Dog lover 🐶",
    "Founder of my own little world 🌎 | Be kind, stay humble ✨",
    "Fitness goals 💪 | Smile often, laugh loudly 😊 | Hustle hard 💼",
    "Living in the moment 🌞 | Big fan of food and fun 🍔🎉",
    "Photographer 📸 | Capturing the world, one photo at a time 🌅",
    "Just a girl/boy trying to make a difference 💖 | Believe in yourself 🙌",
    "Good vibes only ✌️ | Let's make every day count 💯",
    "Dreamer | Doer | Believer | All about spreading love 💙",
    "Coffee, books, and sunsets 🌇 | Finding joy in the little things 📖",
    "Binge-watcher of Netflix 📺 | Never not thinking about food 🍩",
    "Always learning, always growing 🌱 | On a journey to greatness 🚀",
    "Mom life is the best life 👶 | Family over everything 💕",
    "Laughing through life, one step at a time 😂 | On a quest for happiness 💫",
  ];

  const yourname = localStorage.getItem("username");
  const token = localStorage.getItem("JWT");
  const { username } = useParams();
  const [user, setUser] = useState<User>();
  const [userBio, setBio] = useState("");

  useEffect(() => {
    // Fetch user details
    const user_detail = axios.get(`${BACKEND_URL}/api/v1/userdetail/${username}`, {
      headers: { "Content-Type": "application/json", Authorization: token },
      withCredentials: true,
    });

    user_detail.then(function (value) {
      setUser(value.data.user);
      console.log(value);
    });

    // Set a random user bio after user detail is fetched
    setBio(userBios[Math.floor(Math.random() * 20)]);
  }, [username, token]); // Ensure that it fetches user detail when `username` changes

  return (
    <div>
      <AppBar name={yourname || "@"} label="Add Friend" />
      <div className="min-h-screen bg-gray-100">
        {/* User Details Section */}
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg mt-6 rounded-lg">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <Avatar name={username || "😒"} />

            {/* User Info (name, email, bio) */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold">{user?.username}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="mt-4 text-gray-700">{userBio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
