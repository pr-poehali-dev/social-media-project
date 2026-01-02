import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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

export default function Index() {
  const [selectedContact, setSelectedContact] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [groupCallParticipants, setGroupCallParticipants] = useState<number[]>([]);

  const contacts: Contact[] = [
    { id: 1, name: 'Анна Смирнова', avatar: '👩🏻', lastMessage: 'Отправила фото', time: '14:23', online: true, typing: isTyping },
    { id: 2, name: 'Дмитрий Козлов', avatar: '👨🏻', lastMessage: 'Увидимся завтра!', time: '13:15', online: false, lastSeen: 'был в 13:15' },
    { id: 3, name: 'Мария Петрова', avatar: '👩🏼', lastMessage: 'Спасибо за видео 🎥', time: '11:40', online: true },
    { id: 4, name: 'Иван Волков', avatar: '👨🏼', lastMessage: 'Отлично!', time: 'Вчера', online: false, lastSeen: 'был вчера' },
    { id: 5, name: 'Елена Новикова', avatar: '👩🏻‍🦰', lastMessage: 'Посмотри это', time: 'Вчера', online: true },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'other', time: '14:20' },
    { id: 2, text: 'Отлично! Смотри, что я нашла', sender: 'other', time: '14:21' },
    { id: 3, text: 'Круто! Где это?', sender: 'me', time: '14:22' },
    { id: 4, text: 'Это в новом парке! Отправила тебе фото', sender: 'other', time: '14:23', media: { type: 'image', url: '/placeholder.svg' } },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim() || mediaPreview) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        sender: 'me',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        media: mediaPreview ? { type: mediaType!, url: mediaPreview } : undefined,
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
      setMediaPreview(null);
      setMediaType(null);
      resetFilters();
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    (window as any).recordingInterval = interval;
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    clearInterval((window as any).recordingInterval);
    const newMessage: Message = {
      id: messages.length + 1,
      text: '',
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      media: { type: 'voice', url: '#', duration: recordingTime },
    };
    setMessages([...messages, newMessage]);
    setRecordingTime(0);
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallActive(true);
    setCallType(type);
    setGroupCallParticipants([selectedContact]);
  };

  const startGroupCall = () => {
    setCallActive(true);
    setCallType('video');
    setGroupCallParticipants([1, 2, 3]);
  };

  const addParticipant = (contactId: number) => {
    if (!groupCallParticipants.includes(contactId)) {
      setGroupCallParticipants([...groupCallParticipants, contactId]);
    }
  };

  const sendSticker = (sticker: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: '',
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      media: { type: 'sticker', url: sticker },
    };
    setMessages([...messages, newMessage]);
    setShowStickers(false);
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 3000);
  };

  const endCall = () => {
    setCallActive(false);
    setCallType(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
  };

  const getFilterStyle = () => ({
    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
  });

  return (
    <div className="h-screen flex bg-background overflow-hidden relative">
      {callActive && (
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
                            onClick={() => addParticipant(contact.id)}
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
              <Button size="icon" className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90" onClick={endCall}>
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
      )}
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
              onClick={() => setSelectedContact(contact.id)}
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

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border gradient-purple-blue">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 text-xl">
                <AvatarFallback>{contacts.find((c) => c.id === selectedContact)?.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-white">{contacts.find((c) => c.id === selectedContact)?.name}</h2>
                <p className="text-xs text-white/80">
                  {contacts.find((c) => c.id === selectedContact)?.typing ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-pulse">печатает</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </span>
                  ) : contacts.find((c) => c.id === selectedContact)?.online ? (
                    'В сети'
                  ) : (
                    contacts.find((c) => c.id === selectedContact)?.lastSeen || 'Не в сети'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={() => startCall('audio')}>
                <Icon name="Phone" size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={() => startCall('video')}>
                <Icon name="Video" size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={startGroupCall}>
                <Icon name="Users" size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={simulateTyping}>
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

        <div className="p-4 border-t border-border bg-card">
          {mediaPreview && (
            <div className="mb-3 p-3 bg-muted rounded-lg flex items-center gap-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden" style={getFilterStyle()}>
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={mediaPreview} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  {mediaType === 'image' ? 'Изображение' : 'Видео'} готово к отправке
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Wand2" size={16} />
                      Редактировать
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Редактирование медиа</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative w-full h-80 rounded-lg overflow-hidden bg-muted" style={getFilterStyle()}>
                        {mediaType === 'image' ? (
                          <img src={mediaPreview} alt="Edit" className="w-full h-full object-contain" />
                        ) : (
                          <video src={mediaPreview} controls className="w-full h-full" />
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <Icon name="Sun" size={16} />
                            Яркость: {brightness[0]}%
                          </Label>
                          <Slider value={brightness} onValueChange={setBrightness} min={0} max={200} step={1} />
                        </div>

                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <Icon name="Circle" size={16} />
                            Контраст: {contrast[0]}%
                          </Label>
                          <Slider value={contrast} onValueChange={setContrast} min={0} max={200} step={1} />
                        </div>

                        <div>
                          <Label className="flex items-center gap-2 mb-2">
                            <Icon name="Palette" size={16} />
                            Насыщенность: {saturation[0]}%
                          </Label>
                          <Slider value={saturation} onValueChange={setSaturation} min={0} max={200} step={1} />
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" onClick={resetFilters} className="flex-1">
                            Сбросить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setMediaPreview(null);
                  setMediaType(null);
                  resetFilters();
                }}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          )}

          {isRecording ? (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg animate-scale-in">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-medium">Запись голосового сообщения...</p>
                <p className="text-xs text-muted-foreground">{formatTime(recordingTime)}</p>
              </div>
              <Button size="icon" onClick={stopVoiceRecording} className="gradient-purple-pink text-white">
                <Icon name="Send" size={20} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { setIsRecording(false); clearInterval((window as any).recordingInterval); setRecordingTime(0); }}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          ) : (
            <>
              {showStickers && (
                <div className="mb-3 p-4 bg-muted rounded-lg animate-scale-in">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Стикеры и GIF</h3>
                    <Button size="sm" variant="ghost" onClick={() => setShowStickers(false)}>
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {['😀', '😂', '😍', '🥰', '😎', '🤩', '😜', '🤔', '😴', '🥳', '😇', '🤗', '👍', '👏', '🙌', '💪', '🔥', '❤️', '💯', '✨', '🎉', '🎈', '🌟', '⭐'].map(sticker => (
                      <button
                        key={sticker}
                        onClick={() => sendSticker(sticker)}
                        className="text-3xl hover:scale-125 transition-transform p-2 hover:bg-accent rounded-lg"
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Популярные GIF</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'].map((gif, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const newMessage: Message = {
                              id: messages.length + 1,
                              text: '',
                              sender: 'me',
                              time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                              media: { type: 'gif', url: gif },
                            };
                            setMessages([...messages, newMessage]);
                            setShowStickers(false);
                          }}
                          className="aspect-square bg-accent/50 rounded-lg hover:scale-105 transition-transform overflow-hidden"
                        >
                          <img src={gif} alt="GIF" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
                  <Button size="icon" variant="ghost" className="gradient-purple-pink text-white hover:opacity-90" asChild>
                    <div>
                      <Icon name="ImagePlus" size={20} />
                    </div>
                  </Button>
                </label>

                <Button size="icon" variant="ghost" className="hover:bg-accent" onClick={() => setShowStickers(!showStickers)}>
                  <Icon name="Smile" size={20} />
                </Button>

                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Написать сообщение..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="gradient-purple-pink text-white hover:opacity-90">
                    <Icon name="Send" size={20} />
                  </Button>
                </div>

                <Button size="icon" variant="ghost" className="gradient-purple-blue text-white hover:opacity-90" onClick={startVoiceRecording}>
                  <Icon name="Mic" size={20} />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}