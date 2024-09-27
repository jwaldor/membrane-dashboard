// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from "membrane";

if (!state.notes) {
  state.notes = [];
}

export async function status() {
  const hits = state.hits ?? 0;
  if (hits === 0) {
    return "←-- Right click to Copy webhook URL";
  }
  return `Hits: ${hits} ${hits > 0 ? "" : "- Right click to copy URL"}`;
}

export async function endpoint(req) {
  state.hits = (state.hits ?? 0) + 1;
  root.statusChanged.$emit();

  const { method, path, query, body } = req;
  const headers = JSON.parse(req.headers);

  switch (path) {
    // Setup url for events:
    // https://api.slack.com/apps/<appid>/event-subscriptions
    case "/submit": {
      const submit_params = new URLSearchParams(query);
      const input = submit_params.get("inputValue");
      console.log("inputValue", input);
      state.notes.push(input);
      return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Submitted!</title>
          <style>
              body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 50vh;
                  margin: 0;
                  background-color: #282c34; /* Dark background */
                  font-family: 'Arial', sans-serif; /* Font style */
              }
              .styled-word {
                  font-size: 50px; /* Large font size */
                  font-weight: bold; /* Bold text */
                  color: #61dafb; /* Light blue color */
                  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5); /* Shadow effect */
                  transition: transform 0.3s, color 0.3s; /* Smooth transition */
              }
              .styled-word:hover {
                  transform: scale(1.1); /* Slightly enlarge on hover */
                  color: #21a1f1; /* Change color on hover */
              }
          </style>
      </head>
      <body>
          <div class="styled-word">Submitted!</div>
      </body>
      </html>`;
    }
    case "/":
      return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Input Form Example</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              color: #333;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
  
          h1 {
              margin-bottom: 20px;
              color: #4A90E2;
          }
  
          .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
  
          input[type="text"] {
              width: 80%;
              padding: 12px;
              border: 2px solid #4A90E2;
              border-radius: 5px;
              font-size: 16px;
              margin-bottom: 20px;
              transition: border-color 0.3s;
          }
  
          input[type="text"]:focus {
              outline: none;
              border-color: #007BFF;
          }
  
          button {
              background-color: #4A90E2;
              color: #ffffff;
              padding: 12px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              transition: background-color 0.3s;
          }
  
          button:hover {
              background-color: #007BFF;
          }
      </style>
      <script>
          function handleSubmit() {
              // Get the value from the input box
              const inputValue = document.getElementById('inputBox').value;
  
              // Obtain the current URL
              const currentUrl = window.location.href;
              console.log("Current URL:", currentUrl);
  
              // Process the input value (you can replace this with your desired function)
              console.log("Input value:", inputValue);
  
              // Clear the input box
              document.getElementById('inputBox').value = '';
  
              // Construct the new URL using the current URL
              const newUrl = currentUrl + '?input=' + encodeURIComponent(inputValue);
              window.location.href = \`submit?inputValue=\${inputValue}\`; // Navigate to the new URL
          }
      </script>
  </head>
  <body>
      <div class="container">
          <h1>Send note to Membrane</h1>
          <input type="text" id="inputBox" placeholder="Enter something..." />
          <button type="button" onclick="handleSubmit()">Submit</button>
      </div>
  </body>
  </html>`;
    default:
      console.log("Unknown Endpoint:", path);
  }
}
