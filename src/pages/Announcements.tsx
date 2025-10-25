import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Megaphone, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Id } from "@/convex/_generated/dataModel";

export default function Announcements() {
  const announcements = useQuery(api.announcements.list);
  const addAnnouncement = useMutation(api.announcements.add);
  const updateAnnouncement = useMutation(api.announcements.update);
  const removeAnnouncement = useMutation(api.announcements.remove);
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"announcements"> | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const openDialog = (announcement?: any) => {
    if (announcement) {
      setEditingId(announcement._id);
      setTitle(announcement.title);
      setText(announcement.text);
      setAuthor(announcement.author);
    } else {
      setEditingId(null);
      setTitle("");
      setText("");
      setAuthor("");
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim() || !author.trim()) {
      toast.error("Bitte fülle alle Felder aus");
      return;
    }

    try {
      if (editingId) {
        await updateAnnouncement({
          id: editingId,
          title: title.trim(),
          text: text.trim(),
        });
        toast.success("Ankündigung aktualisiert!");
      } else {
        await addAnnouncement({
          title: title.trim(),
          text: text.trim(),
          author: author.trim(),
        });
        toast.success("Ankündigung erstellt!");
      }
      setOpen(false);
      setTitle("");
      setText("");
      setAuthor("");
      setEditingId(null);
    } catch (error) {
      toast.error("Fehler beim Speichern der Ankündigung");
    }
  };

  const handleDelete = async (id: Id<"announcements">) => {
    if (!confirm("Möchtest du diese Ankündigung wirklich löschen?")) return;
    try {
      await removeAnnouncement({ id });
      toast.success("Ankündigung gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen");
    }
  };

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Ankündigungen</h1>
            <p className="text-muted-foreground">Neuigkeiten und wichtige Infos</p>
          </div>
          {user?.role === "admin" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <Button className="cursor-pointer" onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Neue Ankündigung
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Ankündigung bearbeiten" : "Neue Ankündigung erstellen"}
                  </DialogTitle>
                  <DialogDescription>
                    Erstelle oder bearbeite eine Ankündigung für alle Schüler
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="z.B. Abiball-Location bestätigt!"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Text</Label>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Beschreibe die Ankündigung..."
                      rows={4}
                    />
                  </div>
                  {!editingId && (
                    <div className="space-y-2">
                      <Label>Dein Name</Label>
                      <Input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="z.B. Anna Schmidt"
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full cursor-pointer">
                    {editingId ? "Aktualisieren" : "Veröffentlichen"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Announcements Feed */}
        <div className="space-y-6">
          {announcements?.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Megaphone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                      <p className="text-muted-foreground mb-4">{announcement.text}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{announcement.author}</span>
                        <span>•</span>
                        <span>{new Date(announcement.timestamp).toLocaleDateString("de-DE")}</span>
                        <span>•</span>
                        <span>{new Date(announcement.timestamp).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                    {user?.role === "admin" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDialog(announcement)}
                          className="cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(announcement._id)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}