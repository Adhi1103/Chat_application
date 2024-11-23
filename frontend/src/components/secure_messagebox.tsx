import { useState, useEffect,useRef } from 'react';
import { Avatar } from './avatar';

// Interface for the User and Message
interface User {
  name: string;
}
interface Message {
  content: string;
  createdAt: Date | string;
  senderName: string | null;
  sendTo: string | null;
  sendAt: number;
}

export const SecureMessageBox = function ({ name }: User) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [sentMessage, setSentMessage] = useState<string>(''); // Input message
  const [currentTime, setCurrentTime] = useState<number>(Date.now()); // State for tracking time
  const user = localStorage.getItem('username'); // Current user
  const sendSound = useRef(new Audio('/sounds/message-tone.mp3'));
  const receiveSound = useRef(new Audio('/sounds/message-tone.mp3'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer); // Clean up interval on unmount
  }, []);

  useEffect(() => {
    const ws = new WebSocket('wss://chat-application-2-jzm0.onrender.com');

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({ type: 'register', username: user }));
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.senderName === name) {
        setAllMessages((prevMessages) => [
          ...prevMessages,
          {
            senderName: name,
            sendTo: user,
            content: data.content,
            createdAt: new Date().toISOString(),
            sendAt: Date.now(),
          },
        ]);
        receiveSound.current.play()
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [name, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (sentMessage.trim() && socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = {
        type: 'message',
        target: name,
        username: user,
        content: {content:sentMessage,senderName:user,sendTo:name},
        createdAt: new Date().toISOString(),
        sendAt: Date.now(),
      };

      setAllMessages((prevMessages) => [
        ...prevMessages,
        {
          senderName: user,
          sendTo: name,
          content: sentMessage,
          createdAt: new Date().toISOString(),
          sendAt: Date.now(),
        },
      ]);
sendSound.current.play();
      socket.send(JSON.stringify(messagePayload));
      setSentMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-y-hidden min-h-screen bg-gray-200">
      <div className="border border-gray-300 rounded-lg overflow-hidden w-[350px] sm:w-[500px] md:w-[700px] h-screen bg-white shadow-lg">
        <div className="flex items-center bg-gray-300 text-gray-600 w-full font-semibold text-lg p-4">
          <span className="text-gray-500 mr-4">
            <Avatar name={name} />
          </span>
          {name}
        </div>

        <ul className="flex flex-col bg-[url('https://media.istockphoto.com/id/1367515302/photo/anonymous-people-avatars-in-virtual-space.jpg?s=1024x1024&w=is&k=20&c=hZPBz-5yQ2neUP49-kMEsjSoMlXaW0FRsjsK3lhvFSw=')] bg-gray-100 w-[350px] sm:w-[500px] md:w-[700px]  h-[500px] overflow-y-scroll p-4">
          {allMessages.map((msg, index) => {
            const time = new Date(msg.createdAt).toLocaleString().split(',');
            const current_time = time[1].trim();
            const time_array = current_time.split(':');
            let hour = parseInt(time_array[0], 10);
            const minutes = time_array[1];

            let period = 'AM';

            if (hour >= 12) {
              period = 'PM';
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
                {currentTime - msg.sendAt >= 60000 ? (
                  <p className="text-lg text-white">This message is deleted</p>
                ) : (
                  <p className="text-lg">{msg.content}</p>
                )}

                <span className="block text-xs text-gray-700 mt-2 italic">
                  {`${hour}:${minutes} ${period}`}
                </span>
              </li>
            );
          })}
          <div ref={messagesEndRef}/>
        </ul>

        <form
          className="flex w-[350px] sm:w-[500px] md:w-[700px] h-[10px] border-t p-3 bg-white"
          onSubmit={handleSendMessage}
        >
          <input
            className="flex-grow h-10 px-3 border-none outline-none bg-gray-50"
            type="text"
            value={sentMessage}
            onChange={(e) => setSentMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="h-10 px-4 ml-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Send <i className="fa-solid fa-paper-plane ml-2"></i>
          </button>
        </form>
      </div>
    </div>
  );
};
