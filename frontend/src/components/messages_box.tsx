import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useReceivedMessage, useSentMessage } from '../hooks';
import { Avatar } from './avatar';
import { MessageSkeleton } from './message_loader';

// Interface for the User and Message
interface User {
  name: string;
}
interface Message {
  
  content: string;
  createdAt: Date | string;
  senderName:string|null,
  sendTo:string|null
}

export const MessageBox = function ({ name }: User) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { sent_message,loading1 } = useSentMessage({ name });
  const { received_message } = useReceivedMessage({ name });
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [sentMessage, setSentMessage] = useState<string>(''); // Input message

  var user = localStorage.getItem("username");

  // Combine sent and received messages, and sort by createdAt
  useEffect(() => {
    const mergedMessages = [...sent_message, ...received_message].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setAllMessages(mergedMessages);


  }, [sent_message, received_message]);

  useEffect(() => {

    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
     
      setSocket(ws);
      ws.send(JSON.stringify({ type: 'register', username: user }));
    };
// for incoming messages
    ws.onmessage = (message) => {
      console.log(message.data);
const data=JSON.parse(message.data);

if(data.senderName===name){
  
  setAllMessages((prevMessages) => [
    ...prevMessages,
    { senderName:name,sendTo:user,content: data.content, createdAt: new Date().toISOString() }
  ]);

}
 
     
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    
    e.preventDefault();
    
    if (sentMessage.trim() && socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = {
        type: 'message',
        target: name, // Send to a specific target
        username: user,
        content: {content:sentMessage,senderName:user,sendTo:name},
        createdAt: new Date().toLocaleString(), // Add timestamp for the message
      };
      setAllMessages((prevMessages) => [
        ...prevMessages,
        {senderName:user,sendTo:name, content: sentMessage, createdAt: new Date().toISOString() }
      ]);
      const space_time=new Date().toISOString();
      console.log(space_time);  // 2024-10-22T16:12:26.221Z
 //console.log(allMessages[allMessages.length-1]);
 console.log("yes hello");
//   console.log(allMessages[allMessages.length-1]);
      socket.send(JSON.stringify(messagePayload));

      // Save the message in the backend
      try {
        
                // Update the UI with the newly sent message
              const value=sentMessage;
              setSentMessage("");
              const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/message/${name}`,
                { content: value, createdAt: new Date().toISOString() },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("JWT"),
                  },
                  withCredentials: true, // Ensure this is part of the config object
                }
              );
              
console.log(response)

      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[600px]   min-h-screen bg-gray-200">
      
    
      <div className="border border-gray-300 rounded-lg overflow-hidden w-full  h-[700px] bg-white shadow-lg">
        <div className="flex items-center bg-black-200 text-gray-600 w-full  font-semibold text-lg p-4">
          <span className="text-gray-500 mr-4">
       <Avatar name={name}></Avatar>
          </span>
          {name}
        </div>

      
<ul className="flex flex-col bg-gray-100 w-[500px] h-[470px] overflow-y-scroll p-4">
  {loading1  ? (
    <MessageSkeleton /> // Show skeleton while loading
  ) : (
    allMessages.map((msg, index) => {
      const time = new Date(msg.createdAt).toLocaleString().split(",");
      const current_time = time[1].trim();
      const hour_array = current_time.split(":");
      let hour = parseInt(hour_array[0], 10); // Explicitly parse hour as a number
      const minutes = hour_array[1];
      let period = "AM";

      // Adjust for PM/AM and 12-hour format
      if (hour >= 12) {
        period = "PM";
        if (hour > 12) hour -= 12;
      } else if (hour === 0) {
        hour = 12;
      }

      return (
        <li
          key={index}
          className={`${
            msg.senderName === user
              ? 'self-end bg-green-600 text-black rounded-tr-lg rounded-bl-lg'
              : 'self-start bg-gray-400 rounded-tl-lg rounded-br-lg'
          } px-3 py-1 my-2 max-w-xs shadow-md`}
        >
          <p className="text-lg">{msg.content}</p>
          <span className="block text-xs text-gray-700 mt-2 italic">
            {`${hour}:${minutes} ${period}`}
          </span>
        </li>
      );
    })
  )}
</ul>


        <form
          className="flex   w-[500px] border-t p-4 bg-white"
          onSubmit={handleSendMessage}
        >
          <input
            className="flex-grow h-12 px-4 border-none outline-none bg-gray-50"
            type="text"
            value={sentMessage}
            onChange={(e) => setSentMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="h-12 px-6 ml-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Send <i className="fa-solid fa-paper-plane ml-2"></i>
          </button>
        </form>
      </div>
    </div>
  );
};
