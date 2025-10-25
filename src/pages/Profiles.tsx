import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";

// Helper component to display profile image with storage URL resolution
function ProfileImage({ imageId, name }: { imageId?: string; name: string }) {
  const storageUrl = useQuery(
    api.users.getStorageUrl,
    imageId && imageId.trim() !== "" && !imageId.startsWith("http") ? { storageId: imageId } : "skip"
  );

  const displayImage = storageUrl || (imageId?.startsWith("http") ? imageId : null) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

  return (
    <img
      src={displayImage}
      alt={name}
      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
    />
  );
}

export default function Profiles() {
  const students = useQuery(api.students.list);
  const allUsers = useQuery(api.users.listAllUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Id<"students"> | null>(null);
  const [commentText, setCommentText] = useState("");
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { user } = useAuth();

  const comments = useQuery(
    api.comments.listByStudent,
    selectedStudent ? { studentId: selectedStudent } : "skip"
  );
  const addComment = useMutation(api.comments.add);
  const removeComment = useMutation(api.comments.remove);
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const deleteUser = useMutation(api.users.deleteUser);

  // Combine students and authenticated users (excluding anonymous users)
  const authenticatedUsers = allUsers?.filter(u => !u.isAnonymous && u.name) || [];
  
  const allProfiles = [
    ...(students || []).map(s => ({ ...s, type: 'student' as const })),
    ...authenticatedUsers.map(u => ({ 
      _id: u._id, 
      name: u.name!, 
      image: u.image,
      email: u.email,
      phone: u.phone,
      description: u.description,
      type: 'user' as const 
    }))
  ];

  const filteredProfiles = allProfiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStudentData = students?.find((s) => s._id === selectedStudent);

  const handleAddComment = async () => {
    if (!selectedStudent || !commentText.trim()) {
      toast.error("Bitte fülle alle Felder aus");
      return;
    }

    try {
      await addComment({
        studentId: selectedStudent,
        text: commentText.trim(),
      });
      toast.success("Kommentar hinzugefügt!");
      setCommentText("");
    } catch (error) {
      toast.error("Fehler beim Hinzufügen des Kommentars");
    }
  };

  const handleDeleteComment = async (commentId: Id<"comments">) => {
    if (!confirm("Möchtest du diesen Kommentar wirklich löschen?")) return;
    try {
      await removeComment({ id: commentId });
      toast.success("Kommentar gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Kommentars");
    }
  };

  const openEditUserDialog = (userProfile: any) => {
    setEditingUser(userProfile);
    setEditName(userProfile.name || "");
    setEditEmail(userProfile.email || "");
    setEditPhone(userProfile.phone || "");
    setEditDescription(userProfile.description || "");
    setEditUserDialogOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUserProfile({
        userId: editingUser._id,
        name: editName.trim() || undefined,
        email: editEmail.trim() || undefined,
        phone: editPhone.trim() || undefined,
        description: editDescription.trim() || undefined,
      });
      toast.success("Profil aktualisiert!");
      setEditUserDialogOpen(false);
    } catch (error) {
      toast.error("Fehler beim Aktualisieren des Profils");
    }
  };

  const handleDeleteUser = async (userId: Id<"users">) => {
    if (!confirm("Möchtest du dieses Profil wirklich löschen?")) return;
    try {
      await deleteUser({ userId });
      toast.success("Profil gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Profils");
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Profile</h1>
          <p className="text-muted-foreground">Schreibe Kommentare für deine Mitschüler</p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Schüler suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredProfiles?.map((profile, index) => (
            <motion.div
              key={profile._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                onClick={() => profile.type === 'student' && setSelectedStudent(profile._id as Id<"students">)}
              >
                <CardContent className="p-6 text-center">
                  <ProfileImage imageId={profile.image} name={profile.name} />
                  <p className="font-medium">{profile.name}</p>
                  {profile.type === 'user' && (
                    <p className="text-xs text-muted-foreground mt-1">Benutzer</p>
                  )}
                  
                  {/* Admin controls for user profiles */}
                  {user?.role === "admin" && profile.type === 'user' && (
                    <div className="flex gap-2 justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditUserDialog(profile);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(profile._id as Id<"users">);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Student Detail Dialog */}
        <Dialog open={selectedStudent !== null} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <img
                  src={selectedStudentData?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudentData?.name}`}
                  alt={selectedStudentData?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <div className="text-2xl">{selectedStudentData?.name}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {comments?.length || 0} Kommentare
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>
                Schreibe Kommentare und Erinnerungen für diesen Schüler
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Add Comment Form */}
              {user && !user.isAnonymous && user.name && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium">Neuer Kommentar</h3>
                  <p className="text-sm text-muted-foreground">
                    Kommentieren als: <strong>{user.name}</strong>
                  </p>
                  <Textarea
                    placeholder="Schreibe einen Kommentar..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddComment} className="w-full cursor-pointer">
                    Kommentar hinzufügen
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                <h3 className="font-medium">Alle Kommentare</h3>
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <Card key={comment._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{comment.authorName}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleDateString("de-DE")}
                            </p>
                            {user?.role === "admin" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Noch keine Kommentare vorhanden
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Profile Dialog */}
        <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Benutzerprofil bearbeiten</DialogTitle>
              <DialogDescription>
                Bearbeite die Profilinformationen dieses Benutzers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="space-y-2">
                <Label>E-Mail</Label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="email@example.com"
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
                Aktualisieren
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}