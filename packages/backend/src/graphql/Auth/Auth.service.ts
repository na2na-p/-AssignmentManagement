import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import type { SignInInput } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';

const SALT_OR_ROUNDS = 10;

export type JwtPayload = {
  /**
   * ユーザID
   */
  username: string;
  /**
   * 具象ユーザID
   */
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async signIn({
    email,
    password,
  }: SignInInput): Promise<{ access_token: string; userId: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = {
      username: user.id,
      sub: user.staffId ? user.staffId : user.studentId ?? '',
    } satisfies JwtPayload;
    return {
      userId: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  private async findUser(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async getPasswordDigest({
    password,
  }: {
    password: string;
  }): Promise<string> {
    return bcrypt.hash(password, SALT_OR_ROUNDS);
  }

  private async getUserIdByToken(token: string): Promise<string> {
    const payload = this.jwtService.decode(token) as JwtPayload;
    return payload.username;
  }

  private async validateUser(
    email: string,
    password: string
  ): Promise<Pick<User, 'id' | 'studentId' | 'staffId'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordDigest = await this.getPasswordDigest({ password });

    if (user.password_digest !== passwordDigest) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      studentId: user.studentId,
      staffId: user.staffId,
    };
  }
}
