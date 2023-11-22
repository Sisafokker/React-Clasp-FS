// footer_info.js
const Info = Object.freeze({
  notes: [
    { version: "v0.4.2", description: "TBD", details: ["1", "2", "3", "4", "5",],  },
    { version: "v0.4.1", description: "Footer Visual Changes", details: ["Added Logo to Footer", "Added 3rd column to footer",],  },
    { version: "v0.4.0", description: "SQL Updates", details: [
        "Added SQL Intermediary Table intCompanyUsers",
        "Added IntCompanyUsers to Server.js",
        "You can create Appusers and assign them to a Company",
        "Created Popup Component",
        "Cleaned Scss a bit more",
      ],
    },
    { version: "v0.3.0", description: "UI/UX Improvements", details: ["Nightmare SCSS with Login Section",], },
    { version: "v0.2.0", description: "Styling Updates", details: ["Nightmare with SCSS",], },
    { version: "v0.1.0", description: "Feature Introduction", details: ["Displaying Version Data",] },
    { version: "v0.0.0", description: "Initial Release", details: ["Initial release (if this info section)",], }
  ],

  project: {
    name: 'Bottega Final Project: Hoakeen',
    version: {
      major: 0,
      minor: 4,
      patch: 0,
      toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
      }
    }
  },

  getLatestNote() {
    const latestNote = this.notes[0];
    return latestNote;
    //return `${latestNote.version} - ${latestNote.description}: ${latestNote.details.join(", ")}`;
  },

  getVersion() {
    return this.project.version.toString();
  },
});

export default Info;
