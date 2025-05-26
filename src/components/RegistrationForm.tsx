import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import StepIndicator from "./StepIndicator";
import AvatarUpload from "./AvatarUpload";
import ProfilePreview from "./ProfilePreview";

// Initialize Supabase client
const supabaseUrl = "https://awrunspkmsvswrvphrdd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cnVuc3BrbXN2c3dydnBocmRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjM1MDUsImV4cCI6MjA2MDI5OTUwNX0.dVSIE_ML-NYaTqn8RVkIXa-DvF6zXgJ9yHqy-XPq4Qc";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define form schema for each step
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  birthday: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

const contactInfoSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

const additionalDetailsSchema = z.object({
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" }),
  referenceNumber: z.string().optional(),
});

// Combine all schemas for the complete form
const formSchema = personalInfoSchema
  .merge(contactInfoSchema)
  .merge(additionalDetailsSchema)
  .extend({
    avatar: z.any().optional(),
  });

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormValues>>({
    firstName: "",
    lastName: "",
    birthday: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    referenceNumber: "",
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(
      currentStep === 1
        ? personalInfoSchema
        : currentStep === 2
          ? contactInfoSchema
          : currentStep === 3
            ? additionalDetailsSchema
            : formSchema,
    ),
    defaultValues: formData,
  });

  const totalSteps = 5; // Total number of steps including preview

  // Handle form submission for each step
  const onSubmit = async (data: Partial<FormValues>) => {
    // Update form data with current step data
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    // If not the final step, move to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission to Supabase
      try {
        setIsSubmitting(true);
        setSubmitError(null);

        // Upload avatar if exists
        let avatarUrl = null;
        if (avatarFile) {
          const fileExt = avatarFile.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("avatars").upload(fileName, avatarFile);

          if (uploadError) {
            throw new Error(`Avatar upload failed: ${uploadError.message}`);
          }

          avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
        }

        // Submit user data to Supabase
        const { error } = await supabase.from("users").insert([
          {
            first_name: updatedFormData.firstName,
            last_name: updatedFormData.lastName,
            email: updatedFormData.email,
            phone: updatedFormData.phone,
            birthday: updatedFormData.birthday,
            city: updatedFormData.city,
            country: updatedFormData.country,
            reference_number: updatedFormData.referenceNumber,
            avatar_url: avatarUrl,
          },
        ]);

        if (error) throw new Error(`Submission failed: ${error.message}`);

        setSubmitSuccess(true);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Go back to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setFormData({ ...formData, avatar: file });
  };

  // Render form based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Personal Information
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthday</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        );

      case 2: // Contact Information
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        );

      case 3: // Additional Details
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        );

      case 4: // Avatar Upload
        return (
          <div className="space-y-6">
            <AvatarUpload
              onAvatarChange={handleAvatarChange}
              currentAvatar={avatarFile}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
              </Button>
            </div>
          </div>
        );

      case 5: // Profile Preview
        return (
          <div className="space-y-6">
            <ProfilePreview
              userData={{
                firstName: formData.firstName || "",
                lastName: formData.lastName || "",
                email: formData.email || "",
                phone: formData.phone || "",
                birthday: formData.birthday || "",
                city: formData.city || "",
                country: formData.country || "",
                referenceNumber: formData.referenceNumber || "",
                avatar: avatarFile,
              }}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
              <Button
                onClick={() => onSubmit(formData)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
            {submitError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {submitError}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Show success message after submission
  if (submitSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            Registration Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-4">Thank you for registering with us.</p>
            <p>Your information has been successfully submitted.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => {
              setCurrentStep(1);
              setFormData({
                firstName: "",
                lastName: "",
                birthday: "",
                email: "",
                phone: "",
                city: "",
                country: "",
                referenceNumber: "",
                avatar: null,
              });
              setAvatarFile(null);
              setSubmitSuccess(false);
            }}
          >
            Register Another User
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-center">User Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {renderStepContent()}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
