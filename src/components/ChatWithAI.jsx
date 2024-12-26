import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";

const ChatWithAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef(null);
  const chatBoxRef = useRef(null);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: uuidv4(),
      text: `**You**: ${inputMessage}`,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await axios.post(
        "https://api.example.com/chat",
        { message: inputMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiMessage = {
        id: uuidv4(),
        text: `**AI**: ${response.data.reply}`,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);

      const errorMessage = {
        id: uuidv4(),
        text: "**AI**: Error connecting to AI. Please try again later.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={handleToggleChat}
          className="bg-purple-600 text-white rounded-full w-16 h-16 text-2xl flex items-center justify-center shadow-md hover:bg-purple-700 focus:outline-none"
        >
          💬
        </button>
      ) : (
        ""
      )}

      {isOpen && (
        <Draggable bounds="body">
          <div
            ref={chatBoxRef}
            className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg w-[80vw] h-[70vh] max-w-full max-h-[80vh] overflow-hidden resize flex flex-col md:w-[40vw] md:h-[55vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white text-purple-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  AI
                </div>
                <h3 className="text-lg hidden md:block">AI Assistant</h3>
              </div>
              <button
                onClick={handleToggleChat}
                className="text-white text-xl hover:text-gray-300 focus:outline-none"
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-100"
            >
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[80%] p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white self-end"
                        : "bg-gray-300 text-black self-start"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="flex p-3 border-t bg-gray-50">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                className="ml-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
              >
                Send
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default ChatWithAI;
