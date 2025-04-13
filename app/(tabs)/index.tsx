import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpeechRecognition } from '../services/speechRecognitionService';
import { translateText } from '../services/translationService';

export default function HomeScreen() {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const { 
    isListening, 
    recognizedText, 
    error, 
    hasPermission, 
    startListening, 
    stopListening 
  } = useSpeechRecognition();

  const handleTranslate = useCallback(async () => {
    if (recognizedText) {
      try {
        setIsTranslating(true);
        // 日本語から英語への翻訳
        const translated = await translateText(recognizedText, 'ja', 'en');
        setTranslatedText(translated);
      } catch (err) {
        console.error('翻訳エラー:', err);
      } finally {
        setIsTranslating(false);
      }
    }
  }, [recognizedText]);

  if (!hasPermission && Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Text>マイクの使用許可が必要です</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>簡易通訳アプリ</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>認識された音声:</Text>
        {isListening ? (
          <Text style={styles.listeningText}>聞いています...</Text>
        ) : (
          <Text style={styles.inputText}>{recognizedText || '音声を認識していません'}</Text>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isListening ? "停止" : "音声入力開始"}
          onPress={isListening ? stopListening : () => startListening('ja-JP')}
          color="#4285F4"
        />
        <Button
          title="翻訳"
          onPress={handleTranslate}
          disabled={!recognizedText || isTranslating}
          color="#34A853"
        />
      </View>

      <View style={styles.outputContainer}>
        <Text style={styles.label}>翻訳結果:</Text>
        {isTranslating ? (
          <ActivityIndicator size="large" color="#4285F4" />
        ) : (
          <Text style={styles.outputText}>{translatedText || '翻訳結果がここに表示されます'}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  outputContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputText: {
    fontSize: 18,
    minHeight: 50,
  },
  outputText: {
    fontSize: 18,
    minHeight: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  listeningText: {
    fontSize: 18,
    color: '#4285F4',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});