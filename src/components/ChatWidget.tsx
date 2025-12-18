import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! 👋 I'm the Dubiqo AI Assistant. I can help you with questions about our services, pricing, or connect you with our team. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: "Website issue", query: "I'm having issues with my website, can you help?" },
    { label: "New project", query: "I want to start a new web development project" },
    { label: "Pricing question", query: "What are your pricing plans?" },
    { label: "Talk to human", query: "I'd like to speak with a real person" },
  ];

  const streamChat = async (userMessage: string) => {
    setIsLoading(true);
    let assistantText = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.id !== 1) // Skip the initial greeting
            .map((m) => ({
              role: m.isBot ? "assistant" : "user",
              content: m.text,
            }))
            .concat({ role: "user", content: userMessage }),
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Too many requests. Please wait a moment.");
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";
      const assistantMessageId = Date.now();

      // Add initial assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          text: "",
          isBot: true,
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantText += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, text: assistantText } : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put back in buffer
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        const lines = buffer.split("\n");
        for (const raw of lines) {
          if (!raw || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantText += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId ? { ...m, text: assistantText } : m
                )
              );
            }
          } catch {
            // Ignore incomplete data
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Sorry, I'm having trouble connecting right now. Please try again or contact us at support@dubiqo.com",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Stream AI response
    streamChat(messageText);
  };

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    handleSendMessage(action.query);
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
                <h3 className="font-semibold text-primary-foreground">Dubiqo AI Assistant</h3>
                <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Powered by AI
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
                  <p className="text-sm whitespace-pre-line">{message.text || "..."}</p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.isBot === false && (
              <div className="flex items-start gap-2">
                <div className="rounded-full p-2 bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="glass rounded-lg rounded-tl-none p-3">
                  <div className="flex gap-1">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
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
                    disabled={isLoading}
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
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="gradient-primary"
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
