// Lecture content for the Predavanja tab.
//
// Filled in from photos of the student's own notebook — each entry is one
// subject, with its lessons in the order the plan teaches them. The player
// reads `title`, `summary`, every section and the `key` points aloud.
//
//   {
//     id: "cnc-programiranje", subject: "CNC programiranje", icon: "🔧", order: 1,
//     lessons: [{
//       id: "cnc-1-1",
//       module: "1. Programiranje NUMA",
//       title: "Uvod u numeričko upravljanje",
//       summary: "Jedna rečenica o čemu je lekcija.",
//       sections: [{ h: "Naslov dijela", p: ["Pasus.", "Pasus."] }],
//       key: ["Ono što se pita na testu."]
//     }]
//   }
window.LECTURES = (window.LECTURES || []).concat([]);
