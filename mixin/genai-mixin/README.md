# GenAI Observability Mixin

The GenAI Observability mixin is a configurable Grafana dashboard.

The GenAI Observability mixin contains the following dashboard:

- GenAI Observability

## GenAI Observability Dashboard Overview
GenAI Observability dashboard provides details overall LLMs and VectorDB usage. The dashboard includes visualizations for requests, overall costs and token usage. The dashboard is sourced from https://docs.openlit.io/latest/connections/grafanacloud#dashboard

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