import { Injectable } from '@nestjs/common';

import type {
  Staff,
  StaffCreateInput,
  UserCreateInput,
} from '@/generated/types';
import { UserUserableType } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';
import { createPasswordDigest } from '@/utils/createPasswordDigest';

@Injectable()
export class StaffService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<Staff | null> {
    return this.prismaService.staff.findFirstOrThrow({
      where: { id },
    });
  }

  async createStaff({
    staffId,
    userId,
    staffCreateInput,
    userCreateInput,
  }: {
    staffId: string;
    userId: string;
    staffCreateInput: StaffCreateInput;
    userCreateInput: UserCreateInput;
  }): Promise<Staff> {
    const passwordDigest = await createPasswordDigest({
      password: userCreateInput.password,
    });

    const results = await this.prismaService.$transaction(async prisma => {
      const isUserExists = await prisma.user.findUnique({
        where: { email: userCreateInput.email },
      });
      if (isUserExists) {
        throw new Error('User already exists');
      }

      const staff = await prisma.staff.create({
        data: {
          id: staffId,
          name: staffCreateInput.name,
          userId,
        },
      });

      const user = await prisma.user.create({
        data: {
          id: userId,
          email: userCreateInput.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STAFF,
          passwordDigest,
          staffId,
        },
      });

      if (!user) {
        throw new Error('User create failed');
      }

      return staff;
    });
    return results;
  }
}
