# GPU Observability Mixin

The GPU Observability mixin is a configurable Grafana dashboard.

The GPU Observability mixin contains the following dashboard:

- GPU Observability

## GPU Observability Dashboard Overview
GPU Observability dashboard provides details overall GPU performance stats like temperature, Utilizatio and more. The dashboard is sourced from https://docs.openlit.io/latest/connections/grafanacloud#gpu-dashboard

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