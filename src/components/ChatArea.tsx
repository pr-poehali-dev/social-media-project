import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  media?: {
    type: 'image' | 'video' | 'voice' | 'sticker' | 'gif';
    url: string;
    duration?: number;
  };
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  online: boolean;
  typing?: boolean;
  lastSeen?: string;
}

interface ChatAreaProps {
  selectedContact: number;
  contacts: Contact[];
  messages: Message[];
  onStartCall: (type: 'audio' | 'video') => void;
  onStartGroupCall: () => void;
  onSimulateTyping: () => void;
  formatTime: (seconds: number) => string;
}

export default function ChatArea({
  selectedContact,
  contacts,
  messages,
  onStartCall,
  onStartGroupCall,
  onSimulateTyping,
  formatTime,
}: ChatAreaProps) {
  const currentContact = contacts.find((c) => c.id === selectedContact);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-border gradient-purple-blue">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 text-xl">
              <AvatarFallback>{currentContact?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-white">{currentContact?.name}</h2>
              <p className="text-xs text-white/80">
                {currentContact?.typing ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-pulse">печатает</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </span>
                ) : currentContact?.online ? (
                  'В сети'
                ) : (
                  currentContact?.lastSeen || 'Не в сети'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={() => onStartCall('audio')}>
              <Icon name="Phone" size={20} />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={() => onStartCall('video')}>
              <Icon name="Video" size={20} />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={onStartGroupCall}>
              <Icon name="Users" size={20} />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={onSimulateTyping}>
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-md ${
                  message.sender === 'me'
                    ? 'gradient-purple-pink text-white'
                    : 'bg-card border border-border'
                } rounded-2xl p-4 shadow-lg hover-lift`}
              >
                {message.media && (
                  <div className="mb-2 rounded-lg overflow-hidden">
                    {message.media.type === 'image' ? (
                      <img src={message.media.url} alt="Media" className="w-full h-48 object-cover" />
                    ) : message.media.type === 'video' ? (
                      <video src={message.media.url} controls className="w-full h-48" />
                    ) : message.media.type === 'sticker' ? (
                      <div className="text-6xl">{message.media.url}</div>
                    ) : message.media.type === 'gif' ? (
                      <img src={message.media.url} alt="GIF" className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                          <Icon name="Play" size={20} />
                        </Button>
                        <div className="flex-1">
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-1/3 rounded-full" />
                          </div>
                        </div>
                        <span className="text-xs">{formatTime(message.media.duration || 0)}</span>
                      </div>
                    )}
                  </div>
                )}
                {message.text && <p className="mb-1">{message.text}</p>}
                <span
                  className={`text-xs ${
                    message.sender === 'me' ? 'text-white/80' : 'text-muted-foreground'
                  }`}
                >
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
