export type SortDirection = "asc" | "desc";

export type SortConfig = {
  field: string;
  direction: SortDirection;
} | null;

const normalizeComparableValue = (value: unknown) => {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return String(value ?? "").toLowerCase();
};

const normalizeSearchValue = (value: unknown) => {
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return String(value ?? "");
};

export const filterRows = <T,>(
  rows: T[],
  query: string,
  extractors: Array<(row: T) => unknown>,
) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((row) =>
    extractors.some((extract) =>
      normalizeSearchValue(extract(row)).toLowerCase().includes(normalizedQuery),
    ),
  );
};

export const sortRows = <T,>(
  rows: T[],
  sort: SortConfig,
  accessors: Record<string, (row: T) => unknown>,
) => {
  if (!sort) {
    return rows;
  }

  const accessor = accessors[sort.field];

  if (!accessor) {
    return rows;
  }

  return [...rows].sort((left, right) => {
    const leftValue = normalizeComparableValue(accessor(left));
    const rightValue = normalizeComparableValue(accessor(right));

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return sort.direction === "asc"
        ? leftValue - rightValue
        : rightValue - leftValue;
    }

    const comparison = String(leftValue).localeCompare(String(rightValue));
    return sort.direction === "asc" ? comparison : -comparison;
  });
};

export const getSortLabel = (
  sort: SortConfig,
  labels: Record<string, string>,
) => {
  if (!sort) {
    return "Sort";
  }

  const label = labels[sort.field] ?? sort.field;
  return `${label} ${sort.direction === "asc" ? "Asc" : "Desc"}`;
};