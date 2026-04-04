/**
 * Vercel Serverless: misma app Express que en local (x402 + análisis).
 */

import dotenv from "dotenv";
dotenv.config();
import { createApp } from "../../src/createApp.js";

export default createApp();
