const Info = Object.freeze({
    notes: ["v0.3.0 - Nightmare SCSS with Login Section",
    "v0.2.0 - Nightmare with SCSS", 
    "v0.1.0 - Displaying Version Data", 
    "v0.0.0 - Initial release"], 
  
    project: {
      name: 'Bottega Final Project: Hoakeen',
      version: {
        major: 0,
        minor: 3,
        patch: 0,
        toString() {
          return `${this.major}.${this.minor}.${this.patch}`;
        }
      }
    },
  
    addNote(note) {
      this.notes.push(note);
    },
  
    getLatestNote() {
      return this.notes[0];
    },
  
    getVersion() {
      return this.project.version.toString();
    }
  });
  
  export default Info;
  