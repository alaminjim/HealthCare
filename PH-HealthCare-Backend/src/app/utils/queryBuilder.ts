import {
  IQueryConfig,
  IQueryParams,
  ParamsFindModel,
  PrismaNumberFilter,
  PrismaStringFilter,
  PrismaWhereConditions,
  TFindManyArgs,
  TFindManyArgsCount,
} from "../interface/queryBuilders.i";

export class queryBuilders<
  T,
  TWhereQuery = Record<string, unknown>,
  TInclude = Record<string, unknown>,
> {
  private query: TFindManyArgs;
  private count: TFindManyArgsCount;
  private page: number = 1;
  private limit: number = 5;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";
  private selectFields: Record<string, unknown | undefined>;

  constructor(
    private model: ParamsFindModel,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    this.query = {
      where: {},
      include: {},
      select: {},
      orderBy: {},
      skip: 0,
      take: 10,
    };

    this.count = {
      where: {},
    };
  }

  search(): this {
    const { searchTerms } = this.queryParams;
    const { searchQueryFields } = this.config;

    if (searchTerms && searchQueryFields && searchQueryFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchQueryFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");

            if (parts.length === 2) {
              const [relations, nestedFields] = parts;

              const searchResult: PrismaStringFilter = {
                contains: searchTerms,
                mode: "insensitive" as const,
              };

              return {
                [relations]: { [nestedFields]: searchResult },
              };
            } else if (parts.length === 3) {
              const [relations, nestedRelation, nestedFields] = parts;

              const searchResult: PrismaStringFilter = {
                contains: searchTerms,
                mode: "insensitive" as const,
              };

              return {
                [relations]: {
                  some: {
                    [nestedRelation]: {
                      [nestedFields]: searchResult,
                    },
                  },
                },
              };
            }
          }

          const searchResult: PrismaStringFilter = {
            contains: searchTerms,
            mode: "insensitive" as const,
          };
          return {
            [field]: searchResult,
          };
        },
      );

      const whereConditions = this.query.where as PrismaWhereConditions;
      whereConditions.OR = searchConditions;

      const whereCountConditions = this.count.where as PrismaWhereConditions;
      whereCountConditions.OR = searchConditions;
    }
    return this;
  }

  filter(): this {
    const { filterQueryFields } = this.config;
    const excludedFields = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "includes",
    ];

    const filterParams: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedFields.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });

    const queryParams = this.query.where as Record<string, unknown>;
    const queryCountParams = this.count.where as Record<string, unknown>;

    Object.keys(this.queryParams).forEach((key) => {
      const value = filterParams[key];

      if (value === undefined && value === "") {
        return;
      }

      const isAllowed =
        !filterQueryFields ||
        filterQueryFields.length === 0 ||
        filterQueryFields.includes(key);

      if (!isAllowed) {
        return;
      }

      if (key.includes(".")) {
        const parts = key.split(".");

        if (parts.length === 2) {
          const [relation, nestedFields] = parts;

          queryParams[relation] = {
            [nestedFields]: value,
          };

          queryCountParams[relation] = {
            [nestedFields]: value,
          };
        } else if (parts.length === 3) {
          const [relations, nestedRelations, nestedFields] = parts;

          queryParams[relations] = {
            [nestedRelations]: {
              [nestedFields]: value,
            },
          };

          queryCountParams[relations] = {
            [nestedRelations]: {
              [nestedFields]: value,
            },
          };
        } else {
          queryParams[key] = value;
          queryCountParams[key] = value;
        }
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        queryParams[key] = this.parseFilterValue(value);
        queryCountParams[key] = this.parseFilterValue(value);
        return;
      }

      queryParams[key] = this.parseFilterValue(value);
      queryCountParams[key] = this.parseFilterValue(value);
    });

    return this;
  }

  private parseFilterValue(value: unknown): unknown {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }

    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }

    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }

    return value;
  }

  private parseRangeFilterValue(
    value: Record<string, string | number>,
  ): PrismaNumberFilter | PrismaStringFilter | Record<string, unknown> {
    const rangeQuery: Record<string, string | number | (string | number)[]> =
      {};

    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];

      const parseValue: string | number =
        typeof operatorValue === "string" && !isNaN(Number(operatorValue))
          ? Number(operatorValue)
          : operatorValue;

      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = operatorValue;
          break;

        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parseValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
}
