# AI Observability Data Generator
<img width="1337" height="938" alt="Screenshot 2025-08-26 at 3 42 50 PM" src="https://github.com/user-attachments/assets/ccf23ef4-d230-4279-be4c-0cb30c66f669" />

Generate sample AI observability data for your Grafana dashboards using OpenLIT instrumentation. This workflow creates realistic LLM interactions and vector database operations with telemetry data.

## Get Your Grafana Cloud Credentials

Before running the workflow, you'll need your OTEL endpoint and headers from Grafana Cloud:

1. Sign in to [Grafana Cloud Portal](https://grafana.com/auth/sign-in/) and select your Grafana Cloud Stack
2. Click **Configure** in the OpenTelemetry section
3. In the **Password / API Token** section, click **Generate now** to create a new API token
4. Give the API token a name (e.g., `openlit`) and click **Create token**
5. Click **Close** without copying the token
6. Copy and save the values for:
   - `OTEL_EXPORTER_OTLP_ENDPOINT` 
   - `OTEL_EXPORTER_OTLP_HEADERS`
7. **Important**: Replace the space after `Basic` with `%20`:
   - Change: `Authorization=Basic [base64 instanceID:token]`
   - To: `Authorization=Basic%20[base64 instanceID:token]`

## Quick Start

1. Go to this repository's [Actions tab](https://github.com/grafana/grafana-aio11y-app/actions/workflows/data-generator.yml)
2. Select the **"AI Observability Data Generator"** workflow
3. Click **"Run workflow"**
4. Configure the required parameters:
   - **Data Type**: Choose `LLM`, `VectorDB`, or `All`
   - **OTEL Endpoint**: Your OpenTelemetry endpoint URL
     - Example: `https://otlp-gateway-prod-us-east-1.grafana.net/otlp`
   - **OTEL Headers**: Authorization headers for your OTEL endpoint
     - Example: `Authorization=Basic%20MTM1NDYzMzpnbGNfZXlK...`
     - > **Note**: Use `Basic%20` (URL-encoded) instead of `Basic ` (space) for Python compatibility
   - **OpenAI API Key**: Required for LLM data generation
     - Example: `sk-proj-vWip8ViUbMrF4jT2NTzX...`
   - **Anthropic API Key**: Optional, but recommended for richer data
     - Example: `sk-ant-api03-dubEWilWMGDog7Tv...`
5. Click **"Run workflow"**
6. The workflow runs for 10 minutes, generating data every 90 seconds - data should be visible in your dashboards within a few minutes of starting
7. View the generated data in your Grafana dashboards

> **Security**: API keys and sensitive headers are automatically masked from GitHub Actions logs :)

## What the Scripts Does

### [LLM Data Generator](./llm_data_generator.py)
Simulates real-world LLM interactions and evaluations:
- **OpenAI GPT-4 & GPT-3.5** completions with various prompts
- **Anthropic Claude** conversations and responses
- **AI Safety Evaluations**: Content quality, bias detection, factual accuracy
- **Performance Metrics**: Token usage, response times, costs
- Runs for 10 minutes, generating data every 90 seconds

### [Vector Database Generator](./vectordb_data_generator.py)  

- **ChromaDB**: Document embeddings, similarity searches, collections
- **Qdrant**: Vector insertions, filtered searches, point operations
- **Performance Data**: Query latencies, embedding times, memory usage
- **Realistic Workloads**: Document ingestion, semantic search patterns
- Runs for 10 minutes, generating data every 60 seconds

Both scripts use OpenLIT instrumentation to automatically capture telemetry data that flows to your Grafana dashboards.
