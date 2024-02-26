import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { user } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import type { SignInInput } from '@/generated/schema';
import { PrismaService } from '@/prisma/prisma.service';

export type JwtPayload = {
  /**
   * 具象ユーザID
   */
  username: string;
  /**
   * ユーザID
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
      username: user.staffId ? user.staffId : user.studentId ?? '',
      sub: user.id,
    } satisfies JwtPayload;
    return {
      userId: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  private async findUser(email: string): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async getUserIdByToken(token: string): Promise<string> {
    const payload = this.jwtService.decode(token) as JwtPayload;
    return payload.username;
  }

  private async validateUser(
    email: string,
    password: string
  ): Promise<Pick<user, 'id' | 'studentId' | 'staffId'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(
        '認証に失敗しました。メールアドレスまたはパスワードが正しくありません'
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordDigest);

    if (!isMatch) {
      throw new UnauthorizedException(
        '認証に失敗しました。メールアドレスまたはパスワードが正しくありません'
      );
    }

    return {
      id: user.id,
      studentId: user.studentId,
      staffId: user.staffId,
    };
  }
}
