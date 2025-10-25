import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar, Euro, MessageSquare, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Dashboard() {
  const balance = useQuery(api.finances.getBalance);
  const upcomingEvents = useQuery(api.events.upcoming, { limit: 3 });
  const recentAnnouncements = useQuery(api.announcements.recent, { limit: 3 });
  const students = useQuery(api.students.list);
  const commentsCount = useQuery(api.comments.count);
  const abiDateSetting = useQuery(api.settings.get, { key: "abiDate" });
  const targetAmountSetting = useQuery(api.settings.get, { key: "targetAmount" });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!abiDateSetting) return;
    
    const calculateTimeLeft = () => {
      const abiDate = new Date(abiDateSetting);
      const now = new Date();
      const difference = abiDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [abiDateSetting]);

  const targetAmount = targetAmountSetting ? parseFloat(targetAmountSetting) : 5000;
  const currentBalance = balance || 0;
  const progressPercentage = (currentBalance / targetAmount) * 100;

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Willkommen bei AbiConnect</p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Countdown bis zum Abi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.days}</div>
                  <div className="text-sm text-muted-foreground mt-2">Tage</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.hours}</div>
                  <div className="text-sm text-muted-foreground mt-2">Stunden</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.minutes}</div>
                  <div className="text-sm text-muted-foreground mt-2">Minuten</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-primary">{timeLeft.seconds}</div>
                  <div className="text-sm text-muted-foreground mt-2">Sekunden</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Schüler</p>
                    <p className="text-3xl font-bold">{students?.length || 0}</p>
                  </div>
                  <Users className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Kommentare</p>
                    <p className="text-3xl font-bold">{commentsCount || 0}</p>
                  </div>
                  <MessageSquare className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Events</p>
                    <p className="text-3xl font-bold">{upcomingEvents?.length || 0}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Kassenstand</p>
                    <p className="text-3xl font-bold">{currentBalance}€</p>
                  </div>
                  <Euro className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Finance Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Kassenziel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{currentBalance}€ von {targetAmount}€</span>
                <span className="font-bold">{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events & Recent Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Nächste Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents?.map((event) => (
                  <div key={event._id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                ))}
                <Link to="/events" className="text-sm text-primary hover:underline cursor-pointer block">
                  Alle Events anzeigen →
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Neueste Ankündigungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAnnouncements?.map((announcement) => (
                  <div key={announcement._id} className="pb-4 border-b last:border-0">
                    <p className="font-medium">{announcement.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(announcement.timestamp).toLocaleDateString("de-DE")} • {announcement.author}
                    </p>
                  </div>
                ))}
                <Link to="/announcements" className="text-sm text-primary hover:underline cursor-pointer block">
                  Alle Ankündigungen anzeigen →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
