import React, { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaSpinner,
  FaBook,
  FaFileAlt,
  FaTrash,
  FaCopy,
  FaPlus,
} from "react-icons/fa";
import { RiChatNewLine } from "react-icons/ri";
import StyledMarkdown from "../components/StyledMarkdown";
import logo from "../assets/wlogo.png";
import Image from "../components/Image";
import { BsGlobe2 } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import SpeechToText from "../components/SpeechToText";
import TextToSpeech from "../components/TextToSpeech";
import { SiBookstack } from "react-icons/si";
import { RiMenu3Line } from "react-icons/ri";
import StatusBar from "../components/StatusBar";
import ProductModal from "../components/ProductModal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Array of sample queries to be randomly selected from
const SAMPLE_QUERIES = [
  "What are the key requirements for ISO 27001?",
  "Explain IEC 62304 compliance",
  "How to implement MISRA coding standards?",
  "What is GDPR and how do I comply?",
  "Explain the main requirements for HIPAA compliance",
  "What are the steps to achieve FDA compliance for medical devices?",
  "How do CE marking requirements affect my products?",
  "What is 21 CFR Part 11 compliance?",
  "Explain the compliance process for ISO 13485",
  "What are the key security controls in ISO 27001?",
  "How to prepare for a GDPR audit?",
  "What are the main requirements for SOC 2 compliance?",
  "Explain NIST Cybersecurity Framework requirements",
  "How do I create a HIPAA-compliant application?",
  "What documentation is required for FDA submission?",
  "How to implement a Quality Management System for medical devices?",
  "What are the security requirements for PCI DSS compliance?",
  "Explain the difference between ISO 9001 and ISO 13485",
  "How to conduct a risk assessment for medical devices?",
  "What are the key aspects of CMMC compliance?",
];

const Home = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);
  const [showVideos, setShowVideos] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const inputRef = useRef(null);
  const [chatTab, setChatTab] = useState(true);
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState({});
  const [text, setText] = useState("");
  const [chatName, setChatName] = useState("New Chat");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const textareaRef = useRef(null);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductUrl, setNewProductUrl] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState(null);
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isToggling, setIsToggling] = useState(false);
  const [randomQueries, setRandomQueries] = useState([]);

  useEffect(() => {
    const savedQueries = JSON.parse(
      localStorage.getItem("recentQueries") || "[]"
    );
    setRecentQueries(savedQueries);
    fetchChatList();

    // Select 3 random queries from the SAMPLE_QUERIES array
    const getRandomQueries = () => {
      const shuffled = [...SAMPLE_QUERIES].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    setRandomQueries(getRandomQueries());
  }, []);

  useEffect(() => {
    const fetchMetadataWithDelay = async (link, index) => {
      // Add delay based on index to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, index * 1000));
      if (!metadata[link]) {
        await fetchMetadata(link);
      }
    };

    chatMessages.forEach((msg) => {
      if (msg.online_links) {
        msg.online_links.forEach((link, index) => {
          fetchMetadataWithDelay(link, index);
        });
      }
    });
  }, [chatMessages]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const fetchChatList = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/chat-list");
      if (!response.ok) throw new Error("Failed to fetch chat list");
      const data = await response.json();
      setChatList(data);
      return data;
    } catch (error) {
      console.error("Error fetching chat list:", error);
      return null;
    }
  };

  const deleteChat = async (chatId) => {
    try {
      console.log("Deleting chat:", chatId);

      const response = await fetch(
        `http://localhost:8000/api/chat?chatId=${encodeURIComponent(chatId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error deleting chat:", errorText);
        throw new Error(`Failed to delete chat: ${errorText}`);
      }

      console.log("Chat deleted successfully");

      // Update local state immediately
      setChatList((prevList) =>
        prevList.filter((chat) => chat.chat_id !== chatId)
      );

      // If we're deleting the currently selected chat
      if (selectedChat?.chat_id === chatId) {
        setSelectedChat(null);
        setChatMessages([]);
        setResults(null);
        setChatName("New Chat");

        // Try to select the next available chat
        const remainingChats = await fetchChatList();
        if (remainingChats?.length > 0) {
          await selectChat(remainingChats[0]);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat: " + error.message);
      // Refresh the chat list to ensure UI is in sync with server
      fetchChatList();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Show the loading indicator
      setShowLoading(true);

      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          org_query: query,
          chat_id: selectedChat?.chat_id || null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.detail || errorData.error || `Error: ${response.status}`;
        } catch (e) {
          errorMessage = `Error: ${response.status} - ${errorText.substring(
            0,
            100
          )}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // If we received a chat_id from the server, store it
      if (data.chat_id) {
        // If this is a new chat or we need to update selected chat
        if (!selectedChat || selectedChat.chat_id !== data.chat_id) {
          setSelectedChat({
            chat_id: data.chat_id,
            chat_name: data.chat_name,
            query: query,
          });
          setChatName(data.chat_name);
        }
      }

      // Update chat messages with the new response
      setChatMessages((prev) => [
        ...prev,
        {
          query: query,
          answer: data.answer,
          pdf_references: data.pdf_references || [],
          online_images: data.online_images || [],
          online_videos: data.online_videos || [],
          online_links: data.online_links || [],
          relevant_queries: data.related_queries || [],
        },
      ]);

      // Update chat list if necessary
      if (data.chat_id || data.chatId) {
        fetchChatList();
      }

      // Clear the query input
      setQuery("");
    } catch (error) {
      console.error("Request error:", error);
      setError(
        error.message || "An error occurred while processing your request"
      );
    } finally {
      setLoading(false);
      setShowLoading(false);
    }
  };

  const selectChat = async (chat) => {
    try {
      console.log("Selecting chat:", chat);
      setSelectedChat(chat);
      setChatName(chat.chat_name || "Unnamed Chat");

      // Create a placeholder message if no chats are available
      if (!chat.chat_id) {
        console.error("No chat_id available in chat object:", chat);
        return;
      }

      // Fetch chat history - will update chatMessages state
      await fetchChatHistory(chat.chat_id);
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };

  const fetchChatHistory = async (chatId) => {
    try {
      console.log("Fetching chat history for:", chatId);
      const response = await fetch(
        `http://localhost:5000/api/chat-history/${chatId}`
      );
      if (!response.ok) throw new Error("Failed to fetch chat history");
      const messages = await response.json();

      // If no messages are returned from server, create a default empty array
      if (!Array.isArray(messages) || messages.length === 0) {
        console.log("No messages found in history, setting empty array");
        setChatMessages([]);
        setResults(null);
      } else {
        console.log("Setting chat messages:", messages);
        setChatMessages(messages);

        // Set the last message as the current result
        if (messages.length > 0) {
          setResults(messages[messages.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      // Set empty array in case of error to clear previous chat
      setChatMessages([]);
    }
  };

  const fetchMetadata = async (url) => {
    try {
      // First try using a CORS proxy
      const proxyUrls = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
        `https://proxy.cors.sh/${url}`,
      ];

      for (const proxyUrl of proxyUrls) {
        try {
          const response = await fetch(proxyUrl, {
            headers: {
              "x-requested-with": "XMLHttpRequest",
            },
          });

          if (!response.ok) {
            if (response.status === 429) {
              // Too Many Requests
              continue; // Try next proxy
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          let text;
          if (proxyUrl.includes("allorigins")) {
            const json = await response.json();
            text = json.contents;
          } else {
            text = await response.text();
          }

          const doc = new DOMParser().parseFromString(text, "text/html");

          const metadata = {
            title:
              doc.querySelector("title")?.innerText ||
              doc.querySelector('meta[property="og:title"]')?.content ||
              "Unknown Title",
            description:
              doc.querySelector('meta[name="description"]')?.content ||
              doc.querySelector('meta[property="og:description"]')?.content ||
              "No description available",
            image:
              doc.querySelector('meta[property="og:image"]')?.content || null,
          };

          // Cache the metadata
          setMetadata((prev) => ({
            ...prev,
            [url]: metadata,
          }));

          return metadata;
        } catch (proxyError) {
          console.warn(`Proxy ${proxyUrl} failed:`, proxyError);
          continue; // Try next proxy
        }
      }

      // If all proxies fail, try direct fetch with no-cors mode
      const response = await fetch(url, {
        mode: "no-cors",
        headers: {
          Accept: "text/html",
        },
      });

      // With no-cors, we can only get limited metadata
      const fallbackMetadata = {
        title: new URL(url).hostname,
        description: "Content not accessible due to CORS restrictions",
        image: null,
      };

      setMetadata((prev) => ({
        ...prev,
        [url]: fallbackMetadata,
      }));

      return fallbackMetadata;
    } catch (error) {
      console.error("Error fetching metadata for", url, error);
      // Return basic metadata from URL
      const fallback = {
        title: new URL(url).hostname,
        description: "Unable to fetch content",
        image: null,
      };
      setMetadata((prev) => ({
        ...prev,
        [url]: fallback,
      }));
      return fallback;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleTranscriptChange = (newTranscript) => {
    setQuery(newTranscript);

    // Update the textarea value and adjust its height
    if (textareaRef.current) {
      textareaRef.current.value = newTranscript;

      // Adjust textarea height similar to handleQueryChange
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(Math.max(textareaRef.current.scrollHeight, 48), 96) + "px";
    }
  };

  const handleQueryChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);

    // Adjust textarea height
    e.target.style.height = "auto";
    e.target.style.height =
      Math.min(Math.max(e.target.scrollHeight, 48), 96) + "px";

    // Handle @ mentions with improved detection
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/@([^\s]*)$/); // Updated regex pattern

    if (match && products.length > 0) {
      // Added products length check
      const searchTerm = match[1].toLowerCase();
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
      setShowSuggestions(true);
      setSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSuggestionIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        if (showSuggestions && filteredProducts.length > 0) {
          e.preventDefault();
          insertProduct(filteredProducts[suggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
      case "@":
        // Show all products when @ is typed
        setFilteredProducts(products);
        setShowSuggestions(true);
        setSuggestionIndex(0);
        break;
      default:
        break;
    }
  };

  const insertProduct = (product) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = query.slice(0, cursorPosition);
    const textAfterCursor = query.slice(cursorPosition);
    const lastAtSign = textBeforeCursor.lastIndexOf("@");

    const newText =
      textBeforeCursor.slice(0, lastAtSign) +
      `@${product.title} ` +
      textAfterCursor;

    setQuery(newText);
    setShowSuggestions(false);

    // Focus back on textarea and move cursor to end of inserted text
    textareaRef.current.focus();
    const newCursorPosition = lastAtSign + product.title.length + 2; // +2 for @ and space
    setTimeout(() => {
      textareaRef.current.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );
    }, 0);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-zinc-900 to-black text-white font-poppins">
      {/* Header with glassmorphism effect */}
      <header className="bg-zinc-900/70 backdrop-blur-lg border-b border-blue-500/20 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 filter blur-lg animate-pulse"></div>
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 relative z-10 drop-shadow-glow"
              />
            </div>
            <p className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              GCN
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end"
          >
            <Link
              to="/upload"
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-indigo-600/30 to-blue-600/30 hover:from-indigo-600/40 hover:to-blue-600/40 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 text-xs sm:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="font-medium">Upload</span>
            </Link>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 text-xs sm:text-sm"
            >
              <FaBook size={14} className="text-blue-400" />
              <span className="font-medium">Add Product</span>
            </button>
            <button
              onClick={() => setChatTab(!chatTab)}
              className="md:hidden flex items-center justify-center bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 hover:from-blue-600/20 hover:to-indigo-600/20 p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/10 border border-blue-500/20 group"
              title="Toggle Sidebar"
            >
              <RiMenu3Line className="text-blue-400 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Left fixed menu - only visible on desktop */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`fixed ${
          chatTab ? "md:left-[310px] left-4" : "left-4"
        } top-20 z-40 hidden md:flex flex-col gap-3 transition-all duration-500`}
      >
        <button
          onClick={() => setChatTab(!chatTab)}
          className="flex items-center justify-center bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 hover:from-blue-600/20 hover:to-indigo-600/20 p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/10 border border-blue-500/20 group"
          title="Toggle Sidebar"
        >
          <RiMenu3Line className="text-blue-400 group-hover:scale-110 transition-transform" />
        </button>
        <a
          href="/home"
          className="flex items-center justify-center bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 hover:from-blue-600/20 hover:to-indigo-600/20 p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/10 border border-blue-500/20 group"
          title="New Chat"
        >
          <RiChatNewLine className="text-blue-400 group-hover:scale-110 transition-transform" />
        </a>
      </motion.div>

      <div className="flex flex-row">
        {/* Mobile overlay when sidebar is open */}
        {chatTab && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
            onClick={() => setChatTab(false)}
          ></div>
        )}

        {/* Sidebar with animated transitions */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{
            width: chatTab ? "300px" : "0px",
            x: chatTab ? 0 : -300,
            opacity: chatTab ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed left-0 top-0 h-screen overflow-clip bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 backdrop-blur-md border-r border-blue-500/30 text-white z-30 pt-16 shadow-2xl"
        >
          <button
            className="md:hidden absolute top-20 right-4 p-2 rounded-full bg-zinc-800/90 text-blue-400"
            onClick={() => setChatTab(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="h-[calc(100vh-5rem)] p-4 sm:p-5 mt-5 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">
                Your Conversations
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>

            {/* Search input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-zinc-800/50 border border-zinc-700/50 hover:border-blue-500/30 focus:border-blue-500/50 rounded-lg py-2 px-3 text-sm outline-none transition-all duration-300 text-gray-200 placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveFilter("All")}
                className={`text-xs px-3 py-1.5 rounded-md transition-all duration-300 ${
                  activeFilter === "All"
                    ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                    : "bg-zinc-800/50 text-gray-400 border border-zinc-700/50 hover:border-blue-500/30"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("Today")}
                className={`text-xs px-3 py-1.5 rounded-md transition-all duration-300 ${
                  activeFilter === "Today"
                    ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                    : "bg-zinc-800/50 text-gray-400 border border-zinc-700/50 hover:border-blue-500/30"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveFilter("Yesterday")}
                className={`text-xs px-3 py-1.5 rounded-md transition-all duration-300 ${
                  activeFilter === "Yesterday"
                    ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                    : "bg-zinc-800/50 text-gray-400 border border-zinc-700/50 hover:border-blue-500/30"
                }`}
              >
                Yesterday
              </button>
            </div>

            {/* Chat list with hover effects */}
            {chatList.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-3 flex justify-center"
                >
                  <RiChatNewLine className="text-4xl opacity-50" />
                </motion.div>
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatList.map((chat) => (
                  <motion.div
                    key={chat.chat_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className={`flex justify-between text-left border rounded-lg transition-all duration-200 overflow-hidden ${
                      selectedChat?.chat_id === chat.chat_id
                        ? "bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-500/50 shadow-md shadow-blue-500/5"
                        : "bg-zinc-800/40 hover:bg-zinc-700/50 border-zinc-700/50 hover:border-blue-500/30"
                    }`}
                  >
                    <button
                      className="flex-1 text-left flex items-center gap-3 p-3"
                      onClick={() => selectChat(chat)}
                    >
                      <div className="flex gap-1">
                        {chat.product_colors &&
                          chat.product_colors.map((product, idx) => (
                            <div
                              key={`${chat.chat_id}-${product.id}-${idx}`}
                              className={`w-2 h-2 rounded-full bg-${product.color}-500 animate-pulse`}
                            />
                          ))}
                      </div>
                      <div
                        className="font-medium text-sm text-gray-200 line-clamp-1"
                        title={chat.chat_name || "Unnamed Chat"}
                      >
                        {chat.chat_name || "Unnamed Chat"}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.chat_id);
                      }}
                      className="p-3 text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.aside>

        {/* Main content area with responsive padding */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full pb-6 px-2 sm:px-4 flex flex-col items-center transition-all duration-500 ${
            chatTab ? "md:ml-[300px]" : "ml-0"
          }`}
        >
          <div
            className={`w-full max-w-5xl mx-auto rounded-lg ${
              chatTab ? "pl-0 md:pl-12 lg:pl-0" : "pl-0 sm:pl-10"
            }`}
          >
            <div className="p-2 sm:p-4">
              {/* Eye-catching loader animation */}
              {showLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-[calc(100vh-20rem)] w-full"
                >
                  {/* Modern cyberpunk-inspired loading animation */}
                  <div className="relative flex flex-col items-center">
                    {/* Backdrop glow effect */}
                    <div className="absolute inset-0 blur-2xl rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse"></div>

                    {/* Loading text */}
                    <div className="relative z-10 text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 font-medium mb-4">
                      Analyzing compliance data...
                    </div>

                    {/* Hexagonal grid animation */}
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                      {/* Outer hexagon */}
                      <motion.div
                        className="absolute inset-0 border-2 border-blue-500/60 rounded-xl"
                        animate={{
                          rotate: 360,
                          borderColor: [
                            "rgba(59, 130, 246, 0.6)",
                            "rgba(99, 102, 241, 0.6)",
                            "rgba(139, 92, 246, 0.6)",
                            "rgba(59, 130, 246, 0.6)",
                          ],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Middle hexagon */}
                      <motion.div
                        className="absolute inset-4 border-2 border-indigo-500/60 rounded-xl"
                        animate={{
                          rotate: -360,
                          borderColor: [
                            "rgba(99, 102, 241, 0.6)",
                            "rgba(139, 92, 246, 0.6)",
                            "rgba(59, 130, 246, 0.6)",
                            "rgba(99, 102, 241, 0.6)",
                          ],
                          scale: [1, 0.95, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Inner hexagon */}
                      <motion.div
                        className="absolute inset-8 border-2 border-purple-500/60 rounded-xl"
                        animate={{
                          rotate: 180,
                          borderColor: [
                            "rgba(139, 92, 246, 0.6)",
                            "rgba(59, 130, 246, 0.6)",
                            "rgba(99, 102, 241, 0.6)",
                            "rgba(139, 92, 246, 0.6)",
                          ],
                          scale: [1, 1.07, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Center piece */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-md flex items-center justify-center"
                          animate={{
                            rotate: 45,
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-6 h-6 text-blue-400"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            animate={{
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </motion.svg>
                        </motion.div>
                      </div>

                      {/* Progress indicators */}
                      <div className="mt-5 flex gap-1.5">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-blue-500/50 rounded-full"
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [0.8, 1, 0.8],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.3,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Content area - Reduced height to push input closer to bottom */}
              <div
                className={`h-[calc(100vh-15rem)] sm:h-[calc(100vh-13rem)] overflow-y-auto custom-scrollbar ${
                  showLoading ? "hidden" : "block"
                }`}
              >
                {chatMessages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center items-center h-full px-4"
                  >
                    <div className="flex flex-row gap-3 items-center select-none mb-6 sm:mb-8">
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 rounded-full bg-blue-500/30 filter blur-xl"
                        ></motion.div>
                        <img
                          src={logo || "/placeholder.svg"}
                          className="h-20 sm:h-28 select-none relative z-10"
                          alt="GCN Logo"
                        />
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-unbound"
                      >
                        GCN
                      </motion.p>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-lg sm:text-xl mb-6 sm:mb-10 text-gray-300 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400"
                    >
                      Global Compliance Navigator
                    </motion.p>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="text-xl sm:text-3xl font-light text-gray-400 text-center max-w-2xl"
                    >
                      Ask any question about compliance
                    </motion.h2>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl px-2"
                    >
                      {/* Sample queries - now using randomly selected queries */}
                      {randomQueries.map((sampleQuery, index) => (
                        <div
                          key={index}
                          onClick={() => setQuery(sampleQuery)}
                          className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 p-4 sm:p-5 rounded-xl border border-zinc-700/50 hover:border-blue-500/30 shadow-lg hover:shadow-blue-500/5 cursor-pointer transition-all duration-300 hover:translate-y-[-5px] group"
                        >
                          <div className="text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                            <FaPlus size={16} />
                          </div>
                          <p className="text-gray-300 text-sm group-hover:text-blue-300 transition-colors">
                            {sampleQuery}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="px-2 sm:px-0">
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10 border-b border-zinc-800/50 pb-8 last:border-b-0"
                      >
                        {/* User Query */}
                        <div className="flex items-start gap-3 mb-6">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-white text-sm sm:text-base font-medium">
                              U
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-200 mb-2 break-words">
                              {msg.query}
                            </h3>
                          </div>
                        </div>

                        {/* Responsive Layout for Assistant Response and Media */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                          {/* Main content - takes 2/3 on desktop */}
                          <div className="lg:col-span-2 flex items-start gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center shadow-lg flex-shrink-0">
                              <BsGlobe2 className="text-white text-sm sm:text-base" />
                            </div>
                            <div className="flex-1">
                              {/* Online links */}
                              <div className="mb-4 flex flex-wrap gap-2">
                                {msg.online_links?.map((link, index) => {
                                  const meta = metadata[link] || {
                                    title: "Loading...",
                                    icon: "",
                                  };
                                  const truncatedTitle =
                                    meta.title.length > 10
                                      ? `${meta.title.slice(0, 15)}...`
                                      : meta.title;

                                  return (
                                    <a
                                      key={index}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 bg-zinc-800/80 text-zinc-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-zinc-700 transition-all transform hover:translate-y-[-2px] shadow-md border border-zinc-700/60 text-xs sm:text-sm"
                                    >
                                      {meta.icon && (
                                        <img
                                          src={meta.icon}
                                          alt="icon"
                                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                                        />
                                      )}
                                      {!meta.icon && (
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-600 flex items-center justify-center">
                                          <span className="text-[6px] sm:text-[8px] text-white">
                                            i
                                          </span>
                                        </div>
                                      )}
                                      <span className="truncate max-w-[100px] sm:max-w-[140px] md:max-w-xs text-xs font-medium">
                                        {truncatedTitle}
                                      </span>
                                    </a>
                                  );
                                })}
                              </div>

                              {/* Main answer card with glassmorphism */}
                              <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-zinc-700/50 shadow-lg">
                                <StyledMarkdown content={msg.answer} />

                                <div className="flex justify-end gap-2 sm:gap-3 items-center mt-3 sm:mt-4 pt-2 border-t border-zinc-700/30">
                                  <TextToSpeech text={msg.answer} />
                                  <button
                                    onClick={() => copyToClipboard(msg.answer)}
                                    className="text-zinc-400 hover:text-blue-400 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-zinc-700/50"
                                    title="Copy to clipboard"
                                  >
                                    <FaCopy className="text-sm sm:text-base" />
                                  </button>
                                </div>
                              </div>

                              {/* PDF References */}
                              {msg?.pdf_references &&
                                Array.isArray(msg.pdf_references) &&
                                msg.pdf_references.length > 0 && (
                                  <div className="mt-4">
                                    <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-medium text-gray-300">
                                      <SiBookstack className="text-blue-400" />
                                      <span>References</span>
                                    </div>
                                    <div className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700/50 shadow-md overflow-x-auto">
                                      <table className="w-full">
                                        <thead>
                                          <tr className="text-left border-b border-zinc-600/50">
                                            <th className="pb-2 text-xs sm:text-sm font-medium text-gray-400">
                                              Document
                                            </th>
                                            <th className="pb-2 text-xs sm:text-sm font-medium text-gray-400">
                                              Pages
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {msg.pdf_references.map(
                                            (ref, index) => (
                                              <tr
                                                key={index}
                                                className="border-b border-zinc-700/30"
                                              >
                                                <td className="py-2 sm:py-3">
                                                  <div className="font-medium text-blue-400 text-xs sm:text-sm">
                                                    {ref.name ||
                                                      "Unnamed Document"}
                                                  </div>
                                                </td>
                                                <td className="py-2 sm:py-3">
                                                  <div className="flex flex-wrap gap-1 sm:gap-2">
                                                    {ref.page_number
                                                      ?.sort((a, b) => a - b)
                                                      .map((page) => (
                                                        <a
                                                          key={page}
                                                          href={`http://localhost:8000/api/pdf/pdf?name=${encodeURIComponent(
                                                            ref.name
                                                          )}#page=${page}`}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500/20 border border-blue-500/30 rounded-md hover:bg-blue-500/30 text-blue-300 hover:text-white transition-all cursor-pointer text-[10px] sm:text-xs font-medium"
                                                        >
                                                          {page}
                                                        </a>
                                                      ))}
                                                  </div>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                              {/* Related Queries */}
                              <div className="mt-4 sm:mt-5">
                                <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-medium text-gray-300">
                                  <SiBookstack className="text-blue-400" />
                                  <span>Related Queries</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                  {(
                                    msg.related_queries || msg.relevant_queries
                                  )?.map((item, index) => (
                                    <motion.button
                                      key={index}
                                      whileHover={{ scale: 1.01 }}
                                      onClick={() => setQuery(item)}
                                      className="text-left p-2 sm:p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:bg-blue-500/10 hover:border-blue-500/30 group transition-all"
                                    >
                                      <div className="flex justify-between items-center">
                                        <p className="text-gray-300 text-xs sm:text-sm group-hover:text-blue-300 transition-colors">
                                          {item}
                                        </p>
                                        <AiOutlinePlus className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                      </div>
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Media sidebar - takes 1/3 on desktop and sticks to the viewport */}
                          <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:sticky lg:top-20 self-start">
                            {/* Images Section */}
                            {msg?.online_images?.length > 0 && (
                              <div className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => setShowImages(!showImages)}
                                  className="flex items-center justify-between w-full gap-2 text-sm font-medium text-gray-300 p-3 hover:text-blue-400 transition-colors border-b border-zinc-700/30"
                                >
                                  <span>Images</span>
                                  <span>{showImages ? "▼" : "▶"}</span>
                                </button>
                                {showImages && (
                                  <div className="p-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      {msg?.online_images?.map((img, index) => (
                                        <Image
                                          key={index}
                                          src={img}
                                          alt={`Online image ${index + 1}`}
                                          className="rounded-lg border border-zinc-700/50 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Videos Section */}
                            {msg?.online_videos?.length > 0 && (
                              <div className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => setShowVideos(!showVideos)}
                                  className="flex items-center justify-between w-full gap-2 text-sm font-medium text-gray-300 p-3 hover:text-blue-400 transition-colors border-b border-zinc-700/30"
                                >
                                  <span>Videos</span>
                                  <span>{showVideos ? "▼" : "▶"}</span>
                                </button>
                                {showVideos && (
                                  <div className="p-3">
                                    <div className="grid grid-cols-1 gap-4">
                                      {msg?.online_videos?.map(
                                        (video, index) => (
                                          <div
                                            key={index}
                                            className="aspect-w-16 aspect-h-9"
                                          >
                                            <iframe
                                              src={`https://www.youtube-nocookie.com/embed/${video}?modestbranding=1&rel=0`}
                                              className="w-full rounded-lg border border-zinc-700/50 shadow-md"
                                              title={`Video ${index + 1}`}
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                            />
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="sticky bottom-0 flex mx-auto border-2 border-blue-500/40 rounded-lg relative backdrop-blur-sm bg-zinc-800/30 hover:border-blue-500/60 focus-within:border-blue-500/80 transition-all duration-300 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 w-full max-w-full mt-4 sm:mt-6 mb-2 sm:mb-0 px-2 sm:px-0"
            >
              {error && (
                <div className="absolute -top-10 left-0 right-0 bg-red-500/90 text-white p-2 rounded-md text-sm shadow-lg border border-red-600">
                  {error}
                  <button
                    className="absolute top-2 right-2 text-white"
                    onClick={() => setError(null)}
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex flex-1 w-full relative">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search... (Use @ to mention products)"
                  className="flex-grow py-3.5 px-4 rounded-l-lg bg-transparent focus:outline-none min-h-[52px] sm:min-h-[48px] max-h-[96px] resize-none text-gray-200 placeholder-gray-500 w-full"
                  rows={1}
                />

                {showSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute bottom-full left-0 mb-2 w-64 bg-zinc-800 rounded-lg shadow-lg border border-blue-400 max-h-48 overflow-y-auto z-50">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className={`p-2 hover:bg-zinc-700 cursor-pointer ${
                          index === suggestionIndex ? "bg-zinc-700" : ""
                        }`}
                        style={{
                          borderLeft: `4px solid var(--${product.color}-500)`,
                        }}
                        onClick={() => insertProduct(product)}
                        onMouseEnter={() => setSuggestionIndex(index)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{
                              backgroundColor: `var(--${product.color}-500)`,
                            }}
                          />
                          <div className="font-medium text-blue-400">
                            {product.title}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 truncate pl-4">
                          {product.info}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex items-center justify-center h-full">
                  <SpeechToText onTranscriptChange={handleTranscriptChange} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="p-3.5 sm:p-3 bg-gradient-to-r from-blue-600/40 to-indigo-600/40 hover:from-blue-600/60 hover:to-indigo-600/60 text-white rounded-r-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </motion.main>
      </div>
      <StatusBar />
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onProductSelect={(product) => {
          setQuery((prev) => prev + ` @${product.title} `);
          setIsProductModalOpen(false);
        }}
      />
    </div>
  );
};

export default Home;
