import axios from 'axios';
import { LIBRETRANSLATE_API_URL, LIBRETRANSLATE_API_KEY } from '@env';

export interface TranslationRequest {
  q: string;
  source: string;
  target: string;
  format?: string;
  api_key?: string;
}

export interface TranslationResponse {
  translatedText: string;
}

export const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  try {
    const payload: TranslationRequest = {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    };
    
    // APIキーがあれば追加
    if (LIBRETRANSLATE_API_KEY) {
      payload.api_key = LIBRETRANSLATE_API_KEY;
    }

    const response = await axios.post<TranslationResponse>(
      LIBRETRANSLATE_API_URL,
      payload
    );

    return response.data.translatedText;
  } catch (error) {
    console.error('翻訳エラー:', error);
    throw new Error('翻訳中にエラーが発生しました');
  }
};

// 利用可能な言語を取得する関数
export const getAvailableLanguages = async () => {
  try {
    const response = await axios.get(`${LIBRETRANSLATE_API_URL.replace('/translate', '/languages')}`);
    return response.data;
  } catch (error) {
    console.error('言語リスト取得エラー:', error);
    throw new Error('言語リストの取得中にエラーが発生しました');
  }
};