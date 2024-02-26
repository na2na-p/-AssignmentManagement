import { StaffService } from '@graphql/Staff/Staff.service';
import { Injectable } from '@nestjs/common';

import type { ClassRoom } from '@/generated/schema';
import { PrismaService } from '@/prisma/prisma.service';
import { uuidv7 } from '@/utils/uuidv7';

const REGEXES = {
  normal: /^[A-Z]{2}\d{2}[A-Z]\d{3}$/,
  selected: /^[A-Z]{2}\d[A-Z]{3}[A-Z]{2}$/,
};

@Injectable()
export class ClassRoomService {
  constructor(
    private prismaService: PrismaService,
    private staffService: StaffService
  ) {}

  async findById(id: string): Promise<ClassRoom> {
    const classRoom = await this.prismaService.classRoom.findFirstOrThrow({
      where: { id },
    });

    if (classRoom.staffId === null)
      return {
        ...classRoom,
        __typename: 'ClassRoom',
        staff: null,
      };

    const staff = await this.staffService.findById(classRoom.staffId);
    return {
      ...classRoom,
      __typename: 'ClassRoom',
      staff,
    };
  }

  async create({
    id = uuidv7(),
    classId,
    staffId,
    staffName,
  }: {
    id?: string;
    classId: string;
    staffId?: string;
    staffName: string;
  }): Promise<ClassRoom> {
    void (await this.prismaService.classRoom.create({
      data: {
        id,
        classId,
        staffId,
        staffName,
      },
    }));

    const classRoom = await this.findById(id);
    return {
      ...classRoom,
      __typename: 'ClassRoom',
    };
  }

  validateClassId(id: string): boolean {
    return Object.values(REGEXES).some(regex => regex.test(id));
  }
}
