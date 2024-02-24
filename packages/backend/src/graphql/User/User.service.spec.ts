/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';

import { UserService } from './User.service';
import { ClassRoomService } from '../ClassRoom/ClassRoom.service';
import { StaffService } from '../Staff/Staff.service';
import { StudentService } from '../Student/Student.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let staffService: StaffService;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: StaffService,
          useValue: {
            findById: jest
              .fn()
              .mockResolvedValue({ id: 'staffId', name: 'Staff Name' }),
          },
        },
        {
          provide: StudentService,
          useValue: {
            findById: jest
              .fn()
              .mockResolvedValue({ id: 'studentId', name: 'Student Name' }),
          },
        },
        {
          provide: ClassRoomService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    staffService = module.get<StaffService>(StaffService);
    studentService = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds and returns a user with student details', async () => {
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce({
      id: 'user1',
      email: 'student@example.com',
      userableType: 'USER_USERABLE_TYPE_STUDENT',
      student: { id: 'studentId' },
      staff: null,
    } as any);

    const result = await service.findById('user1');
    expect(result).toEqual({
      id: 'user1',
      email: 'student@example.com',
      userableType: 'USER_USERABLE_TYPE_STUDENT',
      student: { id: 'studentId', name: 'Student Name' },
    });
    expect(studentService.findById).toHaveBeenCalledWith('studentId');
  });

  it('finds and returns a user with staff details', async () => {
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce({
      id: 'user2',
      email: 'staff@example.com',
      userableType: 'USER_USERABLE_TYPE_STAFF',
      student: null,
      staff: { id: 'staffId' },
    } as any);

    const result = await service.findById('user2');
    expect(result).toEqual({
      id: 'user2',
      email: 'staff@example.com',
      userableType: 'USER_USERABLE_TYPE_STAFF',
      staff: { id: 'staffId', name: 'Staff Name' },
    });
    expect(staffService.findById).toHaveBeenCalledWith('staffId');
  });

  // 他のテストケース（例えば、ユーザーが見つからない場合のエラーハンドリングなど）もここに追加する
});
