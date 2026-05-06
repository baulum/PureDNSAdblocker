import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://mxkqypoguicdaoytxgsc.supabase.co';
const supabaseAnonKey = 'sb_publishable_O8S3QZIQj9HMRhyCNd8cUg_dhdZejuV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
