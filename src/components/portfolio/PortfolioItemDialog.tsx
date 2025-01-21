import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { PortfolioItem } from "./PortfolioPage";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const files = watch("files");

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      // Convert FileList to array and get URLs
      const fileUrls = Array.from(newFiles).map(file => URL.createObjectURL(file));
      setValue("files", [...files, ...fileUrls]);
    }
  }, [files, setValue]);

  const removeFile = useCallback((indexToRemove: number) => {
    setValue(
      "files",
      files.filter((_, index) => index !== indexToRemove)
    );
  }, [files, setValue]);

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
          <DialogDescription>
            Fill in the details about your project. Add images to showcase your work.
          </DialogDescription>
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
              <Label>Project Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={file}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-24 rounded-lg",
                    "border-2 border-dashed border-gray-300 hover:border-primary",
                    "cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Upload images</p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
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