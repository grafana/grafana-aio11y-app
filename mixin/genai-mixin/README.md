# GenAI Observability Mixin

The GenAI Observability mixin is a configurable Grafana dashboard.

The mixin provides monitoring with 5 specialized dashboards:

### 1. GenAI Observability
Main dashboard for LLM monitoring including:
- Request volume, success rates, and cost analysis
- Token consumption and generation metrics
- Response time distribution and latency tracking
- Model usage comparisons and platform analytics

<details>
  <summary>GenAI Observability Dashboard Screenshots</summary>
    <img width="1489" height="647" alt="genai-observability-1" src="https://github.com/user-attachments/assets/0e2d60f9-9a6d-4109-9b99-2d5b939b737b" />
    <img width="1490" height="608" alt="genai-observability-2" src="https://github.com/user-attachments/assets/3c881192-2335-4c3b-8da7-239d7a0cef55" />
    <img width="1487" height="611" alt="genai-observability-3" src="https://github.com/user-attachments/assets/b8ef0985-48ba-4560-b25f-bbc2eaa5453d" />
    <img width="1485" height="601" alt="genai-observability-4" src="https://github.com/user-attachments/assets/512247af-6c7d-499e-974d-5549b0649de6" />
    <img width="1489" height="607" alt="genai-observability-5" src="https://github.com/user-attachments/assets/9c0420c1-973a-49a1-996d-4d5488f22af3" />
    <img width="1484" height="641" alt="genai-observability-6" src="https://github.com/user-attachments/assets/73b199f4-63e0-4e47-8f67-84b76cbf48b8" />
    <img width="1492" height="608" alt="genai-observability-7" src="https://github.com/user-attachments/assets/1feb9d29-1d75-49eb-9760-9feee90553f0" />
</details>

### 2. GenAI Evaluations
AI quality and safety evaluation dashboard covering:
- Hallucination detection and classification
- Toxicity and bias analysis
- Evaluation verdicts and confidence scoring
- Problem identification and explanations

<details>
  <summary>GenAI Evaluations Dashboard Screenshots</summary>
    <img width="1491" height="691" alt="genai-evaluations-1" src="https://github.com/user-attachments/assets/2c16a98c-6fdc-47e0-b1b8-eca768f0e4b5" />
    <img width="1489" height="689" alt="genai-evaluations-2" src="https://github.com/user-attachments/assets/5311357b-50c6-4e4e-b8a3-05f83dfb689d" />
    <img width="1491" height="651" alt="genai-evaluations-3" src="https://github.com/user-attachments/assets/312c5722-6882-4459-abb4-b12ba59290cb" />
    <img width="1492" height="651" alt="genai-evaluations-4" src="https://github.com/user-attachments/assets/943bc3e5-97a1-4780-90f8-4776e74e9091" />
</details>

### 3. VectorDB Observability
Vector database performance monitoring:
- Request volume and response time trends
- Database operation analytics
- Success rates and latency distribution
- Service and environment breakdowns

<details>
  <summary>VectorDB Observability Dashboard Screenshots</summary>
    <img width="1492" height="780" alt="vectordb-observability-1" src="https://github.com/user-attachments/assets/8d2f541e-1e82-41d5-8910-bc21fe76466f" />
    <img width="1492" height="649" alt="vectordb-observability-2" src="https://github.com/user-attachments/assets/3380f35a-8c93-4aef-84a3-d64886d1abd5" />
    <img width="1492" height="651" alt="vectordb-observability-3" src="https://github.com/user-attachments/assets/92b668d9-5c35-44ca-b549-868a44a82722" />
    <img width="1487" height="652" alt="vectordb-observability-4" src="https://github.com/user-attachments/assets/d112c062-acf1-4a1c-9d6d-e568c6dd1e58" />
</details>

### 4. MCP Observability
Model Context Protocol monitoring dashboard:
- Tool usage analytics and health metrics
- Transport type and client distribution
- Method call patterns and performance
- Payload sizes and failure analysis

<details>
  <summary>MCP Observability Dashboard Screenshots</summary>
    <img width="1490" height="610" alt="mcp-observability-2" src="https://github.com/user-attachments/assets/d9a49ef6-c67c-4125-b954-782ce0ec6dd9" />
    <img width="1490" height="652" alt="mcp-observability-1" src="https://github.com/user-attachments/assets/cdc78a9c-e3e9-4304-85d6-7333bc21d1a9" />
    <img width="1492" height="607" alt="mcp-observability-3" src="https://github.com/user-attachments/assets/9ebcab87-b007-4667-afe8-c44b737377a2" />
    <img width="1493" height="611" alt="mcp-observability-4" src="https://github.com/user-attachments/assets/6e55c43a-8839-4505-8a1f-550b894bcc36" />
</details>

### 5. GPU Monitoring
Hardware monitoring for GPU infrastructure:
- GPU utilization and temperature tracking
- Memory usage and fan speed monitoring
- Performance metrics across GPU instances

## Tools
To use them, you need to have `mixtool` and `jsonnetfmt` installed. If you have a working Go development environment, it's easiest to run the following:

```bash
$ go get github.com/monitoring-mixins/mixtool/cmd/mixtool
$ go get github.com/google/go-jsonnet/cmd/jsonnetfmt
```

You can then build a directory `dashboard_out` with the JSON dashboard files for Grafana:

```bash
$ make build
```

For more advanced uses of mixins, see [Prometheus Monitoring Mixins docs](https://github.com/monitoring-mixins/docs).
