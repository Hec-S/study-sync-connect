import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { PortfolioItem } from "./PortfolioPage";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PortfolioItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<PortfolioItem, "id" | "created_at" | "updated_at" | "owner_id">) => void;
  initialData?: PortfolioItem;
}

export const PortfolioItemDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: PortfolioItemDialogProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "development",
      completion_date: initialData?.completion_date?.split('T')[0] || "",
      skills: initialData?.skills || [""],
      image_url: initialData?.image_url || "",
      project_url: initialData?.project_url || "",
    },
  });

  const skills = watch("skills");

  const addSkill = () => {
    setValue("skills", [...skills, ""]);
  };

  const removeSkill = (indexToRemove: number) => {
    setValue(
      "skills",
      skills.filter((_, index) => index !== indexToRemove)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Portfolio Item" : "Add Portfolio Item"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to your portfolio item here."
              : "Add a new project to showcase in your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Enter project title"
                {...register("title", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project and its impact"
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
              <Label htmlFor="completion_date">Completion Date</Label>
              <Input
                id="completion_date"
                type="date"
                {...register("completion_date", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Project Image URL (optional)</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register("image_url")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_url">Project URL (optional)</Label>
              <Input
                id="project_url"
                type="url"
                placeholder="https://example.com/project"
                {...register("project_url")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Skills Used</Label>
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
                {skills.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter a skill"
                      {...register(`skills.${index}` as const, { required: true })}
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
              {initialData ? "Save Changes" : "Add to Portfolio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};