import { Injectable } from '@nestjs/common';

import type { Subject } from '@/generated/resolvers';

@Injectable()
export class ViewerService {
  async getAssignedSubjects(_id: string): Promise<Array<Subject> | null> {
    // データベースからユーザーの担当科目を取得するロジックを実装
    // 以下はダミーの実装例です
    return null;
  }
}
