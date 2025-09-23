import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { toast } from "sonner";
import { userApi } from "@/modules/users/services/userApi";
import { usersApi } from "@/modules/users/services/usersApi";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";

// Validation schema matching backend
const profileSchema = z.object({
  firstName: z
    .string()
    .max(50, "First name cannot exceed 50 characters")
    .optional(),
  lastName: z
    .string()
    .max(50, "Last name cannot exceed 50 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updatedUser = await userApi.updateUserProfile(data);
      updateUser(updatedUser);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please upload a valid image file (JPEG, PNG, GIF, or WebP)."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("Please upload an image smaller than 5MB.");
      return;
    }

    try {
      const updatedUser = await usersApi.uploadAvatar(file);
      updateUser(updatedUser);

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar. Please try again.");
    }
  };
  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <EnhancedHeader
        title="Profile Settings"
        contextActions={
          <>
            <Button size="sm" variant="outline" className="h-8 gap-2" asChild>
              <Link to="/app/settings">
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </Link>
            </Button>
            <Button
              size="sm"
              className="h-8 gap-2"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </>
        }
      />

      <Main className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and profile picture
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center sm:text-left">
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="text-base sm:text-lg">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                    asChild
                  >
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF, WebP up to 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
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
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your unique username for identification
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="flex-1"
                      />
                      <Badge
                        variant={
                          user?.isEmailVerified ? "secondary" : "outline"
                        }
                        className="w-fit"
                      >
                        {user?.isEmailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
};

export default ProfileSettingsPage;
