import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import type {
  Staff,
  StaffCreateInput,
  UserCreateInput,
} from '@/generated/types';
import { UserUserableType } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<Staff | null> {
    return this.prismaService.staff.findUnique({
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
    const passwordDigest = await this.createPasswordDigest({
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

  // TODO: どこかに共通化
  async createPasswordDigest({
    password,
  }: {
    password: string;
  }): Promise<string> {
    const SALT_OR_ROUNDS = 10;
    console.log('password', password);
    return bcrypt.hash(password, SALT_OR_ROUNDS);
  }
}
