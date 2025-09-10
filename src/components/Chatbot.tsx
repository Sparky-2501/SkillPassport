import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { useTheme, type Theme } from "../hooks/useTheme";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your SkillPassport AI assistant. I can help you with:\n\n🎯 Career guidance and skill recommendations\n📜 Credential suggestions\n❓ App features and how to use them\n\nWhat would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentTheme = (localStorage.getItem('skillpassport-theme') as Theme) || 'theme1';
  const theme = useTheme(currentTheme);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Career Guidance
    if (message.includes('dream job') || message.includes('dream package') || message.includes('high salary')) {
      return "🚀 For a dream package job, focus on these key areas:\n\n💻 **Technical Skills:**\n• Data Structures & Algorithms (DSA)\n• System Design\n• Full-stack Development\n• Cloud Technologies (AWS/Azure)\n\n📊 **Soft Skills:**\n• Problem-solving\n• Communication\n• Leadership\n\n🏆 **Recommended Certifications:**\n• AWS Solutions Architect\n• Google Cloud Professional\n• Meta Frontend Developer\n\nStart with DSA practice on HackerRank and LeetCode!";
    }
    
    if (message.includes('web development') || message.includes('frontend') || message.includes('backend')) {
      return "🌐 **Web Development Path:**\n\n**Frontend:**\n• React/Vue.js certification\n• JavaScript fundamentals\n• CSS/HTML mastery\n\n**Backend:**\n• Node.js/Python certification\n• Database management\n• API development\n\n**Recommended Platforms:**\n• freeCodeCamp\n• Coursera\n• Udemy\n• Meta Frontend Developer Certificate";
    }
    
    if (message.includes('data science') || message.includes('machine learning') || message.includes('ai')) {
      return "🤖 **Data Science & AI Path:**\n\n**Core Skills:**\n• Python programming\n• Statistics & Mathematics\n• Machine Learning algorithms\n• Data visualization\n\n**Certifications:**\n• Google Data Analytics\n• IBM Data Science\n• Coursera ML Specialization\n• Kaggle Learn courses\n\nStart with Python basics and statistics!";
    }
    
    // Credential Suggestions
    if (message.includes('certificate') || message.includes('credential') || message.includes('upload')) {
      return "📜 **Credential Upload Tips:**\n\n**For Maximum Impact:**\n• Upload PDF certificates for verification\n• Add official links when available\n• Include completion dates\n\n**Top Platforms:**\n• **Coding:** HackerRank, LeetCode, Codechef\n• **Courses:** Coursera, Udemy, edX\n• **Cloud:** AWS, Google Cloud, Azure\n• **Design:** Adobe, Figma\n\n✅ **Pro Tip:** Certificates with links show as 'Verified' with green tags!";
    }
    
    // App Guide
    if (message.includes('connection') || message.includes('connect') || message.includes('network')) {
      return "🤝 **Connections Guide:**\n\n**How to Connect:**\n1. Go to Connections page\n2. Browse available users\n3. Send connection requests\n4. Wait for acceptance\n\n**Manage Requests:**\n• Check 'Requests' tab for pending\n• Accept/reject incoming requests\n• View sent requests status\n\n**Profile Views:**\n• Click on connected users to view profiles\n• See their verified credentials\n• Access their social links";
    }
    
    if (message.includes('profile') || message.includes('avatar') || message.includes('photo')) {
      return "👤 **Profile Management:**\n\n**Complete Your Profile:**\n1. Add professional photo\n2. Fill in your name & bio\n3. Add LinkedIn/GitHub links\n4. Choose your preferred theme\n\n**Tips:**\n• Use professional headshot\n• Keep info updated\n• Add social media links\n• Choose theme that reflects you";
    }
    
    if (message.includes('theme') || message.includes('color') || message.includes('appearance')) {
      return "🎨 **Theme Customization:**\n\n**Available Themes:**\n• Ocean Blue (Professional)\n• Rose Garden (Elegant)\n• Forest Night (Nature)\n• Sunset Fire (Bold)\n• Purple Dream (Creative)\n• Cyber Teal (Modern)\n\n**How to Change:**\n1. Go to Settings page\n2. Find 'Appearance' section\n3. Select your preferred theme\n4. Changes apply instantly!\n\nYour theme choice is saved automatically.";
    }
    
    // Default responses
    const defaultResponses = [
      "I'd be happy to help! Could you be more specific about what you're looking for? I can assist with:\n\n🎯 Career guidance\n📜 Credential recommendations\n❓ App features",
      "That's an interesting question! For the best guidance, could you tell me more about your career goals or what specific help you need?",
      "I'm here to help you succeed! Whether it's about skills, certifications, or using the app features, just let me know what you'd like to explore."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button - Fixed to left bottom */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-r ${theme.button} rounded-full shadow-lg flex items-center justify-center z-40`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-24 left-6 w-96 h-[500px] ${theme.card} backdrop-blur-lg rounded-2xl border ${theme.border} shadow-2xl z-50 flex flex-col`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            {/* Header */}
            <div className={`p-4 border-b ${theme.border} flex items-center justify-between bg-gradient-to-r ${theme.button} rounded-t-2xl`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">SkillPassport AI</h3>
                  <p className="text-xs text-white/80">Your career assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.isBot 
                        ? `bg-gradient-to-r ${theme.button}` 
                        : 'bg-gray-600'
                    }`}>
                      {message.isBot ? (
                        <Bot className="w-3 h-3 text-white" />
                      ) : (
                        <User className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.isBot 
                        ? `${theme.card} ${theme.text}` 
                        : `bg-gradient-to-r ${theme.button} text-white`
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r ${theme.button}`}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className={`${theme.card} p-3 rounded-2xl`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${theme.border}`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className={`flex-1 ${theme.card} border ${theme.border} rounded-xl px-4 py-2 ${theme.text} placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className={`w-10 h-10 bg-gradient-to-r ${theme.button} rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105`}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}