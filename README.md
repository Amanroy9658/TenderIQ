# TenderIQ 🚀

An **Agentic AI System** designed to solve a critical enterprise problem: determining if a company is realistically qualified to bid on a complex tender/RFP.

TenderIQ goes beyond simple "document summarization". It acts as an **Investigation and Qualification Engine** that automatically cross-references strict tender requirements against distributed company evidence (financials, certifications, past project records).

---

## 🎯 The Core Problem
Companies receive massive tender documents filled with eligibility, financial, technical, and compliance requirements distributed across hundreds of pages.
Proving eligibility requires a human to manually dig through disjointed company records (audit reports, ISO certificates, project completion records) to prove they meet the exact thresholds (e.g. "Average turnover > 50Cr in the last 3 years"). 

This manual cross-referencing is error-prone, slow, and expensive.

## 💡 Our Solution
TenderIQ automates this qualification mapping using structured AI extraction.
1. **Requirement Extraction**: Parses the Tender PDF to generate strict, deterministic JSON schemas representing each requirement (e.g. `metric: annual_turnover`, `operator: >=`, `threshold: 50Cr`).
2. **Evidence Ingestion**: Parses company documents to extract verified facts.
3. **Agentic Matching**: Uses LLMs to evaluate if the extracted facts satisfy the tender requirements, assigning a strict `PASS`, `FAIL`, or `NEEDS_REVIEW`.
4. **Impact Analysis**: Generates actionable recommendations to improve qualification scores (e.g. "Upload audit report for FY22 to prove 50Cr turnover").

## 🏗️ Architecture Stack
We built a monorepo containing a full-stack, decoupled architecture:
- **Frontend**: Next.js 14 App Router, TailwindCSS, shadcn/ui.
- **Backend**: NestJS, PostgreSQL, Prisma ORM.
- **AI Orchestration**: Structured outputs via Zod mapping to OpenAI `gpt-4o`.
- **Infrastructure**: Dockerized PostgreSQL, NPM Workspaces.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for PostgreSQL)
- OpenAI API Key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Amanroy9658/TenderIQ.git
   cd TenderIQ
   \`\`\`

2. **Start the Database**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

4. **Environment Configuration**
   Create an `.env` file in `apps/backend/` and add your database URL and API key:
   \`\`\`env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/tenderiq?schema=public"
   OPENAI_API_KEY="sk-..."
   \`\`\`

5. **Run Migrations & Seed Baseline Data**
   \`\`\`bash
   cd apps/backend
   npx prisma db push
   npx prisma generate
   npm run prisma:seed
   cd ../..
   \`\`\`

6. **Start the Application**
   \`\`\`bash
   npm run dev
   \`\`\`
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001

## 📁 Key Features Implemented (Hackathon Scope)
- [x] Document Parsing Engine (`pdf-parse`)
- [x] Structured AI Extraction Pipelines (`zod-to-json-schema`)
- [x] Evidence Matching Service (`PASS`, `FAIL`, `NEEDS_REVIEW`)
- [x] Deterministic Qualification Score Calculator
- [x] Human-in-the-Loop Verification API
- [x] Decision Impact Analyzer (Actionable Recommendations)
- [x] Agent Trajectory API (View AI reasoning paths)
- [x] Baseline Seed Scripts
- [x] Evaluation Harness (`npm run evaluate`)
- [x] Modern Dashboard Shell (Next.js + Tailwind)

## ⚖️ Design Philosophy
- **Evidence-First**: No arbitrary LLM scoring. Everything requires a deterministic link back to a snippet in a specific document.
- **Auditable**: The AI's step-by-step reasoning is stored in `AgentTrajectory` for full transparency.
- **Extensible**: Built with NestJS modules to easily swap LLM providers or add LangGraph state-machines for multi-agent workflows in the future.
