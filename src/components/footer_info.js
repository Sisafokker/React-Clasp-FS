// footer_info.js
const Info = Object.freeze({
  project: {
    name: 'FS Bottega Final Project: Hoakeen',
    version: { major: 2, minor: 0,  patch: 3, 
      toString() { return `${this.major}.${this.minor}.${this.patch}`; }
    }
  },

  notes: [
    //{ version: "v0.5.X", title: "Show Descrip", details: ["Show Descrip", "Show Descrip", "Show Descrip",],  },
    { version: "v2.0.3", title: "CRM Reset Filters", details: ["Bug fixed. Not recalculating user companies", ],  },
    { version: "v2.0.2", title: "CustomersForm updated and refactored", details: ["Now matches the same user story as appusersform", "Refactored to use switch statement", ],  },
    { version: "v2.0.1", title: "Popups Visuals", details: ["All popups within range for Desktop and Mobile", "Pending refactoring CSS", ],  },
    { version: "v2.0.0", title: "Cleared all Console logs", details: ["Commented all console logs in the app ... Simple update", "Detected bug in CRM status filter... ", "Mobile responsible although found things that have changes... dev popup for example", "Commented all console logs in the app ... Simple update",],  },
    { version: "v1.8.9", title: "Users and Customers", details: ["Task-Wrapper", "3 cols per page with basic instructions", "Mobile responsible",],  },
    { version: "v1.8.8", title: "Download Improved & CRUD Customers", details: ["New Server.js endpoints for companies", "Crud Customers operational", "User can download as well regardless if ISS Google or not",],  },
    { version: "v1.8.7", title: "CRM Visuals and @mobile", details: ["Improved Msg's when No Customer", "Visuals when Customer is Active vs Inactive", "Improved Mixins Buttons to be more responsive", "Improved Table visuals (rounded corners)", "Vertical Table Dif Colors depending on Company Status", "Warnings if user has not companies assigned to them"],  },
    { version: "v1.8.6", title: "Password Reset by Admins ", details: ["Admins con reset users passwords", "popupPassword.js", "popupPasswords.scss",],  },
    { version: "v1.8.5", title: "Solved SignUp error", details: ["Solved SignUp bug","Added more controls over form","Improved success/fail messages",],  },
    { version: "v1.8.4", title: "Landing for Unverified / Inactive Users", details: ["Created Home_unverified",],  },
    { version: "v1.8.3", title: "Mobile Responsive Upgrades", details: ["Mobile Hamburger Menu - Permanent", "isMenuOpen Context State", "Context added to all Parent Components", ],  },
    { version: "v1.8.2", title: "Improving AppUsers CRUD", details: ["Companies Select/Deselect All", "Multi select element visual improv.", ],  },
    { version: "v1.8.1", title: "Mobile Responsive & Bug resolution", details: ["Started Mobile Responsible Css", "Improved CSS in the process", "Solved Bug in CrmCompanyList filters", "Adjusted PopupItem (also responsible)", ],  },
    { version: "v1.8.0", title: "Multiple things",  details: ["Download Included Order List and Details", "🚧 CSV Dowload for non Google users", "New OAuth.js but not convinced", "CSS Modif to CRM & CRM_Order_Details",],  },
    { version: "v1.7.0", title: "Added / Refactored Many things",  details: ["Many CSS improvements", "Reduced CSS overlaps", "Item view from Order_details","Added Images to Items","Customers Updated partially", "Mixins updates","AppUser visuals","Solved AppUsers Form glitch",],  },
    { version: "v1.6.0", title: "Refactored Sorting making it Shared Hook, enrich/expand tables", details: ["Sorting for all tables", "Expand & Sort", "Sorting via Fontawesome","Cleaner CompanyDetails render",],  },
    { version: "v1.5.2", title: "CRM & Totals & useEffects", details: ["Improved hooks","Added and corrected totals", "Solved CSS & CSSmaps files appearing out of the blue", "Improved buttons and filter interaction"],  },
    { version: "v1.5.1", title: "Adding Table Totals", details: ["in construction",],  },
    { version: "v1.5.0", title: "Download Refactoring & Improved functionality", details: ["Refactoring props", "Allowing exports of multiple sheets per file", "Improved Icons",],  },
    { version: "v1.4.0", title: "Improving Google Download", details: ["Downloading Orders List", "Pending Applying filter to orders & download",],  },
    { version: "v1.3.0", title: "Create Google Sheet!", details: ["Able to create sheet and pass data into it", "Pending passing data dynamically through other components",],  },
    { version: "v1.2.1", title: "CSS Improvement", details: ["Mixin improves", "Solved Btn's issues", "Change Table styling",],  },
    { version: "v1.2.0", title: "Improved CSS & Return Class Structures", details: ["Visual Improvements", "ClassNames for most CRM Child components", "verticalTable working",],  },
    { version: "v1.1.2", title: "CRM ALL SHOWING AND INTERACTING", details: ["Starting Combining SQL data in different crm child components",],  },
    { version: "v1.1.1", title: "CRM. OrderDetails now showing", details: ["New Server Endpoint", "Also added into IntermediaryManager.js", "Pending resetting all when SelectedCompany changes",],  },
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
