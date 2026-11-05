import "./Chat.css";
import { useState, useEffect } from "react";
import { getChat, getChats, type Message, createChat, type Chat, sendMessage} from "../../utils/api";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import errorIcon from "../../assets/Icon container.png"
import { useOutletContext } from "react-router-dom";

type MobileContext = {
 isMobileMenuOpen: boolean;
 setIsMobileMenuOpen: (open: boolean) => void;
};

export default function Chat() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [chatsError, setChatsError] = useState<string | null>(null);
    const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
    const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
    const [newChatTitle, setNewChatTitle] = useState<string>(""); 
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [messagesError, setMessagesError] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useOutletContext<MobileContext>();

    useEffect(() => {
  // 1. If activeChatId isn't set, return early
  if(!activeChatId)
  {
    return;
  }

  const load = async () => {
    // 2. Clear messages
    setMessages([]);
    // 3. Clear messagesError
    setMessagesError("");
    // 4. Set isLoadingMessages to true
    setIsLoadingMessages(true);
    try {
      const res = await getChat(activeChatId);// 5. call getChat(activeChatId) and await the result
      setMessages(res.data?.messages || []);// 6. set messages to res.data?.messages, or an empty array if falsy

    } catch {
      // 7. set messagesError to an error message
      setMessagesError("Looks like something went wrong");
    } finally {
      // 8. set isLoadingMessages to false
      setIsLoadingMessages(false);
    }
  };

  load();
}, [activeChatId]);

    
    useEffect(() => {
  const load = async () => {
    try {
      const res = await getChats(); // call getChats and await the result
      setChats (res.data || []);// save res.data in chats, or use an empty array if res.data is missing (falsy)
      
    } catch {
      setChatsError("Failed to load chats");// save an error message in chatsError
    } finally {
      setIsLoadingChats(false);// set isLoadingChats to false
    }
  };

  load();
}, []);

const handleCreateChat = async () => {
const title = newChatTitle.trim() || 'New Chat';
// 1. Set isCreatingChat and newChatTitle back to default values
setIsCreatingChat(false);
setNewChatTitle("");
try {
 const res = await createChat(title);
 if (res.data) {
   // 2. Prepend the new chat and select it
   // Check the hint below
   setChats((prev) => [res.data!, ...prev]);
setActiveChatId(res.data._id);
setIsMobileMenuOpen(false);
 }
} catch {
 // A toast or inline error could go here in the future
}
};

const handleSend = async () => {
 const text = input.trim();
 if (!text || !activeChatId || isSending) return;

 const userMessage: Message = {
   _id: Date.now().toString(),
   chatId: activeChatId,
   role: "user",
   content: text,
   createdAt: new Date().toISOString(),
 };

 // 1. Append userMessage to the thread, clear the input, and set isSending to true
 // See Hint below

 setMessages((prev) => [...prev, userMessage]);
 setInput('');
setIsSending(true);

 try {
   const res = await sendMessage(activeChatId, text);
   if (res.data) {
     setMessages((prev) => [...prev, res.data!]);
   }
 } catch {
   // 2. Append an error Message to the thread (role: 'assistant', content: 'Something went wrong. Please try again.')
   // Use Date.now().toString() for the _id and new Date().toISOString() for createdAt
   const errorMessage: Message = {
  _id: Date.now().toString(),
  chatId: activeChatId,
  role: 'assistant',
  content: 'Something went wrong. Please try again.',
  createdAt: new Date().toISOString(),
};
setMessages((prev) => [...prev, errorMessage]);
 } finally {
   // 3. Set isSending to false
   setIsSending(false);
 }
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
 if (e.key === "Enter" && !e.shiftKey) {
   e.preventDefault();
   handleSend();
 }
};


  return (<div className="chat">
    <aside className={`chat__sidebar${
   isMobileMenuOpen ? ' chat__sidebar_open' : ''
 }`}>
      <button className="chat__new-btn" type="button" onClick={() => setIsCreatingChat(true)}>
        + New Chat
      </button>

      {isCreatingChat && (
 <input
   className="chat__title-input"
   type="text"
   placeholder="Chat name"
   value={newChatTitle}
   onChange={(e) => {setNewChatTitle(e.target.value)}}
   onBlur={() => {
     setIsCreatingChat(false);
     setNewChatTitle("");
   }}
   onKeyDown={(e) => {
     if (e.key === 'Enter') {handleCreateChat()}
     if (e.key === 'Escape') {
       setIsCreatingChat(false);
        setNewChatTitle("");
       
     }
   }}
   autoFocus
 />
)}

      {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
      {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

      <ul className="chat__list">
        {chats.map((c) => (
  <li
    key={c._id}
    className={
      c._id === activeChatId
        ? 'chat__item chat__item_active'
        : 'chat__item'
    }
    onClick={() => { setActiveChatId(c._id)
       setIsMobileMenuOpen(false);  
    }}
  >
    {c.title}
  </li>
))}
      </ul>
    </aside>

    <div className="chat__main"> {!messagesError && !isLoadingMessages && !activeChatId && (
    <div className="chat__no-messages chat__empty-state">
      <p className="chat__main-text">Create a new chat or select an existing chat to start the conversation</p>
      <button className="chat__start-btn" type="button" onClick={() => {setIsCreatingChat(true);
        setIsMobileMenuOpen(true);
      }}>Start New Chat</button>
    </div>
  )}
  
  {!messagesError && !isLoadingMessages && activeChatId && messages.length === 0 && (
    <div className="chat__no-messages chat__selected-empty-state">
         <h1 className="chat__main-text">
      Ask a question below
      <br />
      to start the conversation
    </h1>

    <form className="chat__composer">
      <textarea
        className="chat__composer-input"
        placeholder="Ask any question"
        aria-label="Ask a question"
      />
      <button type="button" aria-label="Send question">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
    </div>
  )}

  {activeChatId && isLoadingMessages && (
    <div className="chat__loading-state" role="status" aria-live="polite">
      Loading...
    </div>
  )}

  {activeChatId && messagesError && (
    <div className="chat__error" role="alert">
  <img src={errorIcon} alt="" />
  <h1>Looks like something went wrong</h1>
  <p>Try reloading the page or creating the chat again</p>
  <Link to="/">Go to the Main Page</Link>
</div>
  )}

  {activeChatId && !isLoadingMessages && !messagesError && messages.length > 0 && (
    <div className="chat-conversation">
    <ul className="chat__messages">
      {messages.map((message) => (
        <li
          key={message._id}
          className={`chat__message chat__message--${message.role}`}
        >
          {message.role === "assistant" ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </li>
      ))}
    </ul>
    <div className="chat__input-bar">
      <textarea
        className="chat__input"
        placeholder="Ask any question"
        aria-label="Ask any question"
         value={input}
         onChange={(e) => setInput(e.target.value)}
         onKeyDown={handleKeyDown}
         disabled={isSending}
 
        rows={4}
      />
      <button
        className="chat__send"
        type="button"
        aria-label="Send message" 
        onClick={() => handleSend()}
        disabled={isSending}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
    </div>
  )}
</div>
</div>
);
}