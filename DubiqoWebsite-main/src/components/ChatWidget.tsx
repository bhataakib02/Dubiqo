import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! 👋 I'm the Dubiqo Support Bot. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: "Website issue", response: "I'm sorry to hear you're having issues with your website. Could you describe the problem in detail? Common issues include: slow loading, broken pages, form errors, or display problems. Our team typically responds to troubleshooting requests within 2-4 hours." },
    { label: "New project", response: "Exciting! We'd love to help with your new project. To give you an accurate quote, could you tell me:\n\n• What type of project? (Website, Portfolio, Dashboard, Billing System)\n• Approximate number of pages or features?\n• Do you have a deadline in mind?\n\nYou can also use our Quote Estimator at /quote for an instant estimate!" },
    { label: "Pricing question", response: "Our pricing is transparent and based on project complexity:\n\n• Starter (₹4,999): 1-page sites, portfolios\n• Professional (₹9,999): 3-5 page business sites\n• Business (₹14,999+): Dashboards, billing systems\n\nAll packages include responsive design, revisions, and post-launch support. Check /pricing for full details!" },
    { label: "Talk to human", response: "I understand you'd like to speak with a real person. Our team is available:\n\n📧 Email: support@dubiqo.com (24h response)\n📱 WhatsApp: +91 98765 43210\n📅 Book a call: /booking\n\nA team member will get back to you shortly!" },
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
      return "Our pricing starts at ₹4,999 for simple websites. For a detailed breakdown:\n\n• Starter: ₹4,999 (1-page sites)\n• Professional: ₹9,999 (3-5 pages)\n• Business: ₹14,999+ (custom solutions)\n\nVisit /pricing for complete details or use /quote for a custom estimate!";
    }
    
    if (lowerMessage.includes("time") || lowerMessage.includes("how long") || lowerMessage.includes("deadline")) {
      return "Delivery times depend on project complexity:\n\n• Simple websites: 5-7 days\n• Professional sites: 2-3 weeks\n• Dashboards/Billing: 4-6 weeks\n\nNeed it faster? We offer rush delivery options! Contact us at /contact.";
    }
    
    if (lowerMessage.includes("portfolio") || lowerMessage.includes("student")) {
      return "Portfolio websites are perfect for students and professionals! Starting at ₹4,999, you get:\n\n• Professional single-page design\n• Project showcase section\n• Contact form\n• Mobile responsive\n• 5-7 days delivery\n\nCheck out examples at /portfolio!";
    }
    
    if (lowerMessage.includes("fix") || lowerMessage.includes("broken") || lowerMessage.includes("bug") || lowerMessage.includes("error")) {
      return "We specialize in fixing broken websites! Our troubleshooting services include:\n\n• Bug fixing & error resolution\n• Performance optimization\n• Security issues\n• Emergency support available\n\nContact us at /support or email support@dubiqo.com for immediate help!";
    }
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! 👋 Great to hear from you! I can help you with:\n\n• Getting a quote for your project\n• Understanding our services\n• Troubleshooting support\n• Connecting you with our team\n\nWhat would you like to know?";
    }
    
    if (lowerMessage.includes("thanks") || lowerMessage.includes("thank you")) {
      return "You're welcome! 😊 Is there anything else I can help you with? Feel free to ask about our services, pricing, or anything else!";
    }
    
    return "Thanks for your message! For specific inquiries, I recommend:\n\n• Check our FAQ: /faq\n• Get a quote: /quote\n• Contact our team: /contact\n\nOr ask me about pricing, timelines, or our services!";
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate typing
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(messageText),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    // Add user selection
    const userMessage: Message = {
      id: messages.length + 1,
      text: action.label,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate typing
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: action.response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 glow animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <div className="glass rounded-2xl shadow-2xl w-80 md:w-96 overflow-hidden animate-scale-in flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="gradient-primary p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">Dubiqo Support</h3>
                <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Online now
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-background/50 min-h-[300px] max-h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
              >
                <div className={`rounded-full p-2 ${message.isBot ? "bg-primary/10" : "bg-secondary/10"}`}>
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-secondary" />
                  )}
                </div>
                <div
                  className={`glass rounded-lg p-3 max-w-[80%] ${
                    message.isBot ? "rounded-tl-none" : "rounded-tr-none bg-primary/10"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="rounded-full p-2 bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="glass rounded-lg rounded-tl-none p-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Buttons */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-background/30 border-t border-border/40">
              <p className="text-xs text-foreground/60 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-xs h-8 border-border/40 hover:border-primary/50 hover:bg-primary/10"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border/40 bg-background/50">
            <form 
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                placeholder="Type your message..."
                className="flex-1 bg-muted/50 border-border/40"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="gradient-primary"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
