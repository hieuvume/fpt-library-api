import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { Book } from "modules/book/book.schema";
import { MembershipCard } from "modules/membership-card/membership-card.schema";
import { Role } from "modules/role/role.schema";
import { Document, ObjectId, Types } from "mongoose";
import { Factory } from "nestjs-seeder";
import * as bcrypt from "bcryptjs";
import { fakerVI } from "@faker-js/faker";
export type UserDocument = User & Document;

@Schema()
export class User {
  @Factory(() => new Types.ObjectId())
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Factory(() => fakerVI.internet.email())
  @Prop({ required: true, unique: true })
  email: string;

  @Factory(() => bcrypt.hashSync("123123", 10))
  @Prop({})
  password: string;

  @Factory(() => fakerVI.person.fullName())
  @Prop({})
  full_name: string;

  @Factory(() => fakerVI.phone.number())
  @Prop()
  phone_number: string;

  @Factory((faker) => faker.person.gender())
  @Prop()
  gender: string;

  @Factory((faker) => faker.date.past())
  @Prop()
  date_of_birth: Date;

  @Factory(() => fakerVI.location.streetAddress())
  @Prop()
  address: string;

  @Factory((faker) => ({
    id_number: faker.string.numeric(12),
    date: faker.date.past(),
    place: fakerVI.location.city(),
  }))
  @Prop({ type: Object })
  id_card: object;

  @Prop({ type: Types.ObjectId, ref: 'MembershipCard' })
  @Type(() => MembershipCard)
  current_membership: MembershipCard;

  @Prop({ type: [Types.ObjectId], ref: Book.name })
  @Type(() => Book)
  borrowed_books: Book[];

  @Prop({ type: Types.ObjectId, ref: Role.name })
  @Type(() => Role)
  role: Role;

  @Factory(() => fakerVI.image.avatar())
  @Prop()
  avatar_url: string;

  @Prop()
  google_id: string;

  @Prop()
  google_access_token: string;

  @Prop()
  token_expires_at: Date;

  @Factory(() => new Date())
  @Prop()
  created_at: Date;

  @Factory(() => new Date())
  @Prop()
  updated_at: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
UserSchema.plugin(require("mongoose-paginate-v2"));
