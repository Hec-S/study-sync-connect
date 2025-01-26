import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { MarketplaceProject } from "./MarketplacePage";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MarketplaceProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<MarketplaceProject, "id" | "created_at" | "updated_at" | "owner_id" | "status" | "assigned_to">) => void;
  initialData?: MarketplaceProject;
}

export const MarketplaceProjectDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: MarketplaceProjectDialogProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "development",
      budget_range: initialData?.budget_range || "$100-$500",
      required_skills: initialData?.required_skills || [""],
      deadline: initialData?.deadline?.split('T')[0] || "",
    },
  });

  const required_skills = watch("required_skills");

  const addSkill = () => {
    setValue("required_skills", [...required_skills, ""]);
  };

  const removeSkill = (indexToRemove: number) => {
    setValue(
      "required_skills",
      required_skills.filter((_, index) => index !== indexToRemove)
    );
  };

  const categories = [
    "development",
    "design",
    "writing",
    "research",
    "data",
    "other",
  ];

  const budgetRanges = [
    "$100-$500",
    "$500-$1000",
    "$1000-$2500",
    "$2500-$5000",
    "$5000+",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project" : "Post a New Project"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to your project posting here."
              : "Fill in the details about your project to find the right person."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Enter a clear title"
                {...register("title", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project requirements and goals"
                className="h-32"
                {...register("description", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={initialData?.category || "development"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_range">Budget Range</Label>
              <Select
                onValueChange={(value) => setValue("budget_range", value)}
                defaultValue={initialData?.budget_range || "$100-$500"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Project Deadline</Label>
              <Input
                id="deadline"
                type="date"
                {...register("deadline", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Required Skills</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
              <div className="space-y-2">
                {required_skills.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter a required skill"
                      {...register(`required_skills.${index}` as const, { required: true })}
                      className={cn(index !== 0 && "mt-2")}
                    />
                    {index !== 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSkill(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Post Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
