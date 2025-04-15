import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Interface für das Session-Dokument
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  id: string;
  loginTimestamp: Date;
  ipAddress: string;
  deviceInfo?: string;
  osInfo?: string;
  fcmToken?: string;
}

// Interface für das Session-Modell (optional, falls Modell-Methoden benötigt werden)
export interface ISessionModel extends Model<ISession> {}

// Definiere das Session-Schema
const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: String, required: true, default: uuidv4 },
    loginTimestamp: { type: Date, required: true, default: Date.now },
    ipAddress: { type: String, required: true },
    deviceInfo: { type: String, required: false },
    osInfo: { type: String, required: false },
    fcmToken: { type: String, required: false },
  },
  { timestamps: false } // Keine automatischen createdAt/updatedAt, da nicht im Schema
);

// Erstelle und exportiere das Session-Modell
export const Session = mongoose.model<ISession, ISessionModel>('Session', sessionSchema);