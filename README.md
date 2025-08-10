# 🧪 Webhook Tester

A lightweight server for testing and inspecting webhook payloads. Ideal for developers needing a simple endpoint to receive, log, and verify HTTP POST requests.

----------

## 🚀 Project Overview

This project simulates a webhook receiver endpoint where incoming requests are captured, logged, and displayed for debugging or inspection. Perfect for validating integrations, testing GitHub or third-party webhooks, and inspecting payloads locally or on a hosted test server.

Try it here: [Webhook Tester](https://resplendent-otter-546660.netlify.app/)

----------

## 🔧 Core Features

-   **Receive webhook requests** (POST) and record headers, body, and timestamp
    
-   Provide a **health-check endpoint** (e.g. `GET /healthcheck`) returning `200 OK`
    
-   **Configurable response status** and optional delay injections (via query params or environment variables)
    
-   **Local and cloud usage**, compatible with tools like `smee.io` to tunnel webhooks to your local server
    

----------

## 🗂️ Tech Stack

### COMPONENT

**Backend**

- Python (Flask/FastAPI)

**Logging**

- Standard output or file

**Hosting**

- Localhost or container

**Webhook Tools**

Compatible with GitHub, GitLab, Stripe, etc. 
- [github.com+1](https://github.com/Coveros/webhook-tester?utm_source=chatgpt.com)
- [github.com](https://github.com/tarampampam/webhook-tester?utm_source=chatgpt.com)
- [docs.github.com+1](https://docs.github.com/en/webhooks/testing-and-troubleshooting-webhooks/testing-webhooks?utm_source=chatgpt.com)

----------

## 🚀 Setup & Usage

1.  **Clone this repo**
    
	```
	git clone https://github.com/WambuaJoe/Webhook-Tester.git cd Webhook-Tester
	``` 
    
2.  **Create virtual environment and install dependencies**
    
	```
	python3 -m venv env  source  env/bin/activate
    pip install -r requirements.txt
	``` 
    
3.  **Run the server**
    
	```
	export FLASK_APP=app.py # or main.py depending on your entrypoint flask run
	```
    
4.  **Health check**  
    Visit `http://localhost:5000/healthcheck` to confirm the server is active.
    
5.  **Send a webhook**  
    Test via `curl`, Postman, or third‑party services. For GitHub, configure your webhook to point to your URL (e.g. `https://<host>/payload`).
    

----------

## 🧠 How It Works

-   The server listens for incoming POST requests and logs the entire HTTP payload—headers and body.
    
-   The `/healthcheck` route allows for quick readiness checks.
    
-   For local testing of GitHub or external webhooks, use `smee.io` or a similar tunneling tool:  
    - [webhook.site](https://webhook.site/?utm_source=chatgpt.com)
    - [dev.to+1](https://dev.to/robmarshall/how-to-use-hookdeckcom-to-test-and-debug-webhooks-2o20?utm_source=chatgpt.com)
    
-   Optionally, customize response codes or delay behavior via query parameters or configuration settings.
    

----------

## 🧩 Use Cases

-   Debug integrations for webhook-based services
    
-   Local validation of webhook payloads before deploying to production
    
-   Educational tool to understand webhook structure, HTTP headers, and delivery workflows
    

----------

## 💡 Contributing

Contributions are warmly welcomed! Here's how to get involved:

1.  Fork the repository
    
2.  Create a branch (`git checkout -b feature/your-feature`)
    
3.  Add or improve features (e.g., response customization, UI, payload filtering)
    
4.  Commit your changes (`git commit -m 'Add your feature'`)
    
5.  Push and open a Pull Request
    

----------

## 📄 License

This project is released under the **MIT License**. See the [LICENSE](LICENSE) file for full details.
