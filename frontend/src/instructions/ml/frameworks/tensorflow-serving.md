#  Monitor TensorFlow Serving 

## Install Grafana Agent

The Grafana agent collects observability data and sends it to Grafana Cloud. Once the agent is deployed to your hosts, it collects and sends Prometheus-style metrics and log data using a pared-down Prometheus collector.

Run this command to install and run Grafana Agent as a grafana-agent.service systemd service

```shell
ARCH="amd64" GCLOUD_HOSTED_METRICS_URL="https://prometheus[url]grafana.net/api/prom/push" GCLOUD_HOSTED_METRICS_ID="" GCLOUD_SCRAPE_INTERVAL="60s" GCLOUD_HOSTED_LOGS_URL="https://logs-[url].grafana.net/loki/api/v1/push" GCLOUD_HOSTED_LOGS_ID="" GCLOUD_RW_API_KEY="" /bin/sh -c "$(curl -fsSL https://storage.googleapis.com/cloud-onboarding/agent/scripts/static/install-linux.sh)"
```

## Prepare your agent configuration file

### Logs
Below `logs.configs.scrape_configs`, insert the following lines according to your environment.

```
- job_name: integrations/tensorflow
  relabel_configs:
    - source_labels: ['__meta_docker_container_name']
      replacement: tensorflow
      target_label: name
    - source_labels: ['__meta_docker_container_name']
      replacement: integrations/tensorflow
      target_label: job
    - source_labels: ['__meta_docker_container_name']
      replacement: '<your-instance-name>'
      target_label: instance
  docker_sd_configs:
    - host: unix:///var/run/docker.sock
      refresh_interval: 5s
      filters:
        - name: name
          values: [tensorflow]
```

### Metrics
Below `metrics.configs.scrape_configs`, insert the following lines and change the URLs according to your environment:

```
- job_name: integrations/tensorflow
  metrics_path: "/monitoring/prometheus/metrics"
  relabel_configs:
    - replacement: '<your-instance-name>'
      target_label: instance
  static_configs:
    - targets: ['localhost:8501']
  metric_relabel_configs:
  - action: keep
    regex: :tensorflow:core:graph_build_calls|:tensorflow:core:graph_build_time_usecs|:tensorflow:core:graph_run_time_usecs|:tensorflow:core:graph_runs|:tensorflow:serving:batching_session:queuing_latency_count|:tensorflow:serving:batching_session:queuing_latency_sum|:tensorflow:serving:request_count|:tensorflow:serving:request_latency_count|:tensorflow:serving:request_latency_sum|:tensorflow:serving:runtime_latency_count|:tensorflow:serving:runtime_latency_sum
    source_labels:
      - __name__
```

## Restart the agent

Once you’ve made changes to your agent configuration file, run the following command to restart the agent.

After installation, the Agent config is stored in /etc/grafana-agent.yaml. Restart the agent for any changes to take effect:

```shell
sudo systemctl restart grafana-agent.service
```
