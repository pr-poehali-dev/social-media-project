import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

interface CallInterfaceProps {
  callActive: boolean;
  callType: 'audio' | 'video' | null;
  selectedContact: number;
  contacts: Contact[];
  groupCallParticipants: number[];
  onEndCall: () => void;
  onAddParticipant: (contactId: number) => void;
}

export default function CallInterface({
  callActive,
  callType,
  selectedContact,
  contacts,
  groupCallParticipants,
  onEndCall,
  onAddParticipant,
}: CallInterfaceProps) {
  if (!callActive) return null;

  return (
    <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-4xl p-8 text-center">
        <div className="mb-8">
          <Avatar className="w-32 h-32 mx-auto text-6xl mb-4">
            <AvatarFallback>{contacts.find((c) => c.id === selectedContact)?.avatar}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mb-2">{contacts.find((c) => c.id === selectedContact)?.name}</h2>
          <p className="text-muted-foreground">{callType === 'video' ? 'Видеозвонок' : 'Аудиозвонок'}...</p>
        </div>

        {callType === 'video' && (
          <div className={`grid gap-4 mb-8 ${groupCallParticipants.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {groupCallParticipants.map((participantId, index) => (
              <div key={participantId} className={`aspect-video ${index === 0 ? 'gradient-purple-pink' : 'bg-muted'} rounded-2xl flex flex-col items-center justify-center p-4`}>
                <Avatar className="w-16 h-16 mb-2 text-3xl">
                  <AvatarFallback>{contacts.find(c => c.id === participantId)?.avatar}</AvatarFallback>
                </Avatar>
                <p className={`text-sm font-medium ${index === 0 ? 'text-white' : 'text-foreground'}`}>
                  {contacts.find(c => c.id === participantId)?.name}
                </p>
              </div>
            ))}
            {groupCallParticipants.length < 6 && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="aspect-video bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                    <div className="text-center">
                      <Icon name="UserPlus" size={32} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Добавить</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить участника</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-80">
                    {contacts.filter(c => !groupCallParticipants.includes(c.id)).map(contact => (
                      <div
                        key={contact.id}
                        onClick={() => onAddParticipant(contact.id)}
                        className="p-3 flex items-center gap-3 hover:bg-muted rounded-lg cursor-pointer"
                      >
                        <Avatar className="w-10 h-10 text-xl">
                          <AvatarFallback>{contact.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{contact.name}</span>
                      </div>
                    ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Button size="icon" variant="ghost" className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80">
            <Icon name={callType === 'video' ? 'VideoOff' : 'MicOff'} size={24} />
          </Button>
          <Button size="icon" className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90" onClick={onEndCall}>
            <Icon name="PhoneOff" size={24} />
          </Button>
          {callType === 'video' && (
            <Button size="icon" variant="ghost" className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80">
              <Icon name="SwitchCamera" size={24} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
