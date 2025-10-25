import { Layout } from "@/components/Layout";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function Gallery() {
  const photos = useQuery(api.photos.list);
  const [filterEvent, setFilterEvent] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isUploading, setIsUploading] = useState(false);

  const { user } = useAuth();
  const addPhoto = useMutation(api.photos.add);
  const removePhoto = useMutation(api.photos.remove);
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);

  const events = Array.from(new Set(photos?.map((p) => p.eventName) || []));
  const filteredPhotos = filterEvent === "all" 
    ? photos 
    : photos?.filter((p) => p.eventName === filterEvent);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !selectedFile) {
      toast.error("Bitte Event und Foto auswählen");
      return;
    }

    setIsUploading(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      
      const { storageId } = await result.json();

      // Save photo metadata
      await addPhoto({
        storageId,
        title: title.trim() || "Unbenannt",
        eventName: eventName.trim(),
        date,
      });
      
      toast.success("Foto hochgeladen!");
      setUploadOpen(false);
      setEventName("");
      setTitle("");
      setSelectedFile(null);
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      toast.error("Fehler beim Hochladen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm("Möchtest du dieses Foto wirklich löschen?")) return;
    try {
      await removePhoto({ id: photoId as any });
      toast.success("Foto gelöscht!");
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
            <h1 className="text-4xl font-bold tracking-tight mb-2">Galerie</h1>
            <p className="text-muted-foreground">Erinnerungen an unsere gemeinsame Zeit</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={filterEvent} onValueChange={setFilterEvent}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event} value={event}>
                    {event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Foto hochladen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neues Foto hochladen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event</Label>
                    <Input
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="z.B. Abiball 2025"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Titel (optional)</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="z.B. Gruppenfoto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Foto hochladen</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      {selectedFile && (
                        <span className="text-sm text-muted-foreground">
                          {selectedFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Datum</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer" disabled={isUploading}>
                    {isUploading ? "Wird hochgeladen..." : "Hochladen"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos?.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="cursor-pointer relative aspect-square overflow-hidden rounded-lg border"
              onClick={() => setSelectedPhoto(photo.url)}
            >
              <img
                src={photo.url || ""}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium text-sm">{photo.title}</p>
                <p className="text-white/80 text-xs">{photo.eventName} • {photo.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Photo Detail Dialog */}
        {selectedPhoto && (() => {
          const photo = filteredPhotos?.find(p => p.url === selectedPhoto);
          return (
            <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{photo?.title}</DialogTitle>
                </DialogHeader>
                <img
                  src={selectedPhoto}
                  alt="Full size"
                  className="w-full h-auto rounded-lg"
                />
                <div className="space-y-2 pt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Event:</strong> {photo?.eventName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Datum:</strong> {photo?.date}
                  </p>
                  {user?.role === "admin" && photo && (
                    <Button
                      variant="destructive"
                      className="w-full cursor-pointer"
                      onClick={() => {
                        handleDelete(photo._id);
                        setSelectedPhoto(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Foto löschen
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          );
        })()}
      </div>
    </Layout>
  );
}