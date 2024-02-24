import { Injectable } from '@nestjs/common';

import type { ClassRoom } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ClassRoomService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<ClassRoom | null> {
    return this.prismaService.classRoom.findFirstOrThrow({
      where: { id },
    });
  }
}
