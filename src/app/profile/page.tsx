"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Edit2,
  Save,
  X,
  Filter,
  Search,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

const profileFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    avatar: z.instanceof(File).optional(),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "Password must be at least 8 characters",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If old password is provided, new password must be provided
      if (data.oldPassword && !data.newPassword) {
        return false;
      }
      // If new password is provided, confirm password must match
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock data for bookings (in a real app, this would come from API)
const mockBookings = [
  {
    id: "1",
    venue: "Elite Sports Complex",
    sport: "Badminton",
    court: "Court A",
    date: new Date("2024-01-20"),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    status: "CONFIRMED" as const,
    price: 50,
  },
  {
    id: "2",
    venue: "City Tennis Club",
    sport: "Tennis",
    court: "Court 2",
    date: new Date("2024-01-22"),
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    status: "CONFIRMED" as const,
    price: 75,
  },
  {
    id: "3",
    venue: "Basketball Arena",
    sport: "Basketball",
    court: "Court B",
    date: new Date("2024-01-15"),
    startTime: "06:00 PM",
    endTime: "07:00 PM",
    status: "COMPLETED" as const,
    price: 40,
  },
  {
    id: "4",
    venue: "Swimming Complex",
    sport: "Swimming",
    court: "Pool 1",
    date: new Date("2024-01-10"),
    startTime: "08:00 AM",
    endTime: "09:00 AM",
    status: "CANCELLED" as const,
    price: 30,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      phoneNumber: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch current phone number from the database
  const fetchPhoneNumber = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(`/api/profile?userId=${session.user.id}`);
        if (response.ok) {
          const data = (await response.json()) as { phoneNumber?: string };
          setCurrentPhoneNumber(data.phoneNumber ?? "");
          form.setValue("phoneNumber", data.phoneNumber ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch phone number:", error);
      }
    }
  }, [session?.user?.id, form]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      void fetchPhoneNumber();
    }
  }, [session, fetchPhoneNumber]);

  useEffect(() => {
    if (session) {
      form.reset({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        phoneNumber: currentPhoneNumber,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [session, form, currentPhoneNumber]);

  // Filter bookings based on filters
  useEffect(() => {
    let filtered = bookings;

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (booking) => booking.date.toDateString() === dateFilter.toDateString(),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.court.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, dateFilter, searchQuery]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      console.log("Form data being submitted:", data);

      // Determine if we need to send form data (for file uploads) or JSON
      const hasAvatar = data.avatar && data.avatar instanceof File;

      let response;

      if (hasAvatar) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Add avatar file (we know it exists because hasAvatar is true)
        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        // Add other form fields
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
        if (data.oldPassword) formData.append("oldPassword", data.oldPassword);
        if (data.newPassword) formData.append("newPassword", data.newPassword);

        console.log("Sending form data with avatar");

        response = await fetch("/api/profile", {
          method: "PATCH",
          body: formData, // No Content-Type header - browser will set it automatically for FormData
        });
      } else {
        // Use JSON for regular updates
        const updateData = {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        };

        // Remove empty fields
        Object.keys(updateData).forEach((key) => {
          if (!updateData[key as keyof typeof updateData]) {
            delete updateData[key as keyof typeof updateData];
          }
        });

        console.log("Sending JSON data:", updateData);

        response = await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
      }

      console.log("API response status:", response.status);

      if (!response.ok) {
        const error = (await response.json()) as { error: string };
        console.error("Profile update failed:", error);
        alert(`Error: ${error.error || "Failed to update profile"}`);
        return;
      }

      const result = (await response.json()) as {
        success: boolean;
        user: Record<string, unknown>;
      };
      console.log("Profile updated successfully:", result);

      alert("Profile updated successfully!");

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      alert("An error occurred while updating your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar upload handler
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        form.setValue("avatar", file);
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "CANCELLED" as const }
          : booking,
      ),
    );
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-foreground text-4xl font-bold tracking-tight">
            Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and view your bookings
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full space-y-6">
          <TabsList className="grid h-11 w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile" className="text-sm font-medium">
              Profile Details
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm font-medium">
              My Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Information Card */}
              <Card className="border-border/50 shadow-sm lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-foreground text-xl font-semibold">
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="h-9 px-3 text-sm"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarPreview(null);
                        form.reset({
                          name: session.user.name ?? "",
                          email: session.user.email ?? "",
                          phoneNumber: currentPhoneNumber,
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="h-9 px-3 text-sm"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  {!isEditing ? (
                    <div className="space-y-8">
                      <div className="flex items-start gap-6">
                        <Avatar className="ring-border/20 h-24 w-24 ring-2">
                          <AvatarImage
                            src={session.user.image ?? ""}
                            alt={session.user.name ?? "User"}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                            {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div className="space-y-1">
                            <h2 className="text-foreground text-2xl font-semibold">
                              {session.user.name ?? "User"}
                            </h2>
                            <p className="text-muted-foreground text-lg">
                              {session.user.email}
                            </p>
                          </div>
                          {session.user.emailVerified && (
                            <Badge
                              variant="secondary"
                              className="w-fit text-xs font-medium"
                            >
                              ✓ Email Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-foreground text-sm font-medium">
                            Phone Number
                          </label>
                          <p className="text-muted-foreground text-sm">
                            {currentPhoneNumber || "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-foreground text-sm font-medium">
                            Member Since
                          </label>
                          <p className="text-muted-foreground text-sm">
                            {new Date(
                              session.user.createdAt,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        {/* Avatar Upload Section */}
                        <div className="space-y-4">
                          <h3 className="text-foreground text-lg font-semibold">
                            Profile Photo
                          </h3>
                          <div className="flex items-start gap-6">
                            <div className="relative">
                              <Avatar className="ring-border/20 h-24 w-24 ring-2">
                                <AvatarImage
                                  src={
                                    avatarPreview ?? session.user.image ?? ""
                                  }
                                  alt={session.user.name ?? "User"}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                                  {session.user.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 space-y-4">
                              <div
                                {...getRootProps()}
                                className={cn(
                                  "border-border/50 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
                                  isDragActive && "border-primary bg-primary/5",
                                )}
                              >
                                <input {...getInputProps()} />
                                <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                                {isDragActive ? (
                                  <p className="text-muted-foreground text-sm">
                                    Drop the image here...
                                  </p>
                                ) : (
                                  <div className="space-y-1">
                                    <p className="text-foreground text-sm font-medium">
                                      Click to upload or drag and drop
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      PNG, JPG, GIF, WebP up to 5MB
                                    </p>
                                  </div>
                                )}
                              </div>
                              {avatarPreview && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setAvatarPreview(null);
                                    form.setValue("avatar", undefined);
                                  }}
                                  className="h-9 px-3 text-sm"
                                >
                                  Remove Photo
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="space-y-4">
                          <h3 className="text-foreground text-lg font-semibold">
                            Personal Information
                          </h3>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="text-foreground text-sm font-medium">
                                    Full Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your name"
                                      className="h-10"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="text-foreground text-sm font-medium">
                                    Email Address
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your email"
                                      type="email"
                                      className="h-10"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-foreground text-sm font-medium">
                                  Phone Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter your phone number"
                                    type="tel"
                                    className="h-10"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-muted-foreground text-xs">
                                  Optional: We&apos;ll use this for booking
                                  confirmations
                                </FormDescription>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Password Change Section */}
                        <div className="space-y-4">
                          <h3 className="text-foreground text-lg font-semibold">
                            Change Password
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Leave blank to keep your current password
                          </p>

                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name="oldPassword"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="text-foreground text-sm font-medium">
                                    Current Password
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Enter current password"
                                        type={
                                          showOldPassword ? "text" : "password"
                                        }
                                        className="h-10 pr-10"
                                        {...field}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                          setShowOldPassword(!showOldPassword)
                                        }
                                      >
                                        {showOldPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-6 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormLabel className="text-foreground text-sm font-medium">
                                      New Password
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          placeholder="Enter new password"
                                          type={
                                            showNewPassword
                                              ? "text"
                                              : "password"
                                          }
                                          className="h-10 pr-10"
                                          {...field}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                          onClick={() =>
                                            setShowNewPassword(!showNewPassword)
                                          }
                                        >
                                          {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                          ) : (
                                            <Eye className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormLabel className="text-foreground text-sm font-medium">
                                      Confirm New Password
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          placeholder="Confirm new password"
                                          type={
                                            showConfirmPassword
                                              ? "text"
                                              : "password"
                                          }
                                          className="h-10 pr-10"
                                          {...field}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                          onClick={() =>
                                            setShowConfirmPassword(
                                              !showConfirmPassword,
                                            )
                                          }
                                        >
                                          {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                          ) : (
                                            <Eye className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="h-10 px-8 font-medium"
                          disabled={isSaving}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>

              {/* Account Stats Card */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-foreground text-xl font-semibold">
                    Account Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  <div className="space-y-1 text-center">
                    <div className="text-primary text-3xl font-bold">
                      {
                        filteredBookings.filter((b) => b.status === "COMPLETED")
                          .length
                      }
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Completed Bookings
                    </p>
                  </div>

                  <div className="space-y-1 text-center">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {
                        filteredBookings.filter((b) => b.status === "CONFIRMED")
                          .length
                      }
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Active Bookings
                    </p>
                  </div>

                  <div className="space-y-1 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      $
                      {filteredBookings
                        .filter((b) => b.status === "COMPLETED")
                        .reduce((sum, b) => sum + b.price, 0)}
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Total Spent
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-0 space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <CardTitle className="text-foreground text-xl font-semibold">
                      My Bookings
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Manage your court reservations
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit text-xs font-medium"
                  >
                    {filteredBookings.length} booking
                    {filteredBookings.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Filters */}
                <div className="mb-8 space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        placeholder="Search venues, sports, or courts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background border-border/50 h-10 pl-10"
                      />
                    </div>

                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="bg-background border-border/50 h-10 w-full sm:w-[180px]">
                        <Filter className="text-muted-foreground mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "bg-background border-border/50 h-10 w-full justify-start text-left font-normal sm:w-[240px]",
                            !dateFilter && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFilter
                            ? format(dateFilter, "PPP")
                            : "Filter by date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFilter}
                          onSelect={setDateFilter}
                          initialFocus
                        />
                        <div className="border-t p-3">
                          <Button
                            variant="outline"
                            className="h-9 w-full"
                            onClick={() => setDateFilter(undefined)}
                          >
                            Clear Filter
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="text-muted-foreground text-lg font-medium">
                        No bookings found
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {statusFilter !== "all" || dateFilter || searchQuery
                          ? "Try adjusting your filters"
                          : "Your booking history will appear here"}
                      </p>
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                      <Card
                        key={booking.id}
                        className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3">
                                <h3 className="text-foreground text-lg font-semibold">
                                  {booking.venue}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs font-medium",
                                    getStatusColor(booking.status),
                                  )}
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground font-medium">
                                    Sport:
                                  </span>
                                  <span className="text-muted-foreground">
                                    {booking.sport}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground font-medium">
                                    Court:
                                  </span>
                                  <span className="text-muted-foreground">
                                    {booking.court}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground font-medium">
                                    Price:
                                  </span>
                                  <span className="text-muted-foreground font-semibold">
                                    ${booking.price}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
                                <span className="text-foreground font-medium">
                                  {format(booking.date, "EEEE, MMMM d, yyyy")}
                                </span>
                                <span className="text-muted-foreground">
                                  {booking.startTime} - {booking.endTime}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 sm:flex-col lg:flex-row">
                              {booking.status === "CONFIRMED" &&
                                booking.date > new Date() && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    className="h-9 px-4 text-sm font-medium"
                                  >
                                    Cancel
                                  </Button>
                                )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-4 text-sm font-medium"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
