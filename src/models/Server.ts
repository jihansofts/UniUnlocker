import { Schema, model, models, type Model } from "mongoose";
import { SERVER_STATUSES, type ServerStatus } from "@/types";

export interface IServer {
  name: string;
  description: string;
  logo: string;
  price: string;
  status: ServerStatus;
  enabled: boolean;
  displayOrder: number;
  statusUpdatedAt: Date;
}

const ServerSchema = new Schema<IServer>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    logo: { type: String, default: "" },
    price: { type: String, default: "", trim: true },
    status: { type: String, enum: SERVER_STATUSES, default: "online" },
    enabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    statusUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Server: Model<IServer> = models.Server || model<IServer>("Server", ServerSchema);
