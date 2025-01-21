import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { PortfolioItem } from "./PortfolioPage";
import { Plus, X } from "lucide-react";

interface PortfolioItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<PortfolioItem, "id">) => void;
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
      date: initialData?.date || new Date().toISOString().slice(0, 7),
      links: initialData?.links || [""],
      isPublic: initialData?.isPublic ?? true,
      files: initialData?.files || [],
    },
  });

  const links = watch("links");

  const onSubmitForm = (data: any) => {
    onSubmit({
      ...data,
      links: data.links.filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Portfolio Item" : "Add Portfolio Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title", { required: true })}
                placeholder="Project or work title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: true })}
                placeholder="Brief summary of your work"
                className="h-32"
              />
            </div>

            <div>
              <Label htmlFor="date">Completion Date</Label>
              <Input
                id="date"
                type="month"
                {...register("date", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Links</Label>
              {links.map((link: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    {...register(`links.${index}`)}
                    placeholder="https://..."
                  />
                  {index === links.length - 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setValue("links", [...links, ""])}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setValue(
                          "links",
                          links.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
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
              {initialData ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};