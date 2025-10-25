import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Megaphone, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Announcements() {
  const announcements = useQuery(api.announcements.list);
  const addAnnouncement = useMutation(api.announcements.add);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim() || !author.trim()) {
      toast.error("Bitte fülle alle Felder aus");
      return;
    }

    try {
      await addAnnouncement({
        title: title.trim(),
        text: text.trim(),
        author: author.trim(),
      });
      toast.success("Ankündigung erstellt!");
      setOpen(false);
      setTitle("");
      setText("");
      setAuthor("");
    } catch (error) {
      toast.error("Fehler beim Erstellen der Ankündigung");
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Ankündigungen</h1>
            <p className="text-muted-foreground">Neuigkeiten und wichtige Infos</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Neue Ankündigung
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Ankündigung erstellen</DialogTitle>
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
                <div className="space-y-2">
                  <Label>Dein Name</Label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="z.B. Anna Schmidt"
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  Veröffentlichen
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
