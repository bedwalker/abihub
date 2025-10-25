import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Plus, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Events() {
  const events = useQuery(api.events.list);
  const addEvent = useMutation(api.events.add);

  const [open, setOpen] = useState(false);
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

  const categoryColors: Record<string, string> = {
    "Abi-Vorbereitung": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "Mottowoche": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "Party": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "Prüfungen": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "Streich": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !time || !location.trim()) {
      toast.error("Bitte fülle alle Felder aus");
      return;
    }

    try {
      await addEvent({
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        location: location.trim(),
        category,
      });
      toast.success("Event erstellt!");
      setOpen(false);
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
    } catch (error) {
      toast.error("Fehler beim Erstellen des Events");
    }
  };

  const upcomingCount = filteredEvents?.filter(e => new Date(e.date) >= new Date()).length || 0;
  const pastCount = (filteredEvents?.length || 0) - upcomingCount;

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Events</h1>
              <p className="text-muted-foreground">Alle wichtigen Termine im Überblick</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Event erstellen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neues Event erstellen</DialogTitle>
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
                    Erstellen
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter Section */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="w-4 h-4" />
                  <span>Filter:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={filterCategory === "all" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setFilterCategory("all")}
                  >
                    Alle ({events?.length || 0})
                  </Badge>
                  {categories.map((cat) => {
                    const count = events?.filter(e => e.category === cat).length || 0;
                    return (
                      <Badge
                        key={cat}
                        variant="outline"
                        className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                          filterCategory === cat ? categoryColors[cat] : ""
                        }`}
                        onClick={() => setFilterCategory(cat)}
                      >
                        {cat} ({count})
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex gap-6 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">{upcomingCount}</span> bevorstehend
                </div>
                <div>
                  <span className="font-medium text-foreground">{pastCount}</span> vergangen
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const isPast = new Date(event.date) < new Date();
              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`h-full hover:shadow-lg transition-shadow ${isPast ? "opacity-60" : ""}`}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Badge 
                            variant="outline" 
                            className={`mb-3 ${categoryColors[event.category] || ""}`}
                          >
                            {event.category}
                          </Badge>
                          {isPast && (
                            <Badge variant="outline" className="ml-2 mb-3 bg-muted">
                              Vergangen
                            </Badge>
                          )}
                          <h3 className="text-xl font-bold mb-2 tracking-tight">{event.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                        </div>
                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">{new Date(event.date).toLocaleDateString("de-DE", { 
                              weekday: "short", 
                              year: "numeric", 
                              month: "long", 
                              day: "numeric" 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{event.time} Uhr</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Keine Events gefunden</h3>
                <p className="text-muted-foreground mb-6">
                  {filterCategory === "all" 
                    ? "Es wurden noch keine Events erstellt." 
                    : `Keine Events in der Kategorie "${filterCategory}".`}
                </p>
                <Button onClick={() => setOpen(true)} className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Erstes Event erstellen
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}