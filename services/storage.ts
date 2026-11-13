import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJsonStorage } from './core/jsonStorage';

export const storage = createJsonStorage(AsyncStorage);
export const storageKeys = {
  session: 'academy:v1:session',
  preferences: 'academy:v1:preferences',
  students: 'academy:v1:students',
  academic: 'academy:v1:academic',
  weatherPrefix: 'academy:v1:weather:',
};
