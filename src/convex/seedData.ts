import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const students = await ctx.db.query("students").collect();
    for (const s of students) await ctx.db.delete(s._id);
    
    const comments = await ctx.db.query("comments").collect();
    for (const c of comments) await ctx.db.delete(c._id);
    
    const finances = await ctx.db.query("finances").collect();
    for (const f of finances) await ctx.db.delete(f._id);
    
    const announcements = await ctx.db.query("announcements").collect();
    for (const a of announcements) await ctx.db.delete(a._id);
    
    const events = await ctx.db.query("events").collect();
    for (const e of events) await ctx.db.delete(e._id);
    
    const todos = await ctx.db.query("todos").collect();
    for (const t of todos) await ctx.db.delete(t._id);
    
    const photos = await ctx.db.query("photos").collect();
    for (const p of photos) await ctx.db.delete(p._id);

    // Add students
    const studentIds = [];
    const studentNames = [
      "Anna Schmidt", "Ben Müller", "Clara Weber", "David Fischer",
      "Emma Wagner", "Felix Becker", "Hannah Schulz", "Jonas Hoffmann",
      "Laura Klein", "Max Zimmermann"
    ];
    
    for (let i = 0; i < studentNames.length; i++) {
      const id = await ctx.db.insert("students", {
        name: studentNames[i],
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentNames[i]}`,
        phone: `+49 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
        email: `${studentNames[i].toLowerCase().replace(" ", ".")}@example.com`,
      });
      studentIds.push(id);
    }

    // Add comments
    const commentTexts = [
      "Du bist der Beste! Viel Erfolg beim Abi! 🎓",
      "Danke für die tolle Zeit zusammen! 💙",
      "Bleib so wie du bist! 🌟",
      "Wir schaffen das Abi zusammen! 💪",
      "Unvergessliche Momente mit dir! 🎉",
    ];
    
    for (const studentId of studentIds) {
      const numComments = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numComments; i++) {
        await ctx.db.insert("comments", {
          studentId,
          authorName: studentNames[Math.floor(Math.random() * studentNames.length)],
          text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Add finances
    await ctx.db.insert("finances", { type: "income", amount: 850, description: "Kuchenverkauf", date: "2025-01-15" });
    await ctx.db.insert("finances", { type: "income", amount: 1200, description: "Sponsorenlauf", date: "2025-02-10" });
    await ctx.db.insert("finances", { type: "income", amount: 600, description: "Waffelverkauf", date: "2025-02-28" });
    await ctx.db.insert("finances", { type: "income", amount: 400, description: "Flohmarkt", date: "2025-03-12" });
    await ctx.db.insert("finances", { type: "income", amount: 200, description: "Spenden", date: "2025-03-20" });
    await ctx.db.insert("finances", { type: "expense", amount: 150, description: "Druckkosten Abizeitung", date: "2025-02-05" });
    await ctx.db.insert("finances", { type: "expense", amount: 300, description: "Dekoration Abiball", date: "2025-03-01" });
    await ctx.db.insert("finances", { type: "expense", amount: 180, description: "Mottowoche Material", date: "2025-03-15" });

    // Add announcements
    await ctx.db.insert("announcements", {
      title: "Abiball-Location bestätigt! 🎉",
      text: "Wir haben die perfekte Location für unseren Abiball gefunden! Die Stadthalle ist gebucht für den 20. Juni 2026.",
      author: "Anna Schmidt",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    });
    
    await ctx.db.insert("announcements", {
      title: "Mottowoche Themen stehen fest",
      text: "Die Abstimmung ist abgeschlossen! Montag: Kindheitshelden, Dienstag: Bad Taste, Mittwoch: Zeitreise, Donnerstag: Geschlechtertausch, Freitag: Erster Schultag",
      author: "Ben Müller",
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    });
    
    await ctx.db.insert("announcements", {
      title: "Abizeitung Deadline",
      text: "Bitte alle Texte und Fotos bis zum 1. April einreichen! Wir brauchen eure Steckbriefe und Zitate.",
      author: "Clara Weber",
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    });
    
    await ctx.db.insert("announcements", {
      title: "Nächster Kuchenverkauf",
      text: "Am Freitag findet wieder unser Kuchenverkauf statt. Bitte bringt leckere Kuchen mit!",
      author: "David Fischer",
      timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
    });
    
    await ctx.db.insert("announcements", {
      title: "Abi-Streich Planung",
      text: "Treffen am Mittwoch um 16 Uhr im Klassenzimmer 204 zur Besprechung des Abi-Streichs!",
      author: "Emma Wagner",
      timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    });

    // Add events
    await ctx.db.insert("events", {
      title: "Mottowoche Start",
      description: "Beginn unserer legendären Mottowoche!",
      date: "2026-05-18",
      time: "08:00",
      location: "Schule",
      category: "Mottowoche",
    });
    
    await ctx.db.insert("events", {
      title: "Letzter Schultag",
      description: "Unser letzter offizieller Schultag vor den Prüfungen",
      date: "2026-05-22",
      time: "13:00",
      location: "Schule",
      category: "Abi-Vorbereitung",
    });
    
    await ctx.db.insert("events", {
      title: "Abi-Streich",
      description: "Der große Abi-Streich für die Lehrer",
      date: "2026-05-25",
      time: "07:30",
      location: "Schulhof",
      category: "Streich",
    });
    
    await ctx.db.insert("events", {
      title: "Erste Abi-Prüfung",
      description: "Deutsch LK - Viel Erfolg!",
      date: "2026-06-01",
      time: "09:00",
      location: "Aula",
      category: "Prüfungen",
    });
    
    await ctx.db.insert("events", {
      title: "Abi-Gag",
      description: "Präsentation unseres Abi-Gags vor der Schule",
      date: "2026-06-10",
      time: "10:00",
      location: "Schulhof",
      category: "Abi-Vorbereitung",
    });
    
    await ctx.db.insert("events", {
      title: "Zeugnisübergabe",
      description: "Feierliche Übergabe der Abiturzeugnisse",
      date: "2026-06-15",
      time: "18:00",
      location: "Aula",
      category: "Abi-Vorbereitung",
    });
    
    await ctx.db.insert("events", {
      title: "Abiball",
      description: "Die große Abschlussfeier!",
      date: "2026-06-20",
      time: "19:00",
      location: "Stadthalle",
      category: "Party",
    });
    
    await ctx.db.insert("events", {
      title: "Abireise",
      description: "Gemeinsame Reise nach Kroatien",
      date: "2026-06-25",
      time: "06:00",
      location: "Busbahnhof",
      category: "Party",
    });

    // Add todos
    const todoLists = [
      { name: "Abiball-Planung", tasks: ["Location buchen", "Catering organisieren", "DJ finden", "Einladungen verschicken", "Dekoration kaufen", "Fotograf buchen"] },
      { name: "Abizeitung", tasks: ["Steckbriefe sammeln", "Fotos auswählen", "Texte schreiben", "Layout erstellen", "Druckerei kontaktieren", "Korrekturlesen"] },
      { name: "Streich-Organisation", tasks: ["Ideen sammeln", "Material besorgen", "Ablaufplan erstellen", "Teams einteilen", "Aufräumplan machen"] },
      { name: "Mottowoche", tasks: ["Themen festlegen", "Kostüme organisieren", "Musik-Playlist erstellen", "Fotos planen"] },
    ];
    
    for (const list of todoLists) {
      for (let i = 0; i < list.tasks.length; i++) {
        await ctx.db.insert("todos", {
          listName: list.name,
          task: list.tasks[i],
          completed: Math.random() > 0.6,
          order: i,
        });
      }
    }

    // Add photos
    const photoEvents = ["Mottowoche", "Kuchenverkauf", "Sponsorenlauf", "Klassenfahrt"];
    for (let i = 0; i < 20; i++) {
      const eventName = photoEvents[Math.floor(Math.random() * photoEvents.length)];
      await ctx.db.insert("photos", {
        url: `https://picsum.photos/seed/${i}/800/600`,
        title: `${eventName} Foto ${i + 1}`,
        eventName,
        date: `2025-0${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      });
    }

    // Add settings
    await ctx.db.insert("settings", { key: "abiDate", value: "2026-06-15" });
    await ctx.db.insert("settings", { key: "targetAmount", value: "5000" });

    return { success: true };
  },
});
