import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="border-0 shadow-lg max-w-md w-full">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Departamento Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The departamento you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link href="/">Back to Map</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


