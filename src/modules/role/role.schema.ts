import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({ required: true })
  role_name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
