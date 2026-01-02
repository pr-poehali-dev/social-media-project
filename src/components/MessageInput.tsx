import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  mediaPreview: string | null;
  mediaType: 'image' | 'video' | null;
  isRecording: boolean;
  recordingTime: number;
  showStickers: boolean;
  setShowStickers: (value: boolean) => void;
  brightness: number[];
  setBrightness: (value: number[]) => void;
  contrast: number[];
  setContrast: (value: number[]) => void;
  saturation: number[];
  setSaturation: (value: number[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  onSendMessage: () => void;
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartVoiceRecording: () => void;
  onStopVoiceRecording: () => void;
  onResetFilters: () => void;
  onClearMediaPreview: () => void;
  getFilterStyle: () => { filter: string };
  formatTime: (seconds: number) => string;
}

export default function MessageInput({
  messageInput,
  setMessageInput,
  mediaPreview,
  mediaType,
  isRecording,
  recordingTime,
  showStickers,
  setShowStickers,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  messages,
  setMessages,
  onSendMessage,
  onMediaUpload,
  onStartVoiceRecording,
  onStopVoiceRecording,
  onResetFilters,
  onClearMediaPreview,
  getFilterStyle,
  formatTime,
}: MessageInputProps) {
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

  return (
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
                      <Button variant="outline" onClick={onResetFilters} className="flex-1">
                        Сбросить
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button size="icon" variant="ghost" onClick={onClearMediaPreview}>
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
          <Button size="icon" onClick={onStopVoiceRecording} className="gradient-purple-pink text-white">
            <Icon name="Send" size={20} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => { 
            clearInterval((window as any).recordingInterval); 
          }}>
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
              <input type="file" accept="image/*,video/*" onChange={onMediaUpload} className="hidden" />
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
                onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                className="flex-1"
              />
              <Button onClick={onSendMessage} className="gradient-purple-pink text-white hover:opacity-90">
                <Icon name="Send" size={20} />
              </Button>
            </div>

            <Button size="icon" variant="ghost" className="gradient-purple-blue text-white hover:opacity-90" onClick={onStartVoiceRecording}>
              <Icon name="Mic" size={20} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
