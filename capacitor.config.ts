import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.warlord05.astrolab',
  appName: 'Astrolab',
  webDir: 'dist', // This points to your Vite build output directory
  bundledWebRuntime: false
};

export default config;