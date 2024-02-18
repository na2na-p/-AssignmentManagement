import { Injectable } from '@nestjs/common';

import type { Viewer } from '@/generated/types';

@Injectable()
export class ViewerService {
  Viewer(): Viewer {
    return {
      me: null,
      assignedSubjects: null,
    };
  }
}
