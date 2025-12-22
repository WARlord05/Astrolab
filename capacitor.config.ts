import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.astrolab', // IMPORTANT: Change this to a unique ID for your app
  appName: 'Astrolab',
  webDir: 'dist', // This points to your Vite build output directory
  bundledWebRuntime: false
};

export default config;