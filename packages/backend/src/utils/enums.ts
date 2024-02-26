/**
 * Prismaの列挙型とGraphQLの列挙型が一致していることを保証するためのテストレイヤ
 */

import { $Enums } from '@prisma/client';

import * as graphqlSchema from '@/generated/schema';

const {
  SubjectStateStatus: PrismaSubjectStateStatus,
  UserUserableType: PrismaUserUserableType,
  ...prismaRest
} = $Enums;

const {
  SubjectStateStatus: GraphQLSubjectStateStatus,
  UserUserableType: GraphQLUserUserableType,
  ...graphqlRest
} = graphqlSchema;

/**
 * restが空であることを保証する型
 * 不足があれば、そのプロパティ名を表示する
 */
type IsEmpty<T> = keyof T extends never ? true : keyof T;
const _prismaRestIsEmpty: IsEmpty<typeof prismaRest> = true;
const _graphqlRestIsEmpty: IsEmpty<typeof graphqlRest> = true;

/**
 * 二つのオブジェクトが、プロパティの過不足なく全く同じ型であることを保証する型
 * 不足があれば、そのプロパティ名を表示する
 * 過不足がなければtrue
 */
type IsExhaustive<T, U> =
  | Exclude<keyof T, keyof U>
  | Exclude<keyof U, keyof T> extends never
  ? true
  : Exclude<keyof T, keyof U> | Exclude<keyof U, keyof T>;

const _userableTypeCheck: IsExhaustive<
  typeof GraphQLUserUserableType,
  typeof PrismaUserUserableType
> = true;

const _subjectStateStatusCheck: IsExhaustive<
  typeof GraphQLSubjectStateStatus,
  typeof PrismaSubjectStateStatus
> = true;
