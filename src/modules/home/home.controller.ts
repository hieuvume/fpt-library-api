import { Controller, Get } from "@nestjs/common";

@Controller("home")
export class HomeController {
  // constructor(private readonly userService: UserService) {}

  @Get("")
  async findAll() {
  }
}
