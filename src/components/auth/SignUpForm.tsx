import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { DateOfBirthPicker } from "./DateOfBirthPicker";
import { PasswordInput } from "./PasswordInput";

export const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    schoolName: "",
    dateOfBirth: undefined as Date | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasLetter && hasNumber && hasSymbol;
  };

  const validateAge = (dob: Date | undefined) => {
    if (!dob) return false;
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      return age - 1 >= 13;
    }
    return age >= 13;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 8 characters and include letters, numbers, and symbols.");
      return;
    }

    if (!formData.dateOfBirth) {
      toast.error("Please select your date of birth.");
      return;
    }

    if (!validateAge(formData.dateOfBirth)) {
      toast.error("You must be at least 13 years old to create an account.");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          school_name: formData.schoolName,
          date_of_birth: format(formData.dateOfBirth, 'yyyy-MM-dd'),
        }
      );
      onClose();
    } catch (error) {
      // Error is already handled in signUp
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.name@university.edu"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        required
      />

      <DateOfBirthPicker
        value={formData.dateOfBirth}
        onChange={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date }))}
      />

      <div className="space-y-2">
        <Label htmlFor="schoolName">School Name</Label>
        <Input
          id="schoolName"
          name="schoolName"
          placeholder="University Name"
          value={formData.schoolName}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};