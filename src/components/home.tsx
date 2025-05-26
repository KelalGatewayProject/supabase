import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegistrationForm from "./RegistrationForm";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
          <CardTitle className="text-center text-2xl font-bold">
            User Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}
