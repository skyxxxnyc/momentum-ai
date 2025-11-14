# Momentum AI

> An autonomous revenue platform that uses AI agents to automate sales workflows, predict outcomes, and accelerate growth.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/skyxxxnyc/momentum-ai)

## About The Project

Momentum AI is a next-generation, autonomous revenue platform designed for tech-forward sales teams. It transcends traditional CRM functionality by embedding intelligent AI agents that automate workflows, provide predictive insights, and streamline the entire sales process.

The application is built around a stunning, data-rich user interface that unifies CRM data, sales engagement tools, and AI-driven actions into a single, cohesive experience. The core of the platform is the AI Agent, which users can interact with via a chat interface to perform tasks like lead generation, email drafting, and data analysis.

This project is built on a powerful serverless stack leveraging Cloudflare Workers, Durable Objects, and AI Gateway for a scalable, low-latency, and intelligent user experience.

## Key Features

*   **✨ Visually Stunning Dashboard:** A customizable central hub displaying key performance indicators (KPIs) like deal velocity and pipeline value through elegant charts and data widgets.
*   **Kanban Deals Pipeline:** A drag-and-drop Kanban board to visualize and manage the sales pipeline, providing a clear, at-a-glance overview of all opportunities.
*   **Unified Contact & Company Management:** Clean, dense, and highly readable table views for managing contacts and companies, with powerful sorting and filtering capabilities.
*   **🤖 AI Agent Chat:** A conversational command center to instruct the AI agent to perform tasks, ask for insights, and automate complex workflows, powered by Cloudflare's AI infrastructure.
*   **Future-Forward UI/UX:** A sophisticated dark-themed interface with a vibrant accent color, built with `shadcn/ui` and polished with `framer-motion` for a premium, responsive user experience.

## Technology Stack

**Frontend:**
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **State Management:** Zustand
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Charting:** Recharts
*   **Routing:** React Router

**Backend (Serverless):**
*   **Runtime:** Cloudflare Workers
*   **API Framework:** Hono
*   **Stateful Services:** Cloudflare Durable Objects
*   **AI Integration:** Cloudflare AI Gateway, OpenAI SDK
*   **Tooling:** Cloudflare Agents SDK

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/momentum_ai_crm.git
    cd momentum_ai_crm
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.dev.vars` file in the root of the project for local development. You will need to populate it with your Cloudflare AI Gateway credentials.

    ```ini
    # .dev.vars

    # Your Cloudflare Account ID and AI Gateway name
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"

    # A Cloudflare API Token with "AI Gateway" permissions
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```

    You can find your Account ID and create an API Key in your Cloudflare dashboard.

## Development

To start the local development server for both the frontend and the worker, run:

```sh
bun dev
```

This will start the Vite development server for the React application, typically on `http://localhost:3000`, and the Wrangler development server for the backend worker. The frontend is configured to proxy API requests to the worker, so you can interact with the full application locally.

*   The frontend code is located in the `src/` directory.
*   The backend Cloudflare Worker code is in the `worker/` directory.

## Deployment

This project is designed for seamless deployment to the Cloudflare ecosystem.

1.  **Build the application:**
    The deployment script handles the build process automatically.

2.  **Deploy to Cloudflare:**
    Run the deploy command. This will build the Vite frontend, deploy it to Cloudflare Pages, and deploy the backend to Cloudflare Workers, including setting up Durable Object bindings.

    ```sh
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/skyxxxnyc/momentum-ai)

## Architecture

The application uses a modern, serverless architecture:

*   **Frontend:** A React Single-Page Application (SPA) built with Vite and served globally via **Cloudflare Pages**.
*   **Backend:** A Hono-based API running on **Cloudflare Workers**, providing a fast and scalable backend.
*   **State Management:** **Cloudflare Durable Objects** (`ChatAgent` and `AppController`) are used to maintain state for chat sessions and application control, enabling persistent, stateful conversations.
*   **AI:** The AI Agent Chat functionality is powered by models accessed through the **Cloudflare AI Gateway**, ensuring security and observability.

## Important Note on AI Usage

Please be aware that this project utilizes AI models through Cloudflare's infrastructure. There may be limits on the number of requests that can be made to the AI servers across all user applications within a given time period. Please use the AI features responsibly.