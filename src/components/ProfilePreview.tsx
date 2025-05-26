import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ProfilePreviewProps {
  userData: {
    name?: string;
    email?: string;
    phone?: string;
    birthday?: string;
    city?: string;
    country?: string;
    referenceNumber?: string;
    avatarUrl?: string;
  };
}

const ProfilePreview = ({ userData = {} }: ProfilePreviewProps) => {
  const {
    name = "John Doe",
    email = "john.doe@example.com",
    phone = "+1 (555) 123-4567",
    birthday = "1990-01-01",
    city = "New York",
    country = "United States",
    referenceNumber = "REF12345",
    avatarUrl = "",
  } = userData;

  // Format birthday for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Profile Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-lg">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{name}</h2>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500">Email:</div>
            <div className="text-sm">{email}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500">Phone:</div>
            <div className="text-sm">{phone}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500">Birthday:</div>
            <div className="text-sm">{formatDate(birthday)}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500">Location:</div>
            <div className="text-sm">
              {city}, {country}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500">
              Reference Number:
            </div>
            <div className="text-sm">{referenceNumber}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePreview;
