import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Seeder } from "nestjs-seeder";
import { Role } from "./role.schema";

@Injectable()
export class RoleSeeder implements Seeder {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>
  ) {}

  async seed(): Promise<any> {
    const data = [
      {
        role_name: "USER",
      },
      {
        role_name: "LIBRARIAN",
      },
      {
        role_name: "OWNER",
      },
      {
        role_name: "ADMIN",
      },
    ];
    return this.roleModel.insertMany(data);
  }

  async drop(): Promise<any> {
    return this.roleModel.deleteMany({});
  }
}
