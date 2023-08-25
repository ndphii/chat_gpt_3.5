import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import CopyToClipboard from 'react-copy-to-clipboard'; // Import thư viện
import "../style/boxchat.css"
//const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // Thay YOUR_API_KEY bằng API key của bạn process.env.REACT_APP_OPENAI_API_KEY
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

const ChatBox = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [isCopySuccess, setIsCopySuccess] = useState(false);
    const chatBoxRef = useRef(null);
    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [messBot, setMessBot] = useState([]);
    const handleInputChange = (event) => {
        setInputMessage(event.target.value);

    };

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') {
            return;
        } else {
            setInputMessage('');
            try {
                const userMessage = { role: 'user', content: inputMessage };
                setChatHistory(prevChatHistory => [...prevChatHistory, userMessage]);

                let botResponsesArray = [];
                const assistantMessage = { role: 'assistant', content: '...' };
                botResponsesArray.push(assistantMessage);
                setChatHistory(prevChatHistory => [...prevChatHistory, ...botResponsesArray]);

                const completion = await openai.chat.completions.create(
                    {
                        model: "gpt-3.5-turbo-16k",
                        messages: [
                            { "role": "system", "content": "You are a helpful assistant." },
                            { "role": "user", "content": inputMessage }
                        ],
                        stream: true,
                    }

                );
                let string = "";

                for await (const chunk of completion) {
                    if (chunk !== undefined && chunk.choices[0]?.delta.content !== undefined) {
                        string += chunk.choices[0].delta.content;
                        botResponsesArray[0].content = string;
                        setMessBot(string);
                    }
                    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };
    return (
        <>
            <div className="container-fluid p-2 ">
                <div className="container container-chat-box d-flex flex-column ">
                    <div className="top-box-chat pt-1"><h3>ChatBot Voca</h3><small className="fs-5">GPT-3.5</small></div>
                    <div className="chat-box" ref={chatBoxRef}>
                        {chatHistory.map((message, index) => {
                            if (message.role === "user") {
                                return (
                                    <>
                                        <div key={index} className={`chat-message user-message ${message.role}`}>
                                            <div className='user-message'>
                                                <div className="chat-avatar">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="User Avatar" className="user-avatar" />
                                                </div>
                                                <div className="chat-container">
                                                    <div className="infor-top-chat d-flex justify-content-between">
                                                        <div className="chat-name">Voca member</div>
                                                    </div>
                                                    <div className="chat-content">{message.content}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            } else if (message.role === "assistant") {
                                return (
                                    <>
                                        <div key={index} className={`chat-message bot-message ${message.role}`}>
                                            <div className='bot-message'>
                                                <div className="chat-avatar">
                                                    <img src="https://static.vecteezy.com/system/resources/previews/022/841/114/original/chatgpt-logo-transparent-background-free-png.png" alt="Bot Avatar" className=" bot-avatar" />
                                                </div>
                                                <div className="chat-container">
                                                    <div className="infor-top-chat d-flex justify-content-between pb-2">
                                                        <div className="chat-name">Voca Assistant</div>
                                                        <div className="copy-btn d-flex justify-content-center align-items-center align-content-center" title="Copy">
                                                            <CopyToClipboard text={message.content} onCopy={() => {
                                                                setIsCopied(true);
                                                                setIsCopySuccess(true);

                                                                setTimeout(() => {
                                                                    setIsCopySuccess(false);
                                                                    setIsCopied(false);
                                                                }, 2000); // 2 giây
                                                            }}>
                                                                <i className={isCopySuccess ? "fa-solid fa-check" : (isCopied ? "fa-solid fa-check" : "fa-regular fa-copy")} ><small className="textcopy">{isCopySuccess ? "Copied" : (isCopied ? "Copied" : "")}</small></i>
                                                            </CopyToClipboard>

                                                        </div>
                                                    </div>
                                                    <div className="chat-content">{message.content}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            }
                            return null; // Nếu vai trò không phù hợp, trả về null hoặc nội dung tương ứng
                        })}
                    </div>
                    <div className="input-box">
                        <textarea value={inputMessage} onChange={handleInputChange} className="input-text bg-dark border-0 text-white" placeholder="Type your message..." ></textarea>
                        <button className="btn btn-dark submit-button" onClick={handleSendMessage}><i className="fa-solid fa-paper-plane"></i></button>

                    </div>
                </div>

            </div>
        </>
    );
};

export default ChatBox;
