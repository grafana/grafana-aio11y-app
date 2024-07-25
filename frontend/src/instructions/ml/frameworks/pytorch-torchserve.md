#  Monitor PyTorch TorchServe 

## Install Grafana Alloy

The Grafana Alloy collects observability data and sends it to Grafana Cloud. Once the Alloy is deployed to your hosts, it collects and sends Prometheus-style metrics and log data using a pared-down Prometheus collector.

### Set up the Alloy configuration

```shell
ARCH="amd64" GCLOUD_HOSTED_METRICS_URL="" GCLOUD_HOSTED_METRICS_ID="your-id" GCLOUD_SCRAPE_INTERVAL="60s" GCLOUD_HOSTED_LOGS_URL="" GCLOUD_HOSTED_LOGS_ID="" GCLOUD_RW_API_KEY="glc_xxx" /bin/sh -c "$(curl -fsSL https://storage.googleapis.com/cloud-onboarding/alloy/scripts/install-linux-binary.sh)"
```

## Run Alloy

```shell
./alloy-linux-amd64 run ./config.alloy
```

## Prepare your Alloy configuration file

### Metrics

Add the below snippet to your Alloy configuration

```alloy
prometheus.scrape "metrics_torch_serve_torchserve" {
	targets = [{
		__address__ = "localhost:8082",
	}]
	forward_to = [prometheus.remote_write.metrics_torch_serve.receiver]
	job_name   = "torchserve"
}
```

## Restart Alloy

Once you’ve made changes to your Alloy configuration file, run the following command to restart the Alloy.

```shell
./alloy-linux-amd64 run ./config.alloy
```