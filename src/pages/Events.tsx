import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Id } from "@/convex/_generated/dataModel";

export default function Events() {
  const events = useQuery(api.events.list);
  const addEvent = useMutation(api.events.add);
  const updateEvent = useMutation(api.events.update);
  const removeEvent = useMutation(api.events.remove);
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"events"> | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Abi-Vorbereitung");
  const [filterCategory, setFilterCategory] = useState("all");

  const sortedEvents = events?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const filteredEvents = filterCategory === "all" 
    ? sortedEvents 
    : sortedEvents?.filter((e) => e.category === filterCategory);

  const categories = ["Abi-Vorbereitung", "Mottowoche", "Party", "Prüfungen", "Streich"];

  const openDialog = (event?: any) => {
    if (event) {
      setEditingId(event._id);
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date);
      setTime(event.time);
      setLocation(event.location);
      setCategory(event.category);
    } else {
      setEditingId(null);
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setCategory("Abi-Vorbereitung");
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !time || !location.trim()) {
      toast.error("Bitte fülle alle Felder aus");
      return;
    }

    try {
      if (editingId) {
        await updateEvent({
          id: editingId,
          title: title.trim(),
          description: description.trim(),
          date,
          time,
          location: location.trim(),
          category,
        });
        toast.success("Event aktualisiert!");
      } else {
        await addEvent({
          title: title.trim(),
          description: description.trim(),
          date,
          time,
          location: location.trim(),
          category,
        });
        toast.success("Event erstellt!");
      }
      setOpen(false);
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setEditingId(null);
    } catch (error) {
      toast.error("Fehler beim Speichern des Events");
    }
  };

  const handleDelete = async (id: Id<"events">) => {
    if (!confirm("Möchtest du dieses Event wirklich löschen?")) return;
    try {
      await removeEvent({ id });
      toast.success("Event gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen");
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Events</h1>
            <p className="text-muted-foreground">Alle wichtigen Termine im Überblick</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {user?.role === "admin" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer" onClick={() => openDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Event bearbeiten" : "Neues Event erstellen"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titel</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="z.B. Mottowoche Start"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Beschreibung</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Beschreibe das Event..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Datum</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Uhrzeit</Label>
                        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ort</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="z.B. Schule"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kategorie</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full cursor-pointer">
                      {editingId ? "Aktualisieren" : "Erstellen"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents?.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                        {event.category}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(event.date).toLocaleDateString("de-DE")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{event.time} Uhr</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {user?.role === "admin" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(event)}
                          className="flex-1 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Bearbeiten
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(event._id)}
                          className="flex-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Löschen
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