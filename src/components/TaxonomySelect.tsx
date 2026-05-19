import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaxonomyCategory } from "@/constants/careerTaxonomy";

type TaxonomySelectProps = {
  categoryLabel: string;
  roleLabel: string;
  categories: TaxonomyCategory[];
  categoryId: string;
  role: string;
  otherText?: string;
  onCategoryChange: (id: string) => void;
  onRoleChange: (role: string) => void;
  onOtherChange?: (text: string) => void;
  otherLabel?: string;
  allowAny?: boolean;
  anyLabel?: string;
};

export function TaxonomySelect({
  categoryLabel,
  roleLabel,
  categories,
  categoryId,
  role,
  otherText = "",
  onCategoryChange,
  onRoleChange,
  onOtherChange,
  otherLabel = "Please specify",
  allowAny = false,
  anyLabel = "Any",
}: TaxonomySelectProps) {
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const roles = selectedCategory?.roles ?? [];
  const showOther = categoryId === "other" || role === "Other";

  const handleCategory = (id: string) => {
    onCategoryChange(id);
    onRoleChange("");
    if (onOtherChange) onOtherChange("");
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{categoryLabel}</label>
        <Select value={categoryId || (allowAny ? "any" : "")} onValueChange={handleCategory}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${categoryLabel.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {allowAny && <SelectItem value="any">{anyLabel}</SelectItem>}
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {categoryId && categoryId !== "any" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{roleLabel}</label>
          <Select value={role || ""} onValueChange={onRoleChange} disabled={!categoryId}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${roleLabel.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showOther && onOtherChange && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{otherLabel}</label>
          <Input
            value={otherText}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Please specify"
          />
        </div>
      )}
    </div>
  );
}
