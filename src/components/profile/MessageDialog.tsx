import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  receiverName: string;
}

interface MessageFormData {
  content: string;
}

export const MessageDialog = ({
  open,
  onOpenChange,
  receiverId,
  receiverName,
}: MessageDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageFormData>();

  const handleSendMessage = async (data: MessageFormData) => {
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("You must be logged in to send messages");
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          receiver_id: receiverId,
          sender_id: user.id,
          content: data.content.trim(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      reset(); // Clear the form
      onOpenChange(false); // Close the dialog
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Message to {receiverName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSendMessage)} className="space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="Type your message here..."
              className="h-32"
              {...register("content", {
                required: "Message content is required",
                minLength: {
                  value: 1,
                  message: "Message cannot be empty"
                },
                maxLength: {
                  value: 1000,
                  message: "Message cannot exceed 1000 characters"
                }
              })}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
            )}
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
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
