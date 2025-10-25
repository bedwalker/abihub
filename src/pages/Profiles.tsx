import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";

export default function Profiles() {
  const students = useQuery(api.students.list);
  const allUsers = useQuery(api.users.listAllUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Id<"students"> | null>(null);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();

  const comments = useQuery(
    api.comments.listByStudent,
    selectedStudent ? { studentId: selectedStudent } : "skip"
  );
  const addComment = useMutation(api.comments.add);
  const removeComment = useMutation(api.comments.remove);

  // Combine students and authenticated users (excluding anonymous users)
  const authenticatedUsers = allUsers?.filter(u => !u.isAnonymous && u.name) || [];
  
  const allProfiles = [
    ...(students || []).map(s => ({ ...s, type: 'student' as const })),
    ...authenticatedUsers.map(u => ({ 
      _id: u._id, 
      name: u.name!, 
      image: u.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
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
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => profile.type === 'student' && setSelectedStudent(profile._id as Id<"students">)}
              >
                <CardContent className="p-6 text-center">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <p className="font-medium">{profile.name}</p>
                  {profile.type === 'user' && (
                    <p className="text-xs text-muted-foreground mt-1">Benutzer</p>
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
              {user && !user.isAnonymous && (
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
      </div>
    </Layout>
  );
}