import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Search, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Id } from "@/convex/_generated/dataModel";

export default function Contacts() {
  const students = useQuery(api.students.list);
  const allUsers = useQuery(api.users.listAllUsers);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<Id<"users"> | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const filteredStudents = students?.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStudents = filteredStudents?.sort((a, b) => a.name.localeCompare(b.name));

  const openEditDialog = (userId: Id<"users">) => {
    const userToEdit = allUsers?.find(u => u._id === userId);
    if (userToEdit) {
      setEditingUserId(userId);
      setEditName(userToEdit.name || "");
      setEditEmail(userToEdit.email || "");
      setEditPhone(userToEdit.phone || "");
      setEditDescription(userToEdit.description || "");
      setEditDialogOpen(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    try {
      await updateUserProfile({
        userId: editingUserId,
        name: editName.trim() || undefined,
        email: editEmail.trim() || undefined,
        phone: editPhone.trim() || undefined,
        description: editDescription.trim() || undefined,
      });
      toast.success("Profil aktualisiert!");
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Fehler beim Aktualisieren des Profils");
    }
  };

  // Find current user's profile in the users list
  const currentUserProfile = allUsers?.find(u => u._id === user?._id);

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Kontakte</h1>
          <p className="text-muted-foreground">Alle Schüler im Überblick</p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Kontakt suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Current User Profile Card */}
        {currentUserProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Mein Profil</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(currentUserProfile._id)}
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Bearbeiten
                  </Button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={currentUserProfile.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserProfile.name}`}
                    alt={currentUserProfile.name || "User"}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{currentUserProfile.name || "Unbenannt"}</h3>
                    <p className="text-sm text-muted-foreground">{currentUserProfile.role || "user"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {currentUserProfile.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{currentUserProfile.email}</span>
                    </div>
                  )}
                  {currentUserProfile.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{currentUserProfile.phone}</span>
                    </div>
                  )}
                  {currentUserProfile.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {currentUserProfile.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStudents?.map((student, index) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{student.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {student.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${student.phone}`} className="hover:text-primary cursor-pointer">
                          {student.phone}
                        </a>
                      </div>
                    )}
                    {student.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${student.email}`} className="hover:text-primary cursor-pointer">
                          {student.email}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profil bearbeiten</DialogTitle>
              <DialogDescription>
                Bearbeite deine Profilinformationen
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Dein Name"
                />
              </div>
              <div className="space-y-2">
                <Label>E-Mail</Label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="deine@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
              <div className="space-y-2">
                <Label>Beschreibung</Label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Über mich..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Speichern
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}