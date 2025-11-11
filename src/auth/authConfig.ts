import dotenv from 'dotenv';
import { serverUrl } from '../configs';

dotenv.config();

const credentialsList: string[] = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FACEBOOK_CLIENT_ID',
  'FACEBOOK_CLIENT_SECRET',
  'LINE_CHANNEL_ID',
  'LINE_CHANNEL_SECRET',
];

credentialsList.map((credential) => {
  if (!process.env[credential]) {
    throw new Error(
      `Missing required environment variable: ${credential}. ` +
        'Please set this in your .env file.',
    );
  }
});

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: `${serverUrl}/auth/google/callback`,
  scope: ['profile', 'email'],
};

export const facebookConfig = {
  clientID: process.env.FACEBOOK_CLIENT_ID || '',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  callbackURL: `${serverUrl}/auth/facebook/callback`,
};

export const lineConfig = {
  channelID: process.env.LINE_CHANNEL_ID || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
  callbackURL: `${serverUrl}/auth/line/callback`,
};
