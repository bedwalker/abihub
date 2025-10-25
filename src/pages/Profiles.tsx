import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function Profiles() {
  const students = useQuery(api.students.list);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Id<"students"> | null>(null);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");

  const comments = useQuery(
    api.comments.listByStudent,
    selectedStudent ? { studentId: selectedStudent } : "skip"
  );
  const addComment = useMutation(api.comments.add);

  const filteredStudents = students?.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStudentData = students?.find((s) => s._id === selectedStudent);

  const handleAddComment = async () => {
    if (!selectedStudent || !commentText.trim() || !authorName.trim()) {
      toast.error("Bitte fülle alle Felder aus");
      return;
    }

    try {
      await addComment({
        studentId: selectedStudent,
        authorName: authorName.trim(),
        text: commentText.trim(),
      });
      toast.success("Kommentar hinzugefügt!");
      setCommentText("");
      setAuthorName("");
    } catch (error) {
      toast.error("Fehler beim Hinzufügen des Kommentars");
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

        {/* Students Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredStudents?.map((student, index) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedStudent(student._id)}
              >
                <CardContent className="p-6 text-center">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <p className="font-medium">{student.name}</p>
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
                  src={selectedStudentData?.image}
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
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Add Comment Form */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h3 className="font-medium">Neuer Kommentar</h3>
                <Input
                  placeholder="Dein Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
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

              {/* Comments List */}
              <div className="space-y-4">
                <h3 className="font-medium">Alle Kommentare</h3>
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <Card key={comment._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{comment.authorName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString("de-DE")}
                          </p>
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
