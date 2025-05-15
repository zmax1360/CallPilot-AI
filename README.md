# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

To run this project locally, follow these steps:

1.  **Install dependencies:**
    If you haven't already, install the project dependencies using npm or yarn:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Run the Next.js development server:**
    This command starts the main application.
    ```bash
    npm run dev
    ```
    By default, this will start the app on port 9002 (http://localhost:9002).

3.  **Run the Genkit development server (for AI features):**
    Genkit is used for the AI functionalities. You need to run its development server in a separate terminal.
    
    To run Genkit and have it automatically restart on file changes:
    ```bash
    npm run genkit:watch
    ```
    Alternatively, to run it once without watching for changes:
    ```bash
    npm run genkit:dev
    ```
    The Genkit server typically starts on port 3400 and provides a developer UI at http://localhost:4000/dev-ui.

You'll need both the Next.js server and the Genkit server running concurrently to use all features of the application.
