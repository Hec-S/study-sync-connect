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
import { CategorySelect } from "@/components/CategorySelect";

interface MarketplaceProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<MarketplaceProject, "id" | "created_at" | "updated_at" | "owner_id" | "status">) => void;
  initialData?: MarketplaceProject;
  isSubmitting?: boolean;
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  customCategory?: string;
  budget_range: string;
  required_skills: string[];
  deadline: string;
  school_name: string;
}

export const MarketplaceProjectDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: MarketplaceProjectDialogProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<ProjectFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      customCategory: initialData?.customCategory || "",
      budget_range: initialData?.budget_range || "",
      required_skills: initialData?.required_skills || [""],
      deadline: initialData?.deadline?.split('T')[0] || "",
      school_name: initialData?.school_name || "",
    },
  });

  const required_skills = watch("required_skills");
  const selectedCategory = watch("category");

  const addSkill = () => {
    setValue("required_skills", [...required_skills, ""]);
  };

  const removeSkill = (indexToRemove: number) => {
    setValue(
      "required_skills",
      required_skills.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleCategoryChange = async (value: string) => {
    setValue("category", value);
    await trigger("category"); // Trigger validation
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    // Validate category is selected
    if (!data.category) {
      return;
    }

    const formattedData = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      budget_range: data.budget_range.startsWith('$') ? data.budget_range : `$${data.budget_range}`,
      required_skills: data.required_skills
        .filter(skill => skill.trim() !== "")
        .map(skill => skill.trim()),
      deadline: new Date(data.deadline).toISOString(),
      school_name: data.school_name || "Unknown School"
    };

    try {
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Enter a clear title"
                {...register("title", { 
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters"
                  }
                })}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project requirements and goals"
                className="h-32"
                {...register("description", { 
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters"
                  }
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <CategorySelect
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                {...register("category", {
                  required: "Please select a category"
                })}
                error={errors.category?.message}
              />
              {selectedCategory === "other" && (
                <div className="mt-2">
                  <Input
                    placeholder="Specify your category"
                    {...register("customCategory", {
                      required: selectedCategory === "other" ? "Please specify the category" : false
                    })}
                  />
                  {errors.customCategory && (
                    <p className="text-sm text-red-500 mt-1">{errors.customCategory.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_range">Budget Range</Label>
              <div>
                <Input
                  type="text"
                  placeholder="Enter budget range (e.g. $50-$100)"
                  {...register("budget_range", {
                    required: "Budget range is required",
                    pattern: {
                      value: /^\$?\d+(-\$?\d+)?$/,
                      message: "Please enter a valid budget range (e.g. $50-$100 or $50)"
                    }
                  })}
                />
                {errors.budget_range && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.budget_range.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Project Deadline</Label>
              <Input
                id="deadline"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register("deadline", { 
                  required: "Deadline is required",
                  validate: (value) => {
                    const date = new Date(value);
                    const today = new Date();
                    return date >= today || "Deadline must be in the future";
                  }
                })}
              />
              {errors.deadline && (
                <p className="text-sm text-red-500 mt-1">{errors.deadline.message}</p>
              )}
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
                      {...register(`required_skills.${index}` as const, { 
                        required: "Required skill cannot be empty",
                        minLength: {
                          value: 2,
                          message: "Skill must be at least 2 characters"
                        }
                      })}
                      className={cn(index !== 0 && "mt-2")}
                    />
                    {errors.required_skills?.[index] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.required_skills[index]?.message}
                      </p>
                    )}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {initialData ? "Saving..." : "Posting..."}
                </>
              ) : (
                initialData ? "Save Changes" : "Post Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
