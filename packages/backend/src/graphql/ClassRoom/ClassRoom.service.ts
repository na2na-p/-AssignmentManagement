import { Injectable } from '@nestjs/common';

import type { ClassRoom } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';
import { uuidv7 } from '@/utils/uuidv7';

const REGEXES = {
  normal: /^[A-Z]{2}\d{2}[A-Z]\d{3}$/,
  selected: /^[A-Z]{2}\d[A-Z]{3}[A-Z]{2}$/,
};

@Injectable()
export class ClassRoomService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<ClassRoom | null> {
    return this.prismaService.classRoom.findFirstOrThrow({
      where: { id },
    });
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
    return this.prismaService.classRoom.create({
      data: {
        id,
        classId,
        staffId,
        staffName,
      },
    });
  }

  validateClassId(id: string): boolean {
    return Object.values(REGEXES).some(regex => regex.test(id));
  }
}
