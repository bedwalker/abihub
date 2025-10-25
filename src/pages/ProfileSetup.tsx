import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfileSetup() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = useMutation(api.users.updateUserProfile);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Bitte gib deinen Namen ein");
      return;
    }

    if (!user) {
      toast.error("Benutzer nicht gefunden");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        userId: user._id,
        name: name.trim(),
      });
      toast.success("Profil erstellt!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Fehler beim Erstellen des Profils");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="AbiConnect" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl">Willkommen bei AbiConnect!</CardTitle>
          <CardDescription>
            Bitte vervollständige dein Profil, um fortzufahren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dein Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Max Mustermann"
                disabled={isSubmitting}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full cursor-pointer" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                "Profil erstellen"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
