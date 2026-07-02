import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type SortDirection = "asc" | "desc";

type SortOption = {
  field: string;
  label: string;
};

type DataTableToolbarProps = {
  searchValue: string;
  searchPlaceholder: string;
  onSearchValueChange: (value: string) => void;
  sortOptions: SortOption[];
  currentSortFieldLabel?: string;
  currentSortDirection?: SortDirection;
  onSortFieldChange: (field: string) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onClearSort: () => void;
};

export const DataTableToolbar = ({
  searchValue,
  searchPlaceholder,
  onSearchValueChange,
  sortOptions,
  currentSortFieldLabel,
  currentSortDirection,
  onSortFieldChange,
  onSortDirectionChange,
  onClearSort,
}: DataTableToolbarProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Input
        value={searchValue}
        onChange={(event) => onSearchValueChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="md:max-w-sm"
      />
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between md:min-w-40">
              {currentSortFieldLabel ?? "Sort field"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.field}
                onSelect={() => onSortFieldChange(option.field)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onSelect={onClearSort}>
              Clear sort
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex rounded-md border border-border p-1">
          <Button
            type="button"
            variant={currentSortDirection === "asc" ? "default" : "ghost"}
            className="h-7 px-3 text-xs"
            onClick={() => onSortDirectionChange("asc")}
          >
            Asc
          </Button>
          <Button
            type="button"
            variant={currentSortDirection === "desc" ? "default" : "ghost"}
            className="h-7 px-3 text-xs"
            onClick={() => onSortDirectionChange("desc")}
          >
            Desc
          </Button>
        </div>
      </div>
    </div>
  );
};
