<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">
  <img alt="Subash Pandey, AI/ML Engineer in Kathmandu, working remotely. Production GenAI and ML systems, and the evaluation that keeps them honest. Beside it, a dot glides down a loss curve, swinging from side to side in smaller and smaller arcs until it settles at the minimum." src="assets/banner-light.svg" width="100%">
</picture>

<p align="center">
  <a href="https://subash-pandey.com"><img alt="subash-pandey.com" src="https://img.shields.io/badge/subash--pandey.com-116E9C?style=flat-square&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8%2BPHBhdGggZD0iTTEyIDJhMTQuNSAxNC41IDAgMCAwIDAgMjAgMTQuNSAxNC41IDAgMCAwIDAtMjAiLz48cGF0aCBkPSJNMiAxMmgyMCIvPjwvc3ZnPg%3D%3D" height="24"></a>
  <a href="https://www.linkedin.com/in/subash-pandey-ai/"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-116E9C?style=flat-square&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTExNiAzSDEyYTguOTEgOC45MSAwIDAwLTkgOC44djEwNC40MmE4LjkxIDguOTEgMCAwMDkgOC43OGgxMDRhOC45MyA4LjkzIDAgMDA5LTguODFWMTEuNzdBOC45MyA4LjkzIDAgMDAxMTYgM3pNMzkuMTcgMTA3SDIxLjA2VjQ4LjczaDE4LjExem0tOS02Ni4yMWExMC41IDEwLjUgMCAxMTEwLjQ5LTEwLjUgMTAuNSAxMC41IDAgMDEtMTAuNTQgMTAuNDh6TTEwNyAxMDdIODguODlWNzguNjVjMC02Ljc1LS4xMi0xNS40NC05LjQxLTE1LjQ0cy0xMC44NyA3LjM2LTEwLjg3IDE1VjEwN0g1MC41M1Y0OC43M2gxNy4zNnY4aC4yNGMyLjQyLTQuNTggOC4zMi05LjQxIDE3LjEzLTkuNDFDMTAzLjYgNDcuMjggMTA3IDU5LjM1IDEwNyA3NXoiLz48L3N2Zz4%3D" height="24"></a>
  <a href="mailto:axlesubash111@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Email-116E9C?style=flat-square&logo=gmail&logoColor=white" height="24"></a>
  <a href="https://cal.com/subash-pandey/intro"><img alt="Book a call" src="https://img.shields.io/badge/Book_a_call-116E9C?style=flat-square&logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDJ2NCIvPjxwYXRoIGQ9Ik0xNiAydjQiLz48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIi8%2BPHBhdGggZD0iTTMgMTBoMTgiLz48L3N2Zz4%3D" height="24"></a>
</p>

I build production GenAI and ML systems, from retrieval pipelines to the cloud-native infrastructure they run on. Most of my recent work sits where a model's confidence stops matching its correctness, and I like building the evaluation that catches that before deployment rather than after.

- **Now:** AI/ML Engineer at **Scopic Software** (remote, since Oct 2024), building GenAI chatbots on LangGraph, RAG and Qdrant, plus the evaluation pipelines that track hallucination rate, accuracy, cost and latency
- **Learning:** system design and cloud-native development
- **Open to:** collaborating on RAG, agents and applied ML
- **Ask me about:** GenAI, RAG and Python

## Selected work

### Knowing when not to trust the model

**[PageAnchor](https://github.com/notsubash/PageAnchor)**<br>
Document Q&A where every answer cites a verifiable region of the page, or refuses. Hybrid text and visual retrieval for layout-heavy PDFs with strict quote verification, shipped as a CLI, an API, an MCP server and a Next.js UI that overlays the cited region.<br>
<sub>ColPali · LanceDB · sentence-transformers · FastAPI · MCP</sub>

**[Activity-Recognition](https://github.com/notsubash/Activity-Recognition)** · [write-up](https://www.subash-pandey.com/blog/activity-recognition-pipeline) · [model](https://huggingface.co/axlesubash/wisdm-watch-stat-xgb)<br>
Subject-independent activity recognition on WISDM, 18 classes. A leaky split scores **0.89** macro-F1; holding out whole subjects drops the same setup to **0.29**. The project builds an evaluation that can't hide that gap, then serves the honest best (watch-sensor XGBoost, 0.70) from a CPU FastAPI service.<br>
<sub>XGBoost · ONNX · MLflow · FastAPI</sub>

**[latent-parking](https://github.com/notsubash/latent-parking)** · [write-up](https://www.subash-pandey.com/blog/when-a-self-parking-car-cannot-trust-its-imagination)<br>
A parking planner that imagines a few seconds ahead, built to measure when that imagination can be trusted. CEM on the true dynamics reaches the parking-v0 success check; learned latent MPC parks **0 of 6** measured seeds, and the distrust signals (residual, disagreement, imagined spread) sit at chance for spotting a crash ahead. The write-up reports that negative result in full.<br>
<sub>PyTorch · JEPA · CEM · MPC · highway-env</sub>

### Agents and infrastructure

**[Gavel](https://github.com/notsubash/Gavel)** · [write-up](https://www.subash-pandey.com/blog/building-an-idea-workbench)<br>
A workspace for pressure-testing startup ideas: collect evidence, then run five parallel judges and a structured LangGraph debate, with readiness gates, versioned worksheets and a FastAPI SSE run engine on a durable SQLite event log.<br>
<sub>LangGraph · FastAPI · Next.js · SQLite</sub>

**[cloud-native-AI-platform](https://github.com/notsubash/cloud-native-AI-platform)** · [write-up](https://www.subash-pandey.com/blog/building-a-cloud-native-ai-platform)<br>
A cost-bounded AI summarization platform: FastAPI on Kubernetes with Helm, Terraform on Hetzner, GitOps through Argo CD, and Prometheus, Grafana and Loki for observability. Runs for under $15 a month.<br>
<sub>Kubernetes · Helm · Terraform · Argo CD · Prometheus · Grafana · Loki</sub>

### Teaching

**[The Underlying Curve](https://www.instagram.com/theunderlyingcurve/)** · [about the series](https://www.subash-pandey.com/projects/the-underlying-curve)<br>
Silent explainers of data science, ML and AI where the animation does the teaching. One object per video: scenes in Manim, encodes and platform crops in FFmpeg.<br>
<sub>Manim · FFmpeg · Python</sub>

More in [my repositories →](https://github.com/notsubash?tab=repositories)

## Open source

Merged into [vshulcz/deja-vu](https://github.com/vshulcz/deja-vu) (Go, 1.2k ★), local memory for coding agents built from the session history already on disk:

- [#5108](https://github.com/vshulcz/deja-vu/pull/5108) A rollout waiting for zstd no longer rewrites the index on every pass
- [#5065](https://github.com/vshulcz/deja-vu/pull/5065) Brought the docs in line with the code in a dozen places
- [#5031](https://github.com/vshulcz/deja-vu/pull/5031), [#5239](https://github.com/vshulcz/deja-vu/pull/5239), [#5240](https://github.com/vshulcz/deja-vu/pull/5240) Shell completion fixes: PowerShell offers every `--role`, `stats` offers `--year`, `--quiet` goes to `index` rather than `search`, and subcommand cases

The full list lives in [OSS-contributions](https://github.com/notsubash/OSS-contributions).

## Stack

<table>
  <tr>
    <td><b>GenAI / LLM</b></td>
    <td>
      <img alt="LangGraph" src="https://img.shields.io/badge/LangGraph-1e2226?style=flat-square&logo=langgraph&logoColor=white">
      <img alt="LangChain" src="https://img.shields.io/badge/LangChain-1e2226?style=flat-square&logo=langchain&logoColor=white">
      <img alt="Ollama" src="https://img.shields.io/badge/Ollama-1e2226?style=flat-square&logo=ollama&logoColor=white">
      <img alt="Qdrant" src="https://img.shields.io/badge/Qdrant-1e2226?style=flat-square&logo=qdrant&logoColor=white">
      <img alt="Hugging Face" src="https://img.shields.io/badge/Hugging_Face-1e2226?style=flat-square&logo=huggingface&logoColor=FFD21E">
      <img alt="MCP" src="https://img.shields.io/badge/MCP-1e2226?style=flat-square&logo=modelcontextprotocol&logoColor=white">
      <img alt="Langfuse" src="https://img.shields.io/badge/Langfuse-1e2226?style=flat-square">
    </td>
  </tr>
  <tr>
    <td><b>ML / data</b></td>
    <td>
      <img alt="PyTorch" src="https://img.shields.io/badge/PyTorch-1e2226?style=flat-square&logo=pytorch&logoColor=EE4C2C">
      <img alt="scikit-learn" src="https://img.shields.io/badge/scikit--learn-1e2226?style=flat-square&logo=scikitlearn&logoColor=F7931E">
      <img alt="pandas" src="https://img.shields.io/badge/pandas-1e2226?style=flat-square&logo=pandas&logoColor=white">
      <img alt="NumPy" src="https://img.shields.io/badge/NumPy-1e2226?style=flat-square&logo=numpy&logoColor=white">
      <img alt="OpenCV" src="https://img.shields.io/badge/OpenCV-1e2226?style=flat-square&logo=opencv&logoColor=white">
      <img alt="ONNX" src="https://img.shields.io/badge/ONNX-1e2226?style=flat-square&logo=onnx&logoColor=white">
      <img alt="MLflow" src="https://img.shields.io/badge/MLflow-1e2226?style=flat-square&logo=mlflow&logoColor=0194E2">
      <img alt="Streamlit" src="https://img.shields.io/badge/Streamlit-1e2226?style=flat-square&logo=streamlit&logoColor=FF4B4B">
      <img alt="Gradio" src="https://img.shields.io/badge/Gradio-1e2226?style=flat-square&logo=gradio&logoColor=F97316">
    </td>
  </tr>
  <tr>
    <td><b>Languages & backend</b></td>
    <td>
      <img alt="Python" src="https://img.shields.io/badge/Python-1e2226?style=flat-square&logo=python&logoColor=3776AB">
      <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-1e2226?style=flat-square&logo=typescript&logoColor=3178C6">
      <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-1e2226?style=flat-square&logo=javascript&logoColor=F7DF1E">
      <img alt="Bash" src="https://img.shields.io/badge/Bash-1e2226?style=flat-square&logo=gnubash&logoColor=4EAA25">
      <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-1e2226?style=flat-square&logo=fastapi&logoColor=009688">
      <img alt="Flask" src="https://img.shields.io/badge/Flask-1e2226?style=flat-square&logo=flask&logoColor=3BABC3">
      <img alt="Django" src="https://img.shields.io/badge/Django-1e2226?style=flat-square&logo=django&logoColor=white">
      <img alt="Node.js" src="https://img.shields.io/badge/Node.js-1e2226?style=flat-square&logo=nodedotjs&logoColor=5FA04E">
      <img alt="React" src="https://img.shields.io/badge/React-1e2226?style=flat-square&logo=react&logoColor=61DAFB">
      <img alt="Next.js" src="https://img.shields.io/badge/Next.js-1e2226?style=flat-square&logo=nextdotjs&logoColor=white">
    </td>
  </tr>
  <tr>
    <td><b>Cloud & infra</b></td>
    <td>
      <img alt="Google Cloud" src="https://img.shields.io/badge/Google_Cloud-1e2226?style=flat-square&logo=googlecloud&logoColor=4285F4">
      <img alt="Docker" src="https://img.shields.io/badge/Docker-1e2226?style=flat-square&logo=docker&logoColor=2496ED">
      <img alt="Kubernetes" src="https://img.shields.io/badge/Kubernetes-1e2226?style=flat-square&logo=kubernetes&logoColor=326CE5">
      <img alt="Helm" src="https://img.shields.io/badge/Helm-1e2226?style=flat-square&logo=helm&logoColor=white">
      <img alt="Terraform" src="https://img.shields.io/badge/Terraform-1e2226?style=flat-square&logo=terraform&logoColor=white">
      <img alt="Argo CD" src="https://img.shields.io/badge/Argo_CD-1e2226?style=flat-square&logo=argo&logoColor=EF7B4D">
      <img alt="Prometheus" src="https://img.shields.io/badge/Prometheus-1e2226?style=flat-square&logo=prometheus&logoColor=E6522C">
      <img alt="Grafana" src="https://img.shields.io/badge/Grafana-1e2226?style=flat-square&logo=grafana&logoColor=F46800">
      <img alt="Serverless" src="https://img.shields.io/badge/Serverless-1e2226?style=flat-square&logo=serverless&logoColor=FD5750">
      <img alt="AWS" src="https://img.shields.io/badge/AWS-1e2226?style=flat-square">
    </td>
  </tr>
  <tr>
    <td><b>Data stores</b></td>
    <td>
      <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-1e2226?style=flat-square&logo=postgresql&logoColor=4169E1">
      <img alt="MySQL" src="https://img.shields.io/badge/MySQL-1e2226?style=flat-square&logo=mysql&logoColor=4479A1">
      <img alt="Redis" src="https://img.shields.io/badge/Redis-1e2226?style=flat-square&logo=redis&logoColor=FF4438">
      <img alt="SQLite" src="https://img.shields.io/badge/SQLite-1e2226?style=flat-square&logo=sqlite&logoColor=white">
      <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-1e2226?style=flat-square&logo=mongodb&logoColor=47A248">
      <img alt="Firebase" src="https://img.shields.io/badge/Firebase-1e2226?style=flat-square&logo=firebase&logoColor=DD2C00">
      <img alt="OpenSearch" src="https://img.shields.io/badge/OpenSearch-1e2226?style=flat-square&logo=opensearch&logoColor=white">
    </td>
  </tr>
</table>

<sub>Also worked with: XGBoost · LanceDB · ColPali · NetworkX · Gephi · Matplotlib · Seaborn · Tableau · Grafana Loki · Stripe · Redux · Chart.js · Postman · HTML/CSS</sub>

<p align="center"><sub>Fun fact: I refactor life decisions.</sub></p>
