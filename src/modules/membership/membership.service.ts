import { HttpStatus, Injectable } from "@nestjs/common";
import { MembershipRepository } from "./membership.repository";
import { BookTitleRepository } from "modules/book-title/book-title.repository";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { UpdateMemberShipDto } from "./dto/update-membership.dto";

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly bookTitleRepository: BookTitleRepository
  ) {}

  async findAll() {
    const memberships = await this.membershipRepository.findAll();
    const membershipWithBookCounts = await Promise.all(
      memberships.map(async (membership) => {
        const resources_count =
          await this.bookTitleRepository.countByMembershipId(membership._id);

        return {
          ...membership.toObject(),
          resources_count,
        };
      })
    );
    return membershipWithBookCounts;
  }

  //crud with admin:

  async paginateMembership(page: number, pageSize: number) {
    return this.membershipRepository.paginateMemberships(page, pageSize);
  }
  
  async findById(id: string) {
    return this.membershipRepository.findById(id);
  }

  async findByName(name: string) {
    return this.membershipRepository.findByNameContains(name);
  }

  async create(membership: CreateMembershipDto) {
    try {
      const existingMembership = await this.membershipRepository.findByName(
        membership.name
      );

      if (existingMembership != null) {
        return {
          message: "Membership already exists",
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      const newMembership =
        await this.membershipRepository.createByAdmin(membership);
      return {
        message: "Membership created successfully",
        statusCode: HttpStatus.CREATED,
        data: newMembership,
      };
    } catch (error) {
      return {
        message: "Create failed ",
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async update(id: string, membership: UpdateMemberShipDto) {
    try {
      const existingMembership = await this.membershipRepository.findById(id);

      // check not exist membership
      if (!existingMembership) {
        return {
          message: "Membership not found",
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      if (membership.name.trim() === "") {
        return {
          message: "Invalid name",
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      // check duplicate name with other name
      if (membership.name && membership.name !== existingMembership.name) {
        const duplicateMemberShip = await this.membershipRepository.findByName(
          membership.name
        );

        if (duplicateMemberShip) {
          return {
            message: "Membership name already exists",
            statusCode: HttpStatus.BAD_REQUEST,
            data: duplicateMemberShip,
          };
        }
      }

      //update
      const updatedMembership = await this.membershipRepository.update(
        id,
        membership
      );
      return {
        message: "Membership updated successfully",
        statusCode: HttpStatus.OK,
        data: updatedMembership,
      };
    } catch (error) {
      return {
        message: "Update failed ",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async delete(id: string) {
    const deletedMembership = await this.membershipRepository.delete(id);

    // Nếu không tìm thấy membership, trả về thông báo và mã lỗi 404
    if (!deletedMembership) {
      return {
        message: "Membership not found",
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    // Nếu xóa thành công
    return {
      message: "Membership deleted successfully",
      statusCode: HttpStatus.OK,
    };
  }
}
