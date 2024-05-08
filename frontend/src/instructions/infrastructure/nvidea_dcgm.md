# Monitor Nvidea DCGM

## Install Alloy in Kubernetes

The Grafana Alloy collects observability data and sends it to Grafana Cloud. Once the Alloy is deployed to your hosts, it collects and sends Prometheus-style metrics and log data using a pared-down Prometheus collector.

Run this command to install and run Grafana Alloy in Kubernetes

```
helm install --namespace <NAMESPACE> <RELEASE_NAME> grafana/alloy
```

## Install DCGM Exporter   

The NVIDIA DCGM Exporter fetches metrics from GPUs and exposes them for collection. It's crucial for monitoring the performance and health of your GPUs within Kubernetes.

```
  helm repo add gpu-helm-charts https://nvidia.github.io/dcgm-exporter/helm-charts

  helm repo update

  helm install --generate-name gpu-helm-charts/dcgm-exporter
```

## Prepare your Alloy configuration file

Add the below snippet to your Alloy configuration
    
```alloy  
discovery.kubernetes "metrics_gpu_operator_gpu_metrics" {
	role = "endpoints"

	namespaces {
		names = ["gpu-operator"]
	}
}

discovery.relabel "metrics_gpu_operator_gpu_metrics" {
	targets = discovery.kubernetes.metrics_gpu_operator_gpu_metrics.targets

	rule {
		source_labels = ["__meta_kubernetes_pod_node_name"]
		target_label  = "kubernetes_node"
	}
}

prometheus.scrape "metrics_gpu_operator_gpu_metrics" {
	targets         = discovery.relabel.metrics_gpu_operator_gpu_metrics.output
	forward_to      = [prometheus.remote_write.metrics_gpu_operator.receiver]
	job_name        = "gpu-metrics"
	scrape_interval = "1s"
	scrape_timeout  = "1s"
}
```
