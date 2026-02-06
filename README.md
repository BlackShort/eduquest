# **EduQuest**

EduQuest is a modern, e-learning, microservices-driven platform designed for engineering students and faculty.
It enables **coding practice**, **theory assessments**, **proctoring**, **plagiarism detection**, **leaderboards**, and **performance analytics**, combining academic workflows with industry-grade technology.

---

## 🚀 **Features**

### For Students

* Attempt **coding questions**, **MCQs**, and **theory questions**
* Integrated **Monaco code editor** with real-time execution engine
* **Proctoring** during tests (tab change detection, face presence checks)
* Instant feedback & detailed performance analytics
* Leaderboards, badges, points, and gamification elements

### For Faculty

* Create and manage **questions** (coding, MCQ, theory)
* Create & schedule **tests/assignments**
* Monitor **proctoring logs** during tests
* View **plagiarism reports** and suspicious submissions
* Analyze student performance with dashboards

### System Capabilities

* AI-enabled proctoring & behavior tracking
* Code plagiarism detection using **Jaccard similarity / AST comparison**
* Auto-evaluation of coding submissions via sandbox/judge engine
* Gamification engine for badges, streaks, and ranking
* Modular microservices architecture for scalability

---

## **Microservices Architecture**

EduQuest follows a **microservices** design for flexibility and scalability.

| Service                           | Responsibilities                         |
| --------------------------------- | ---------------------------------------- |
| **Auth Service**                  | Login, registration, JWT auth, RBAC      |
| **Content Service**               | Manage MCQ, coding, assessment           |
| **Test Service**                  | Create, schedule, publish tests          |
| **Attempt Service**               | Test attempts, autosave, submit flow     |
| **Judge Service**                 | Code execution & test case evaluation    |
| **Plagiarism Service**            | Similarity scoring, clustering, flagging |
| **Proctoring Service**            | Tab-change detection, webcam checks      |
| **Analytics Service**             | Reports, dashboards, insights            |
| **Gamification Service**          | Leaderboards, badges, points             |
| **Notification Service**          | Email / system notifications             |
| **Frontend Web App**              | UI for students & faculty                |
| **Mobile App**                    | UI for students & faculty                |
| **API Gateway (NGINX / Ingress)** | Routing, caching, rate limiting          |

---

## 🗃️ **Tech Stack**

### **Web Frontend**

* Next.js / React
* TypeScript
* TailwindCSS
* Monaco Code Editor

From branch jatin 

### **Backend / Microservices**

* Node.js (Nest.js / Express) or Python FastAPI
* Docker containers
* REST / gRPC APIs
* RabbitMQ / Kafka for asynchronous events

### **Database Layer**

* PostgreSQL (primary transactional DB)
* Redis (cache, leaderboard)
* MongoDB / Elastic (logs & proctoring events)
* MinIO / AWS S3 (file storage)

### **AI / Evaluation**

* Jaccard similarity for plagiarism
* AST/token-based code comparison
* Optional: MediaPipe / OpenCV for face detection
* Judge0 or custom sandbox for code execution

### **Infrastructure**

* Kubernetes
* NGINX Ingress Controller
* GitHub Actions (CI/CD)
* Prometheus + Grafana (monitoring)
* Loki / ELK Stack (logging)

---

## 🔐 **Authentication & Authorization**

* Role-based access (STUDENT / FACULTY / ADMIN)
* JWT for secure session handling
* BCrypt hashing for passwords
* Rate limiting at NGINX level

---

## 🎯 **Core Functional Modules**

### 1. **Assessment Module**

* Timed tests
* Autosave answers
* Auto-submission on timeout

### 2. **Proctoring Module**

* Tab switch tracking
* Face-detection checks (optional)
* Proctoring score generation
* Alerts to faculty

### 3. **Plagiarism Engine**

Uses Jaccard similarity:

[
\text{Jaccard Similarity} = \frac{|A \cap B|}{|A \cup B|}
]

* Compares student code submissions
* Flags high similarity groups

### 4. **Analytics Module**

* Student performance graph
* Faculty class performance dashboard
* Question difficulty analysis

### 5. **Gamification Module**

* Award points
* Leaderboards (batch-wise and global)
* Badge system

---

## 🧪 **Installation & Setup**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/blackshort/EduQuest.git
cd EduQuest
```

### 2️⃣ Environment Variables

Each microservice includes a `.env.example` file. Copy & modify:

```bash
cp .env.example .env
```

### 3️⃣ Run Services with Docker Compose

```bash
docker-compose up --build
```

### 4️⃣ Access the Application

Open:

```
http://localhost:3000
```

---

## 📦 **Docker & Deployment**

### Build Images

```bash
docker build -t eduquest-auth ./services/auth
docker build -t eduquest-test ./services/test
```

### Push to Registry

```bash
docker push yourrepo/eduquest-auth
```

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

---

## 📈 **Monitoring & Observability**

* **Prometheus** scrapes service metrics
* **Grafana** shows dashboards
* **Loki / ELK** collects logs
* **Jaeger / OpenTelemetry** supports tracing

---

## 🧾 **API Documentation**

Auto-generated via Swagger or Redoc:

```
http://localhost:4000/api/docs
```

---

## 🧪 **Testing**

```bash
npm run test
npm run test:e2e
```

---

## 📚 **Folder Structure**

```
/services
    /auth
    /questions
    /tests
    /attempts
    /judge
    /proctoring
    /plagiarism
    /analytics
/frontend
/nginx
/k8s
/docs
```

---

## 🤝 **Contributing**

Pull requests and feature suggestions are welcome!

---

## 📜 **License**

MIT License © 2025 EduQuest Team

---
