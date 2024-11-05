import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
} from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { UpdateMemberShipDto } from "./dto/update-membership.dto";

@Controller("dashboard/memberships")
export class MembershipDashBoardController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  async findAll() {
    return await this.membershipService.findAll();
  }

  @Get(":page/:pageSize")
  async paginateMembership(
    @Param("page") page: string,
    @Param("pageSize") pageSize: string
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(pageSizeNumber) ||
      pageNumber <= 0 ||
      pageSizeNumber <= 0
    ) {
      return {
        message: "Invalid page or pageSize",
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    return this.membershipService.paginateMembership(
      pageNumber,
      pageSizeNumber
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.membershipService.findById(id);
  }

  @Get("find-by-name/:name")
  async findByName(@Param("name") name: string) {
    return this.membershipService.findByName(name);
  }

  @Post()
  async create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateMembershipDto: UpdateMemberShipDto
  ) {
    return this.membershipService.update(id, updateMembershipDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.membershipService.delete(id);
  }
}
