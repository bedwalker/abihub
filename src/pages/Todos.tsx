import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Todos() {
  const todos = useQuery(api.todos.list);
  const addTodo = useMutation(api.todos.add);
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);

  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.trim()) {
      toast.error("Bitte gib eine Aufgabe ein");
      return;
    }

    try {
      await addTodo({
        task: newTask.trim(),
      });
      toast.success("Aufgabe hinzugefügt!");
      setOpen(false);
      setNewTask("");
    } catch (error) {
      toast.error("Fehler beim Hinzufügen der Aufgabe");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo({ id: id as any });
    } catch (error) {
      toast.error("Fehler beim Aktualisieren der Aufgabe");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeTodo({ id: id as any });
      toast.success("Aufgabe gelöscht!");
    } catch (error) {
      toast.error("Fehler beim Löschen der Aufgabe");
    }
  };

  const completedCount = todos?.filter((t) => t.completed).length || 0;
  const totalCount = todos?.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
            <h1 className="text-4xl font-bold tracking-tight mb-2">To-Do Liste</h1>
            <p className="text-muted-foreground">Organisiere deine Aufgaben</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button className="cursor-pointer" onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Aufgabe
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Aufgabe hinzufügen</DialogTitle>
                <DialogDescription>
                  Füge eine neue Aufgabe zur Liste hinzu
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <Label>Aufgabe</Label>
                  <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="z.B. Location buchen"
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  Hinzufügen
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Aufgaben</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {completedCount} von {totalCount} erledigt ({progressPercentage.toFixed(0)}%)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {todos?.map((todo) => (
                <motion.div
                  key={todo._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <button
                    onClick={() => handleToggle(todo._id)}
                    className="cursor-pointer"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {todo.task}
                  </span>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
              {todos?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Noch keine Aufgaben vorhanden
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}