import { Injectable } from '@nestjs/common';

import type { User } from '@/generated/types';
import { UserUserableType } from '@/generated/types';

@Injectable()
export class UserService {
  async findById(id: string): Promise<User | undefined> {
    // データベースからユーザー情報を取得するロジックを実装
    // 以下はダミーの実装例です
    return {
      id,
      email: 'user@example.com',
      userableType: UserUserableType.USER_USERABLE_TYPE_STUDENT,
    };
  }
}
