// THIS MARKS THE INFRA SNIPPETS SECTION
export const dcgmSnippet = () => {
    return `helm repo add grafana https://grafana.github.io/helm-charts &&
    helm repo update &&
    helm upgrade --install --atomic --timeout 300s grafana-k8s-monitoring grafana/k8s-monitoring \
      --namespace "default" --create-namespace --values - <<EOF
  cluster:
    name: my-cluster
  externalServices:
    prometheus:
      host: https://prometheus-[url].grafana.net
      basicAuth:
        username: ""
        password: 
      host: https://logs-[url].grafana.net
      basicAuth:
        username: ""
        password:
    tempo:
      host: https://tempo-[url]grafana.net
      basicAuth:
        username: ""
        password: 
  metrics:
    enabled: true
    cost:
      enabled: true
    node-exporter:
      enabled: true
  logs:
    enabled: true
    pod_logs:
      enabled: true
    cluster_events:
      enabled: true
  traces:
    enabled: true
  opencost:
    enabled: true
    opencost:
      exporter:
        defaultClusterId: my-cluster
      prometheus:
        external:
          url: https://prometheus-[url].grafana.net/api/prom
  kube-state-metrics:
    enabled: true
  prometheus-node-exporter:
    enabled: true
  prometheus-operator-crds:
    enabled: true
  grafana-agent: {}
  grafana-agent-logs: {}
  EOF`
}

export const installDCGMExporter = () => {
  return  `  helm repo add gpu-helm-charts https://nvidia.github.io/dcgm-exporter/helm-charts
  helm repo update
  helm install --generate-name gpu-helm-charts/dcgm-exporter`
}

export const prepareAgentConfig = () => {
  return `scrape_configs:
  job_name: gpu-metrics
 scrape_interval: 1s
 metrics_path: /metrics
 scheme: http
 kubernetes_sd_configs:
  role: endpoints
     namespaces:
     names:
      gpu-operator
 relabel_configs:
  source_labels: [__meta_kubernetes_pod_node_name]
     action: replace
     target_label: kubernetes_node `
}
//  THIS ENDS THE INFRA SNIPPETS SECTION

// THIS MARKS THE LLM SNIPPETS SECTION
export const openLitConfiguration = () => {
  return`export OTEL_EXPORTER_OTLP_ENDPOINT = "https://otlp-gateway-[url].grafana.net/otlp"
export OTEL_EXPORTER_OTLP_HEADERS = "your-endpoint-header"`
}
// THIS ENDS LLM SNIPPETS SECTION


// THIS MARKS THE VECTOR DB SECTION
export const chromaDirectRun = () => {
  return`
  export CHROMA_OTEL_COLLECTION_ENDPOINT=https://otlp-gateway-[url].grafana.net/otlp
  export CHROMA_OTEL_SERVICE_NAME=chromadb
  export CHROMA_OTEL_COLLECTION_HEADERS=Authorization=""
  export CHROMA_OTEL_GRANULARITY=All`

}

export const chromaDockerContainer = () => {
  return `
docker run -e CHROMA_OTEL_COLLECTION_ENDPOINT=https://otlp-gateway-[url].grafana.net/otlp \
  -e CHROMA_OTEL_SERVICE_NAME=chromadb \
  -e CHROMA_OTEL_COLLECTION_HEADERS=Authorization="your-endpoint-header"\
  -e CHROMA_OTEL_GRANULARITY=All \
  your_chromadb_image`
}

export const chromaKubernetes = () => {
return`env:
- name: CHROMA_OTEL_COLLECTION_ENDPOINT
  value: "https://otlp-gateway-[url].grafana.net/otlp"
- name: CHROMA_OTEL_SERVICE_NAME
  value: "chromadb"
- name: CHROMA_OTEL_COLLECTION_HEADERS
  value: "your-header"
- name: CHROMA_OTEL_GRANULARITY
  value: "All"`
}

export const pineconeDownloadAlloy = () => {
  return`ARCH="amd64" GCLOUD_HOSTED_METRICS_URL="https://prometheus[url].grafana.net/api/prom/push" GCLOUD_HOSTED_METRICS_ID="" GCLOUD_SCRAPE_INTERVAL="60s" GCLOUD_HOSTED_LOGS_URL="https://[url].grafana.net/loki/api/v1/push" GCLOUD_HOSTED_LOGS_ID="" GCLOUD_RW_API_KEY="" /bin/sh -c "$(curl -fsSL https://storage.googleapis.com/cloud-onboarding/agent/scripts/static/install-linux.sh)"`
}

export const pineconeMetrics = () => {
  return`- job_name: pinecone
  authorization:
    credentials: 
  scheme: https
  static_configs:
    - targets: ['metrics.YOUR_ENVIRONMENT.pinecone.io/metrics']`
}
// THIS ENDS THE VECTOR DB SECTION

// THIS BEGINS ML FRAMEWORKS SECTION


export const grafanaAlloyPytorchServe = () => {
  return `ARCH="amd64" GCLOUD_HOSTED_METRICS_URL="https://prometheus[url].grafana.net/api/prom/push" GCLOUD_HOSTED_METRICS_ID="yourID" GCLOUD_SCRAPE_INTERVAL="60s" GCLOUD_HOSTED_LOGS_URL="https://logs[url].grafana.net/loki/api/v1/push" GCLOUD_HOSTED_LOGS_ID="yourID" GCLOUD_RW_API_KEY="" /bin/sh -c "$(curl -fsSL https://storage.googleapis.com/cloud-onboarding/agent/scripts/static/install-linux.sh)"`
}

export const mlPytorchScrapeConfig = () => {
  return `- job_name: 'torchserve'
  static_configs:
  - targets: ['localhost:8082'] #TorchServe metrics endpoint`
}

export const mlTensorflowScrapeConfig = () => {
  return `- job_name: integrations/tensorflow
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
          values: [tensorflow]`
}

export const mlTensorflowMetricsConfig = () => {
  return `- job_name: integrations/tensorflow
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
      - __name__`
}
