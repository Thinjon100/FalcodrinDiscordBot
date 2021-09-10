import "dotenv-safe/config"; // Loads .env file into process.env
import { Container, Token } from "typedi";

export const CORS_ORIGIN = new Token<string>('CORS_ORIGIN');
export const PORT = new Token<number>('PORT');
export const DISCORD_TOKEN = new Token<string>('DISCORD_TOKEN');
export const SQLITE_FILENAME = new Token<string>('SQLITE_FILENAME');
export const SCREW_THIS_GUY = new Token<string>('SCREW_THIS_GUY');
export const API_STATIC_TOKEN = new Token<string>('API_STATIC_TOKEN');
export const API_STATIC_USERID = new Token<string>('API_STATIC_USERID');

Container.set(CORS_ORIGIN, process.env.CORS_ORIGIN ?? "*");
Container.set(PORT, +(process.env.PORT ?? 5000));
Container.set(DISCORD_TOKEN, process.env.DISCORD_TOKEN);
Container.set(SQLITE_FILENAME, process.env.SQLITE_FILENAME);
Container.set(SCREW_THIS_GUY, process.env.SCREW_THIS_GUY);
Container.set(API_STATIC_TOKEN, process.env.API_STATIC_TOKEN);
Container.set(API_STATIC_USERID, process.env.API_STATIC_USERID);