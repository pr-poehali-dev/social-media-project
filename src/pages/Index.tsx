import { useState } from 'react';
import ContactsSidebar from '@/components/ContactsSidebar';
import CallInterface from '@/components/CallInterface';
import ChatArea from '@/components/ChatArea';
import MessageInput from '@/components/MessageInput';

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

  const clearMediaPreview = () => {
    setMediaPreview(null);
    setMediaType(null);
    resetFilters();
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden relative">
      <CallInterface
        callActive={callActive}
        callType={callType}
        selectedContact={selectedContact}
        contacts={contacts}
        groupCallParticipants={groupCallParticipants}
        onEndCall={endCall}
        onAddParticipant={addParticipant}
      />
      
      <ContactsSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={setSelectedContact}
      />

      <div className="flex-1 flex flex-col">
        <ChatArea
          selectedContact={selectedContact}
          contacts={contacts}
          messages={messages}
          onStartCall={startCall}
          onStartGroupCall={startGroupCall}
          onSimulateTyping={simulateTyping}
          formatTime={formatTime}
        />

        <MessageInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          mediaPreview={mediaPreview}
          mediaType={mediaType}
          isRecording={isRecording}
          recordingTime={recordingTime}
          showStickers={showStickers}
          setShowStickers={setShowStickers}
          brightness={brightness}
          setBrightness={setBrightness}
          contrast={contrast}
          setContrast={setContrast}
          saturation={saturation}
          setSaturation={setSaturation}
          messages={messages}
          setMessages={setMessages}
          onSendMessage={handleSendMessage}
          onMediaUpload={handleMediaUpload}
          onStartVoiceRecording={startVoiceRecording}
          onStopVoiceRecording={stopVoiceRecording}
          onResetFilters={resetFilters}
          onClearMediaPreview={clearMediaPreview}
          getFilterStyle={getFilterStyle}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
}
