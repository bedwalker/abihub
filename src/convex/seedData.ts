import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingStudents = await ctx.db.query("students").first();
    if (existingStudents) {
      console.log("Database already seeded");
      return;
    }

    // Seed Students
    const studentIds = [];
    const studentNames = [
      "Anna Schmidt", "Max Müller", "Sophie Weber", "Leon Fischer",
      "Emma Wagner", "Paul Becker", "Mia Hoffmann", "Felix Schulz",
      "Laura Klein", "Jonas Wolf", "Lena Schröder", "Tim Neumann",
    ];

    for (const name of studentNames) {
      const id = await ctx.db.insert("students", {
        name,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        phone: `+49 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000000 + 1000000)}`,
        email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      });
      studentIds.push(id);
    }

    // Seed Comments
    const commentTexts = [
      "Du bist ein toller Mensch! Viel Erfolg für die Zukunft!",
      "War eine super Zeit mit dir! Bleib wie du bist!",
      "Danke für die vielen lustigen Momente!",
      "Wir werden uns vermissen! Alles Gute!",
    ];

    for (let i = 0; i < 20; i++) {
      await ctx.db.insert("comments", {
        studentId: studentIds[Math.floor(Math.random() * studentIds.length)],
        authorName: studentNames[Math.floor(Math.random() * studentNames.length)],
        text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    // Seed Finances
    const incomeDescriptions = ["Kuchenverkauf", "Sponsoring", "Spende", "Flohmarkt"];
    const expenseDescriptions = ["Location-Miete", "Dekoration", "Catering", "Druck"];

    for (let i = 0; i < 15; i++) {
      const isIncome = Math.random() > 0.4;
      await ctx.db.insert("finances", {
        type: isIncome ? "income" : "expense",
        amount: Math.floor(Math.random() * 500 + 50),
        description: isIncome
          ? incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)]
          : expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)],
        date: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString().split("T")[0],
      });
    }

    // Seed Announcements
    const announcements = [
      { title: "Abiball-Location bestätigt!", text: "Wir haben die perfekte Location für unseren Abiball gefunden! Mehr Details folgen bald." },
      { title: "Mottowoche Planung", text: "Nächste Woche treffen wir uns, um die Mottowoche zu planen. Bringt eure Ideen mit!" },
      { title: "Abizeitung Deadline", text: "Vergesst nicht, eure Texte und Fotos bis Ende des Monats einzureichen!" },
    ];

    for (const announcement of announcements) {
      await ctx.db.insert("announcements", {
        ...announcement,
        author: studentNames[Math.floor(Math.random() * studentNames.length)],
        timestamp: Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000),
      });
    }

    // Seed Events
    const events = [
      {
        title: "Mottowoche Start",
        description: "Der erste Tag unserer legendären Mottowoche!",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "08:00",
        location: "Schule",
        category: "Mottowoche",
      },
      {
        title: "Abiball",
        description: "Unser großer Abschlussball - der Höhepunkt des Jahres!",
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "19:00",
        location: "Stadthalle",
        category: "Party",
      },
      {
        title: "Abistreich",
        description: "Zeit, der Schule einen unvergesslichen Streich zu spielen!",
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "07:00",
        location: "Schule",
        category: "Streich",
      },
    ];

    for (const event of events) {
      await ctx.db.insert("events", event);
    }

    // Seed Todos
    const todoLists = {
      "Abiball": ["Location buchen", "Catering organisieren", "DJ finden", "Einladungen verschicken"],
      "Mottowoche": ["Mottos festlegen", "Kostüme planen", "Musik vorbereiten"],
      "Abizeitung": ["Texte sammeln", "Layout erstellen", "Druckerei kontaktieren"],
    };

    for (const [listName, tasks] of Object.entries(todoLists)) {
      for (let i = 0; i < tasks.length; i++) {
        await ctx.db.insert("todos", {
          listName,
          task: tasks[i],
          completed: Math.random() > 0.6,
          order: i,
        });
      }
    }

    // Seed Photos
    const photoEvents = ["Mottowoche", "Klassenfahrt", "Abistreich", "Kuchenverkauf"];
    for (let i = 0; i < 12; i++) {
      await ctx.db.insert("photos", {
        url: `https://picsum.photos/seed/${i}/800/600`,
        title: `Erinnerung ${i + 1}`,
        eventName: photoEvents[Math.floor(Math.random() * photoEvents.length)],
        date: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)).toISOString().split("T")[0],
      });
    }

    // Seed Settings
    const abiDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    await ctx.db.insert("settings", {
      key: "abiDate",
      value: abiDate,
    });

    await ctx.db.insert("settings", {
      key: "targetAmount",
      value: "5000",
    });

    console.log("Database seeded successfully!");
  },
});