// footer_info.js
const Info = Object.freeze({
  project: {
    name: 'FS Bottega Final Project: Hoakeen',
    version: { major: 1, minor: 0,  patch: 1, 
      toString() { return `${this.major}.${this.minor}.${this.patch}`; }
    }
  },

  notes: [
    //{ version: "v0.5.X", title: "TBD", details: ["1", "2", "3",],  },
    { version: "v1.1.0", title: "CRM. CompanyList + CompanyDetails + OrderList showing", details: ["These appear to be showing correctly", "A FRICKING", "NIGHTMARE",],  },
    { version: "v1.0.1", title: "Solved Width discrepancies", details: ["Solved ANNOYING width problems",],  },
    { version: "v1.0.0", title: "CRM Components & Scss structure", details: ["CRM Parent component and children", "Cleaning SCSS imports", "Expanding Mixins",], },
    { version: "v0.6.2", title: "User Type & Status", details: ["Verifying Type & Status on both Logins","Started CRM Components","Backend hopefully ready...",] },
    { version: "v0.6.1", title: "New SQL tables, classes, etc", details: ["New Orders tables","New Items tables","New IntOrderItem table","OrderManager and ItemManager into backend",] },
    { version: "v0.6.0", title: "Backend OPP Refactoring", details: ["Refactored Entire Backend- ServerOPP.js",] },
    { version: "v0.5.1", title: "MultiCompany", details: ["Edit AppUser with Multi Select Companies", "Solved small State status issues" ],  },
    { version: "v0.5.0", title: "MultiCompany", details: ["Multi Select Companies in AppUsers (Available for Add and Remove", "Customers: [4] counter","Active-link in Nav has diff color"],  },
    { version: "v0.4.1", title: "Footer Visual Changes", details: ["Added Logo to Footer", "Added 3rd column to footer",],  },
    { version: "v0.4.0", title: "SQL Updates", details: ["Added SQL Intermediary Table intCompanyUsers", "Added IntCompanyUsers to Server.js", 
      "You can create Appusers and assign them to a Company", "Created Popup Component", "Cleaned Scss a bit more", ], },
    { version: "v0.3.0", title: "UI/UX Improvements", details: ["Nightmare SCSS with Login Section",], },
    { version: "v0.2.0", title: "Styling Updates", details: ["Nightmare with SCSS",], },
    { version: "v0.1.0", title: "Feature Introduction", details: ["Displaying Version Data",] },
    { version: "v0.0.0", title: "Initial Release", details: ["Initial release (if this info section)",], },
//    { version: "v0.5.X", title: "TBD", details: ["1", "2", "3", "4", "5",],  }
  ],

  getLatestNote() {
    const latestNote = this.notes[0];
    return latestNote;
    //return `${latestNote.version} - ${latestNote.title}: ${latestNote.details.join(", ")}`;
  },

  getVersion() {
    return this.project.version.toString();
  },
});

export default Info;
