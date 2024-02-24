export type Typename<
  T extends {
    __typename?: string;
  },
> = NonNullable<T['__typename']>;
