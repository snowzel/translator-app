import Voice from '@react-native-voice/voice';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(Platform.OS === 'web'); // webはデフォルトで許可

  useEffect(() => {
    // イベントハンドラーの設定
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (e) => {
      setError(e.error?.message || '音声認識エラー');
      setIsListening(false);
    };
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setRecognizedText(e.value[0]);
      }
    };

    // クリーンアップ関数
    return () => {
      stopListening();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async (language = 'ja-JP') => {
    try {
      setError('');
      setRecognizedText('');
      await Voice.start(language);
    } catch (e) {
      console.error('音声認識開始エラー:', e);
      setError('音声認識を開始できませんでした');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('音声認識停止エラー:', e);
    }
  };

  return {
    isListening,
    recognizedText,
    error,
    hasPermission,
    startListening,
    stopListening,
  };
};