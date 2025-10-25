import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Calendar, Users, Euro, Megaphone, CheckSquare, Camera } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="AbiConnect" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight">AbiConnect</span>
          </div>
          <Link to="/auth">
            <Button>Anmelden</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Dein Abi-Jahr,
            <br />
            <span className="text-primary">perfekt organisiert</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Die zentrale Plattform für deine Abschlussklasse. Organisiere Events, verwalte Finanzen und bleibe mit deinen Mitschülern verbunden.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" className="cursor-pointer text-lg px-8">
                Jetzt starten
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="cursor-pointer text-lg px-8">
                Demo ansehen
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">Alles, was du brauchst</h2>
          <p className="text-xl text-muted-foreground">
            Alle wichtigen Tools für dein Abi-Jahr an einem Ort
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Calendar,
              title: "Event-Kalender",
              description: "Behalte alle wichtigen Termine im Blick - von der Mottowoche bis zum Abiball",
              delay: 0.3,
            },
            {
              icon: Euro,
              title: "Finanzverwaltung",
              description: "Verwalte Einnahmen und Ausgaben transparent und erreiche eure Kassenziele",
              delay: 0.4,
            },
            {
              icon: Users,
              title: "Digitales Abibuch",
              description: "Schreibe Kommentare für deine Mitschüler und erstelle bleibende Erinnerungen",
              delay: 0.5,
            },
            {
              icon: Megaphone,
              title: "Ankündigungen",
              description: "Halte alle auf dem Laufenden mit wichtigen News und Updates",
              delay: 0.6,
            },
            {
              icon: CheckSquare,
              title: "To-Do Listen",
              description: "Organisiere Aufgaben in Listen und behalte den Überblick über alle Projekte",
              delay: 0.7,
            },
            {
              icon: Camera,
              title: "Foto-Galerie",
              description: "Sammle und teile Erinnerungen an eure gemeinsame Zeit",
              delay: 0.8,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className="border-2 border-primary">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">
                Bereit für dein bestes Abi-Jahr?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Starte jetzt und bringe deine Abschlussklasse zusammen
              </p>
              <Link to="/auth">
                <Button size="lg" className="cursor-pointer text-lg px-8">
                  Kostenlos loslegen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="AbiConnect" className="w-8 h-8" />
              <span className="font-bold">AbiConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AbiConnect. Deine Plattform für das Abi-Jahr.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}