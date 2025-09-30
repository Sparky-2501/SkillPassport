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
    
    // App Usage Guide
    if (message.includes('how to use') || message.includes('how do i') || message.includes('getting started') || message.includes('tutorial')) {
      return "🚀 **How to Use SkillPassport:**\n\n**Adding Credentials:**\n1. Click 'Add Credential' button (top-right corner)\n2. Choose credential type (Certificate, Diploma, Badge, etc.)\n3. Fill in basic information (name, issuer, date)\n4. **Important:** Provide the URL of your certificate for verification\n5. Optionally upload PDF for extra proof\n\n**Navigation:**\n• **Home:** View your dashboard and stats\n• **Profile:** Manage personal info and avatar\n• **Connections:** Network with other professionals\n• **Settings:** Customize themes and security\n\n💡 **Pro Tip:** Certificates with valid URLs show as 'Verified' with green badges!";
    }
    
    if (message.includes('add credential') || message.includes('upload certificate') || message.includes('how to add')) {
      return "📜 **Adding Credentials Step-by-Step:**\n\n**Method 1: Quick Add**\n1. Click 'Add Credential' button (top-right)\n2. Select credential type\n3. Enter certificate name & issuer\n4. Add issue date\n5. **Crucial:** Paste the certificate URL for verification\n6. Submit!\n\n**Method 2: With PDF Upload**\n• Follow steps 1-5 above\n• Additionally upload PDF file (max 10MB)\n• This provides double verification\n\n**Verification Tips:**\n✅ Valid URL = Green 'Verified' badge\n⚠️ No URL = Yellow 'Non Verified' badge\n\n**Best URLs to use:**\n• Coursera certificate links\n• LinkedIn Learning certificates\n• Official issuer websites\n• Cloud provider certification pages";
    }
    
    if (message.includes('verify') || message.includes('verification') || message.includes('green badge')) {
      return "✅ **Certificate Verification System:**\n\n**How Verification Works:**\n• Add certificate URL when creating credential\n• System checks if URL is accessible\n• Valid URL = Green 'Verified' badge\n• No URL = Yellow 'Non Verified' badge\n\n**Best Verification Sources:**\n🎓 **Education:** Coursera, edX, Udemy completion certificates\n☁️ **Cloud:** AWS, Google Cloud, Azure certification pages\n💻 **Tech:** GitHub certificates, LinkedIn Learning\n🏢 **Corporate:** Company training certificates\n\n**Tips for Better Verification:**\n• Use direct certificate links, not profile pages\n• Ensure URLs are publicly accessible\n• Copy exact URLs from certificate emails\n• Test the link before submitting\n\n**Why Verification Matters:**\n• Builds trust with connections\n• Shows authenticity to employers\n• Increases profile credibility";
    }

    // Career Guidance
    if (message.includes('career guidance') || message.includes('career advice') || message.includes('career path')) {
      return "🎯 **Career Guidance Strategy:**\n\n**Step 1: Choose Your Field**\n• Identify your target career (Developer, Designer, Data Scientist, etc.)\n• Research required skills for that field\n\n**Step 2: Build Relevant Credentials**\n• Upload certificates related to your chosen field\n• Focus on quality over quantity\n• Ensure certificates are from reputable sources\n\n**Step 3: Create a Strong Profile**\n• Complete your profile with professional photo\n• Add LinkedIn and GitHub links\n• Connect with professionals in your field\n\n**Field-Specific Advice:**\n💻 **Developer:** Focus on programming, frameworks, cloud\n📊 **Data Science:** Statistics, Python, ML, visualization\n🎨 **Design:** UI/UX, Adobe tools, portfolio projects\n☁️ **Cloud:** AWS/Azure/GCP certifications\n\n💡 **Pro Tip:** Upload ALL certificates related to your target field - this shows comprehensive knowledge and dedication!";
    }
    
    if (message.includes('dream job') || message.includes('dream package') || message.includes('high salary') || message.includes('better job')) {
      return "🚀 **Landing Your Dream Job:**\n\n**Certificate Strategy:**\n• Upload certificates from ALL relevant areas of your target field\n• Don't just focus on one skill - show breadth and depth\n• Include both technical and soft skill certifications\n\n**For High-Paying Roles:**\n💻 **Tech:** Full-stack development + cloud + system design\n📊 **Data:** Python + ML + statistics + domain expertise\n🏢 **Management:** Leadership + project management + industry certs\n☁️ **Cloud:** Multi-cloud certifications + DevOps + security\n\n**SkillPassport Advantage:**\n• Verified certificates build instant credibility\n• Complete skill portfolio in one place\n• Professional network through connections\n• Shareable profile for job applications\n\n**Action Plan:**\n1. Upload ALL your existing certificates\n2. Identify skill gaps in your target role\n3. Get missing certifications\n4. Build connections in your industry\n5. Keep profile updated with new achievements";
    }
    
    if (message.includes('developer') || message.includes('web development') || message.includes('frontend') || message.includes('backend') || message.includes('programming')) {
      return "💻 **Developer Career Path:**\n\n**Essential Certificates to Upload:**\n🎯 **Frontend:** React, Vue.js, JavaScript, HTML/CSS, TypeScript\n🎯 **Backend:** Node.js, Python, Java, databases, APIs\n🎯 **Full-Stack:** Combine frontend + backend + deployment\n🎯 **Cloud:** AWS, Google Cloud, Azure fundamentals\n🎯 **Tools:** Git, Docker, testing frameworks\n\n**Recommended Learning Platforms:**\n• **Free:** freeCodeCamp, Codecademy\n• **Paid:** Coursera, Udemy, Pluralsight\n• **Hands-on:** HackerRank, LeetCode, Codewars\n\n**SkillPassport Strategy:**\n1. Upload certificates from multiple areas (don't specialize too early)\n2. Include both technical and project management certs\n3. Add soft skills certificates (communication, teamwork)\n4. Keep adding new technologies as you learn\n\n**Pro Tip:** Employers love seeing continuous learning - upload certificates regularly to show growth!";
    }
    
    if (message.includes('data science') || message.includes('machine learning') || message.includes('ai') || message.includes('analytics')) {
      return "🤖 **Data Science Career Path:**\n\n**Must-Have Certificates to Upload:**\n📊 **Foundations:** Python, R, Statistics, Mathematics\n🧠 **Machine Learning:** Scikit-learn, TensorFlow, PyTorch\n📈 **Analytics:** Google Analytics, Tableau, Power BI\n☁️ **Cloud ML:** AWS ML, Google Cloud ML, Azure ML\n📚 **Specializations:** NLP, Computer Vision, Deep Learning\n\n**Top Certification Sources:**\n• **Google:** Data Analytics Professional Certificate\n• **IBM:** Data Science Professional Certificate\n• **Coursera:** ML Specialization by Andrew Ng\n• **Kaggle:** Micro-courses (free!)\n• **Microsoft:** Azure Data Scientist Associate\n\n**SkillPassport Strategy for Data Science:**\n1. Start with Python + Statistics certificates\n2. Add domain-specific knowledge (finance, healthcare, etc.)\n3. Include visualization and communication skills\n4. Upload project-based certificates\n5. Show progression from basics to advanced topics\n\n**Career Boost:** Upload certificates from different domains to show versatility!";
    }
    
    if (message.includes('design') || message.includes('ui') || message.includes('ux') || message.includes('graphic')) {
      return "🎨 **Design Career Path:**\n\n**Essential Certificates to Upload:**\n🎯 **UI/UX:** Google UX Design, Adobe XD, Figma\n🎯 **Graphic Design:** Adobe Creative Suite, Canva Pro\n🎯 **Web Design:** HTML/CSS, responsive design\n🎯 **Tools:** Sketch, InVision, Principle\n🎯 **Theory:** Design thinking, color theory, typography\n\n**Best Learning Platforms:**\n• **Google:** UX Design Professional Certificate\n• **Adobe:** Creative Cloud tutorials\n• **Coursera:** Design specializations\n• **Udemy:** Practical design courses\n• **Dribbble:** Design workshops\n\n**Portfolio Strategy:**\n1. Upload design tool certifications\n2. Add user research and testing certificates\n3. Include accessibility and inclusive design\n4. Show business understanding (marketing, branding)\n5. Demonstrate continuous learning in new tools\n\n**Pro Tip:** Design is about solving problems - upload certificates that show both creative and analytical thinking!";
    }

    // App Features and Navigation
    if (message.includes('dashboard') || message.includes('home page') || message.includes('stats')) {
      return "🏠 **Dashboard Overview:**\n\n**Your Stats Cards:**\n📜 **Credentials:** Total certificates uploaded\n✅ **Verified Skills:** Certificates with valid URLs\n👁️ **Profile Views:** How many people viewed your profile\n🤝 **Connections:** Your professional network size\n\n**Quick Actions:**\n• Click 'Add Credential' to upload new certificates\n• View all your credentials in the main section\n• Each credential shows verification status\n• Green badge = Verified with URL\n• Yellow badge = Needs verification URL\n\n**Navigation Tips:**\n• Use top navigation to switch between sections\n• Dashboard shows your overall progress\n• All sections are accessible from the top menu\n\n**Growth Strategy:**\n• Aim to increase verified credentials\n• Build connections to boost profile views\n• Regular updates keep your profile active";
    }

    if (message.includes('theme') || message.includes('color') || message.includes('appearance') || message.includes('customize')) {
      return "🎨 **Customization & Themes:**\n\n**Available Themes:**\n🌊 **Ocean Blue:** Professional and trustworthy\n🌹 **Rose Garden:** Elegant and sophisticated\n🌲 **Forest Night:** Natural and calming\n🌅 **Sunset Fire:** Bold and energetic\n💜 **Purple Dream:** Creative and innovative\n🌊 **Cyber Teal:** Modern and tech-focused\n\n**How to Change Themes:**\n1. Go to Settings page (top navigation)\n2. Find 'Appearance' section\n3. Select your preferred theme from dropdown\n4. Changes apply instantly!\n5. Your choice is saved automatically\n\n**Personalization Tips:**\n• Choose themes that reflect your professional brand\n• Ocean Blue for corporate/finance roles\n• Purple Dream for creative/design roles\n• Cyber Teal for tech/development roles\n\n**Profile Customization:**\n• Upload professional avatar in Profile section\n• Add LinkedIn and GitHub links\n• Complete all profile fields for better connections";
    }
    
    if (message.includes('connection') || message.includes('connect') || message.includes('network') || message.includes('networking')) {
      return "🤝 **Professional Networking Guide:**\n\n**Building Your Network:**\n1. Go to Connections page (top navigation)\n2. **Discover People:** Browse available professionals\n3. Click 'Connect' to send requests\n4. **My Connections:** View accepted connections\n5. **Requests:** Manage incoming connection requests\n\n**Connection Benefits:**\n• View each other's verified credentials\n• Build professional credibility\n• Expand your industry network\n• Share knowledge and opportunities\n\n**Best Practices:**\n• Connect with people in your field\n• Accept relevant connection requests\n• View profiles before connecting\n• Use connections for career opportunities\n\n**Profile Viewing:**\n• Click 'View Profile' on any connection\n• See their complete credential portfolio\n• Access their social media links\n• Learn from their career progression\n\n**Networking Strategy:**\n• Quality over quantity in connections\n• Engage with people in your target industry\n• Use verified credentials to build trust";
    }
    
    if (message.includes('profile') || message.includes('avatar') || message.includes('photo') || message.includes('personal info')) {
      return "👤 **Profile Management Guide:**\n\n**Complete Your Profile:**\n1. **Photo:** Upload professional headshot (max 2MB)\n2. **Basic Info:** Full name and email\n3. **Social Links:** LinkedIn and GitHub URLs\n4. **Theme:** Choose from 6 available themes\n\n**Profile Photo Tips:**\n• Use high-quality, professional image\n• Clear face shot with good lighting\n• Dress appropriately for your industry\n• Avoid casual or party photos\n\n**Social Media Integration:**\n• LinkedIn: Essential for professional networking\n• GitHub: Crucial for developers and tech roles\n• Keep profiles consistent across platforms\n\n**Why Complete Profile Matters:**\n• Higher connection acceptance rates\n• Better first impressions\n• Increased profile views\n• Professional credibility\n\n**Profile Optimization:**\n• Regular updates show you're active\n• Professional photo increases trust\n• Social links provide more context\n• Consistent branding across platforms";
    }
    
    // Troubleshooting and Support
    if (message.includes('problem') || message.includes('error') || message.includes('not working') || message.includes('bug')) {
      return "🔧 **Troubleshooting Guide:**\n\n**Common Issues & Solutions:**\n\n**Credential Upload Problems:**\n• Ensure PDF is under 10MB\n• Check internet connection\n• Try refreshing the page\n• Use valid certificate URLs\n\n**Profile Issues:**\n• Image must be under 2MB\n• Use supported formats (JPG, PNG)\n• Clear browser cache if needed\n\n**Connection Problems:**\n• Check if user still exists\n• Refresh the connections page\n• Try logging out and back in\n\n**Verification Issues:**\n• Ensure certificate URL is publicly accessible\n• Test the URL in a new browser tab\n• Some certificates may take time to verify\n\n**General Tips:**\n• Keep your browser updated\n• Clear cache and cookies if issues persist\n• Try using a different browser\n• Check your internet connection\n\n**Still Having Issues?**\nTry refreshing the page or logging out and back in. Most issues resolve with a fresh session!";
    }
    
    if (message.includes('security') || message.includes('password') || message.includes('account safety')) {
      return "🔒 **Security & Account Safety:**\n\n**Account Security Features:**\n• Secure authentication via Supabase\n• Password encryption\n• Session management\n• Data privacy protection\n\n**Password Management:**\n1. Go to Settings page\n2. Click 'Change Password'\n3. Enter new password (min 6 characters)\n4. Confirm the change\n\n**Best Security Practices:**\n• Use strong, unique passwords\n• Don't share account credentials\n• Log out from shared devices\n• Keep profile information professional\n\n**Data Privacy:**\n• Your credentials are private by default\n• Only connected users can view your certificates\n• You control who sees your information\n• Profile data is securely stored\n\n**Account Management:**\n• Regular password updates recommended\n• Monitor your account activity\n• Review connections periodically\n• Keep contact information current";
    }
    
    // Default responses
    const defaultResponses = [
      "I'm here to help you succeed with SkillPassport! I can assist with:\n\n🚀 **App Usage:** How to add credentials, navigate features\n🎯 **Career Guidance:** Field-specific certificate strategies\n📜 **Verification:** How to get green verified badges\n🤝 **Networking:** Building professional connections\n👤 **Profile:** Optimizing your professional presence\n\nWhat would you like to know more about?",
      "Welcome to SkillPassport! I can help you with:\n\n• **Getting Started:** Step-by-step app tutorials\n• **Career Planning:** Which certificates to upload for your field\n• **Verification Tips:** How to get those green verified badges\n• **Networking:** Building meaningful professional connections\n\nWhat specific area interests you most?",
      "I'm your SkillPassport assistant! Here's what I can help with:\n\n📱 **App Features:** Navigation, credential upload, profile setup\n💼 **Career Strategy:** Field-specific certification advice\n✅ **Verification:** Getting verified badges for credibility\n🌐 **Networking:** Growing your professional network\n\nJust ask me anything about using SkillPassport effectively!"
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