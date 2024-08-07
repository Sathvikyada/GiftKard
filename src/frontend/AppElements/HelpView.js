// Define Help class for rendering developer and contact information
export class Help {

  constructor () {}

  // Asynchronously render method creates and returns the help section element
  async render() {
    // Create a div element for help section
    const helpElm = document.createElement('div');
    helpElm.id = 'help'; // Set id attribute of help section

    // Set inner HTML content for help section using template literals
    helpElm.innerHTML = `
    <div id="containerHelp" class="content">
        <div id="leftHelp">
            <h2>Developer Information</h2>
            <p>I'm Sathvik and I am the developer of this website. I am a computer science student at UMass Amherst and I made this website for CS 326 semester long project.</p>
            <h2>Contact Information</h2>
            <p>Email: syadanaparth@umass.edu</p>
            <p>Phone: (123) 456-7890</p>
        </div>
        <div id="rightHelp">
            <img src="https://cdn-icons-png.flaticon.com/512/4123/4123763.png" alt="Developer Image">
        </div>
    </div>
    `;

    // Return the constructed help section element
    return helpElm;
  }
}
