## Card Memory Game - Simplified Skill Test

### Welcome!

Thank you for your interest in joining! This is a simplified skill test designed to understand your approach to problem-solving and development. The tasks are categorized based on your area of expertise.

---

### 🎯 **Objective:**

Build a small part of a card memory game based on your assigned role. This is meant to be completed within **2–3 hours** to showcase your skills.

### 🛠️ **Tech Stack:**

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB (only if applicable)
- Web3: MetaMask integration (only if applicable)

### 🚀 **Setup Guide:**

1.  Clone the repository:
    ```bash
    git clone https://github.com/YaroslavPedrovic/hiring_test.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd hiring_test
    ```
3.  Set up the backend:

    ```bash
    cd ./backend
    npm install
    npm start
    ```

    _The backend server requires a `.env` file located in the `/backend` directory to load necessary environment variables (like database connection strings and secrets)._

4.  Set up the frontend:
    ```bash
    # Navigate back to the root if you are inside /backend
    cd ..
    # Or directly if you are in the root: cd ./frontend
    cd ./frontend
    npm install
    # The default start script for Vite is usually 'dev', but 'start' might be configured.
    # Using 'npm run dev' is generally safer for Vite projects during development.
    npm run dev
    # If 'npm start' is specifically configured in frontend/package.json, use that:
    # npm start
    ```
5.  Visit `http://localhost:5173` (or the port specified by Vite) in your browser to see the project running.

---

### 🧩 **Task Breakdown by Role (Ordered by Importance):**

#### **Frontend Developer:**

- Style the login page to be visually appealing and responsive.
- Create a modal dialog for level selection (Easy, Medium, Hard).

#### **Backend Developer:**

- Implement a simple API endpoint to save game results.
- Create a route to fetch the game result history (no need for complex authentication).

#### **Full Stack Developer:**

- Complete both the Frontend and Backend tasks.
- Integrate the API to display the game result history on a new page.

#### **Web3 Developer:**

- Implement MetaMask wallet connection.
- Show a message displaying the connected wallet address.

#### **Designer:**

- Create assets like a styled Play button and card designs.
- Suggest UI/UX improvements for the main screen.

#### **QA Tester:**

- Create a comprehensive testing plan that outlines your testing strategy for the card memory game, including at least 8 test cases with detailed steps and expected outcomes.
- Additionally, suggest best practices for maintaining quality throughout the development lifecycle.

---

---

### ⚡ **Good Luck and Have Fun!**
