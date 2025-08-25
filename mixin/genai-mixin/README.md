# GenAI Observability Mixin

The GenAI Observability mixin is a configurable Grafana dashboard.

The GenAI Observability mixin contains the following dashboards:

- GenAI Observability
- GenAI Evaluations
- GPU Monitoring
- VectorDB Observability
- MCP Observability

## GenAI Observability Dashboard Overview
GenAI Observability dashboard provides details overall LLMs usage. The dashboard includes visualizations for requests, overall costs and token usage.

## GenAI Evaluations Dashboard Overview
GenAI Evaluations dashboard focuses on AI quality and safety metrics including hallucination detection, toxicity analysis, bias evaluation, and confidence scoring for AI-generated content.

## GPU Monitoring Dashboard Overview
GPU Monitoring dashboard provides detailed GPU performance statistics including temperature, utilization, memory usage, and fan speed monitoring across GPU instances.

## VectorDB Observability Dashboard Overview
VectorDB Observability dashboard monitors vector database performance with metrics for request volume, response times, database operations, and service-level analytics.

## MCP Observability Dashboard Overview
MCP (Model Context Protocol) Observability dashboard tracks tool usage analytics, transport types, method call patterns, and client distribution for MCP implementations.

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
