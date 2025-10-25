import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Shield, Users, Settings, Trash2, Plus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminSettings() {
  const { user } = useAuth();
  const allUsers = useQuery(api.users.listAllUsers);
  const students = useQuery(api.students.list);
  const abiDateSetting = useQuery(api.settings.get, { key: "abiDate" });
  const targetAmountSetting = useQuery(api.settings.get, { key: "targetAmount" });
  
  const updateUserRole = useMutation(api.users.updateUserRole);
  const deleteUser = useMutation(api.users.deleteUser);
  const updateSetting = useMutation(api.settings.set);
  const addStudent = useMutation(api.students.add);
  const updateStudent = useMutation(api.students.update);
  const removeStudent = useMutation(api.students.remove);
  
  const [abiDate, setAbiDate] = useState(abiDateSetting || "");
  const [targetAmount, setTargetAmount] = useState(targetAmountSetting || "");
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [studentName, setStudentName] = useState("");
  const [studentImage, setStudentImage] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  if (!user || user.role !== "admin" || allUsers === null) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto p-6 md:p-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Zugriff verweigert</h2>
              <p className="text-muted-foreground">
                Nur Administratoren können auf diese Seite zugreifen.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleRoleChange = async (userId: Id<"users">, role: "admin" | "user" | "member") => {
    try {
      await updateUserRole({ userId, role });
      toast.success("Benutzerrolle aktualisiert!");
    } catch (error) {
      toast.error("Fehler beim Aktualisieren der Rolle");
    }
  };

  const handleDeleteUser = async (userId: Id<"users">) => {
    if (!confirm("Möchten Sie diesen Benutzer wirklich löschen?")) return;
    try {
      await deleteUser({ userId });
      toast.success("Benutzer gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen des Benutzers");
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (abiDate) {
        await updateSetting({ key: "abiDate", value: abiDate });
      }
      if (targetAmount) {
        await updateSetting({ key: "targetAmount", value: targetAmount });
      }
      toast.success("Einstellungen gespeichert!");
    } catch (error) {
      toast.error("Fehler beim Speichern der Einstellungen");
    }
  };

  const openStudentDialog = (student?: any) => {
    if (student) {
      setEditingStudent(student);
      setStudentName(student.name);
      setStudentImage(student.image);
      setStudentPhone(student.phone || "");
      setStudentEmail(student.email || "");
    } else {
      setEditingStudent(null);
      setStudentName("");
      setStudentImage("");
      setStudentPhone("");
      setStudentEmail("");
    }
    setStudentDialogOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentImage.trim()) {
      toast.error("Name und Bild sind erforderlich");
      return;
    }

    try {
      if (editingStudent) {
        await updateStudent({
          id: editingStudent._id,
          name: studentName.trim(),
          image: studentImage.trim(),
          phone: studentPhone.trim() || undefined,
          email: studentEmail.trim() || undefined,
        });
        toast.success("Kontakt aktualisiert!");
      } else {
        await addStudent({
          name: studentName.trim(),
          image: studentImage.trim(),
          phone: studentPhone.trim() || undefined,
          email: studentEmail.trim() || undefined,
        });
        toast.success("Kontakt hinzugefügt!");
      }
      setStudentDialogOpen(false);
    } catch (error) {
      toast.error("Fehler beim Speichern");
    }
  };

  const handleDeleteStudent = async (studentId: Id<"students">) => {
    if (!confirm("Möchten Sie diesen Kontakt wirklich löschen?")) return;
    try {
      await removeStudent({ id: studentId });
      toast.success("Kontakt gelöscht!");
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
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Admin-Einstellungen</h1>
          <p className="text-muted-foreground">Verwalte Benutzer und Systemeinstellungen</p>
        </motion.div>

        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Systemeinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Abi-Datum</Label>
                <Input
                  type="date"
                  value={abiDate}
                  onChange={(e) => setAbiDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Kassenziel (€)</Label>
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="5000"
                />
              </div>
              <Button onClick={handleSaveSettings} className="cursor-pointer">
                Einstellungen speichern
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Benutzerverwaltung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers?.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {u.image && (
                        <img
                          src={u.image}
                          alt={u.name || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{u.name || "Unbenannt"}</p>
                        <p className="text-sm text-muted-foreground">{u.email || "Keine E-Mail"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={u.role || "user"}
                        onValueChange={(role) => handleRoleChange(u._id, role as "admin" | "user" | "member")}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">Benutzer</SelectItem>
                          <SelectItem value="member">Mitglied</SelectItem>
                        </SelectContent>
                      </Select>
                      {u._id !== user._id && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteUser(u._id)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student/Contact Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Kontaktverwaltung
                </span>
                <Button onClick={() => openStudentDialog()} className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Kontakt hinzufügen
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students?.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.email || student.phone || "Keine Kontaktdaten"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStudentDialog(student)}
                        className="cursor-pointer"
                      >
                        Bearbeiten
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteStudent(student._id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Dialog */}
        <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? "Kontakt bearbeiten" : "Neuer Kontakt"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="z.B. Max Mustermann"
                />
              </div>
              <div className="space-y-2">
                <Label>Bild-URL</Label>
                <Input
                  value={studentImage}
                  onChange={(e) => setStudentImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon (optional)</Label>
                <Input
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
              <div className="space-y-2">
                <Label>E-Mail (optional)</Label>
                <Input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="max@example.com"
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                {editingStudent ? "Aktualisieren" : "Hinzufügen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}