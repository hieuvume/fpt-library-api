import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { Document, ObjectId } from "mongoose";

export type RoleDocument = Role & Document;

@Schema()
export class Role {

  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  role_name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
