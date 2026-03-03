import {
  PrismaCountArgs,
  PrismaFindManyArgs,
} from "../interface/queryBuilders.i";

export class QueryBuilders<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countArgs: PrismaCountArgs;
  private page: number = 1;
  private limit: number = 5;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrderBy: "asc" | "desc" = "desc";
  private selectFields: Record<string, boolean | undefined>;
}
