import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.studypulse.app',
  appName: 'StudyPulse',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '353738770293-qnabie1ld463h15brpl9kc08kq6nb15p.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;