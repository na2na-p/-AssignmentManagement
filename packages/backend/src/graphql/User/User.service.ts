import { Injectable } from '@nestjs/common';

import type { User } from '@/generated/types';
import { UserUserableType } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<User | undefined> {
    // const user = await this.prismaService.user.findFirstOrThrow({
    //   where: { id },
    // });
    // 紐づいている、studentかstaffの情報も取得する
    const user = await this.prismaService.user.findFirst({
      where: { id },
      include: {
        student: true,
        staff: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    switch (user.userableType) {
      case UserUserableType.USER_USERABLE_TYPE_STUDENT:
        return {
          id: user.id,
          email: user.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STUDENT,
          student: {
            id: user.student!.id,
            // TODO: なおす
            classRoom: null as any,
            staffName: null as any,
            hasManagerRole: user.student!.hasManagerRole,
            name: user.student!.name,
            studentNumber: user.student!.studentNumber,
          },
        };

      case UserUserableType.USER_USERABLE_TYPE_STAFF:
        return {
          id: user.id,
          email: user.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STAFF,
          staff: {
            id: user.staff!.id,
            name: user.staff!.name,
          },
        };
    }
  }
}
