import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";

export default function MyProfile() {
  const { user } = useAuth();
  const updateProfile = useMutation(api.users.updateUserProfile);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setDescription(user.description || "");
      setImageUrl(user.image || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name ist erforderlich");
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
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        description: description.trim() || undefined,
        image: imageUrl.trim() || undefined,
      });
      toast.success("Profil aktualisiert!");
    } catch (error) {
      toast.error("Fehler beim Aktualisieren des Profils");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto p-6 md:p-8">
          <p className="text-center text-muted-foreground">Bitte melde dich an, um dein Profil zu bearbeiten.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Mein Profil</h1>
          <p className="text-muted-foreground">Bearbeite deine Profilinformationen</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profilinformationen</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src={imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                      alt={name}
                      className="w-32 h-32 rounded-full border-4 border-primary"
                    />
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
                      <Camera className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <Label>Profilbild URL</Label>
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/bild.jpg"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Füge eine URL zu deinem Profilbild hinzu
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dein Name"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="deine@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 123 456789"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Erzähle etwas über dich..."
                    rows={4}
                    disabled={isSubmitting}
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
                    "Profil speichern"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
