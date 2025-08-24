# AI Observability Data Generator

This directory contains GitHub Actions workflows and scripts to generate mock data with OpenLIT instrumentation for LLM and Vector Database operations, perfect for demonstrating dashboards and observability features.

## 🚀 Quick Start

1. Go to your repository's **Actions** tab
2. Select the **"AI Observability Data Generator"** workflow
3. Click **"Run workflow"**
4. Configure the parameters and click **"Run workflow"**

## 📋 Workflow Parameters

### Required Parameters

- **Mock Type**: Choose what mock data to generate
  - `llm` - Generate LLM mock data (OpenAI & Anthropic interactions)
  - `vectordb` - Generate Vector Database mock data (ChromaDB & Qdrant operations)
  - `both` - Generate both LLM and Vector Database mock data

- **OTEL Endpoint**: Your OpenTelemetry endpoint URL
  - Example: `https://otlp-gateway-prod-us-east-1.grafana.net/otlp`

- **OTEL Headers**: Authorization headers for OTEL endpoint
  - Example: `Authorization=Basic <your-base64-encoded-credentials>`

### Optional Parameters

- **Service Name**: Service name (default: `ai-observability-data`)
- **Deployment Environment**: Environment name (default: `demo`)
- **OpenAI API Key**: Your OpenAI API key (optional but recommended)
- **Anthropic API Key**: Your Anthropic API key (optional but recommended)

### API Key Requirements

For LLM mock data generation:
- **At least one API key** (OpenAI or Anthropic) is required
- If both are provided, both providers will be used
- If only one is provided, only that provider will generate data

For Vector Database mock data:
- No API keys required (uses in-memory databases)

## ⏱️ Generation Duration

- Both generators run for **exactly 10 minutes** then automatically exit
- LLM mock data cycles every **90 seconds**
- Vector Database mock data cycles every **60 seconds**

## 🔍 What Gets Generated

### LLM Mock Data (`llm_data_generator.py`)
- **OpenAI GPT-4** interactions with evaluations
- **Anthropic Claude** interactions with evaluations  
- **Evaluation demonstration scenarios** showcasing:
  - Content quality assessment
  - Factual accuracy checking
  - Bias detection capabilities
- Sample AI monitoring and governance scenarios

### Vector Database Mock Data (`vectordb_data_generator.py`)
- **ChromaDB** operations:
  - Collection creation/management
  - Document insertion and retrieval
  - Similarity search queries
  - Performance demonstrations
- **Qdrant** operations:
  - Collection creation/management
  - Point insertion and retrieval  
  - Vector search with filters
  - Performance demonstrations

## 📊 Environment Variables

The scripts automatically read these standard OTEL environment variables:

```bash
# Standard OTEL Configuration (set by workflow)
OTEL_SERVICE_NAME=your-service-name
OTEL_DEPLOYMENT_ENVIRONMENT=your-environment
OTEL_EXPORTER_OTLP_ENDPOINT=your-otel-endpoint
OTEL_EXPORTER_OTLP_HEADERS=your-otel-headers

# API Keys (set by workflow if provided)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

## 🔒 Security Notes

- API keys are handled as workflow inputs and set as environment variables
- Never commit API keys to your repository
- Use GitHub Secrets for sensitive values in production workflows

## 📂 **Directory Structure**

Following GitHub best practices, all workflow-related files are organized here:

```
.github/
├── workflows/
│   └── data-generator.yml         # GitHub Actions workflow
└── scripts/                       # Scripts and dependencies
    ├── llm_data_generator.py  # LLM mock data generator
    ├── vectordb_data_generator.py # Vector DB mock data generator
    ├── requirements.txt            # Python dependencies
    └── README.md                   # This documentation
```

## 🛠️ Local Generation

You can also run these scripts locally:

```bash
# Navigate to scripts directory
cd .github/scripts

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OTEL_SERVICE_NAME="local-mock-data"
export OTEL_DEPLOYMENT_ENVIRONMENT="demo"
export OTEL_EXPORTER_OTLP_ENDPOINT="your-endpoint"
export OTEL_EXPORTER_OTLP_HEADERS="your-headers"
export OPENAI_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"

# Generate LLM mock data
python llm_data_generator.py

# Generate Vector DB mock data  
python vectordb_data_generator.py
```

## 📈 Monitoring

All generated mock data will be visible in:
- Your Grafana dashboards
- GitHub Actions workflow logs
- OpenTelemetry traces and metrics

## 🐛 Troubleshooting

### Common Issues

1. **"At least one API key must be provided"**
   - Ensure either OpenAI or Anthropic API key is provided for LLM mock data generation

2. **OTEL connection errors**
   - Verify your OTEL endpoint URL and headers are correct
   - Check network connectivity from GitHub Actions runners

3. **Dependency installation failures**
   - Check the `requirements.txt` file for version conflicts
   - May need to update package versions

### Workflow Logs

Check the GitHub Actions logs for detailed execution information:
- Navigate to Actions → AI Observability Data Generator → [workflow run]
- Expand job steps to see detailed logs
- Look for error messages and stack traces

## 🔄 Workflow Status

- ✅ **Success**: All mock data generation completed within 10 minutes
- ❌ **Failure**: Generation failed or timed out
- ⏱️ **Timeout**: Workflow exceeded 12-minute limit (includes 2-minute buffer)

The workflow automatically times out at 10 minutes for the actual generation, with a 12-minute job-level timeout as safety buffer.
