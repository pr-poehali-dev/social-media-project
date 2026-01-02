import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface ContactsSidebarProps {
  contacts: Contact[];
  selectedContact: number;
  onSelectContact: (id: number) => void;
}

export default function ContactsSidebar({ contacts, selectedContact, onSelectContact }: ContactsSidebarProps) {
  return (
    <div className="w-80 border-r border-border flex flex-col bg-card">
      <div className="p-4 gradient-purple-pink">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Сообщения</h1>
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
            <Icon name="Plus" size={20} />
          </Button>
        </div>
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
          <Input
            placeholder="Поиск..."
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
              selectedContact === contact.id ? 'bg-muted' : ''
            }`}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 text-2xl">
                <AvatarFallback>{contact.avatar}</AvatarFallback>
              </Avatar>
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold truncate">{contact.name}</h3>
                <span className="text-xs text-muted-foreground">{contact.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
