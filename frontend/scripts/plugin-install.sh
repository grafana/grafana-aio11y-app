#!/usr/bin/env bash

# Installs and provisions specific version of the plugin in a single instance by calling
# https://grafana.com/api/instances/[INSTANCE_ID]/provisioned-plugins/[PLUGIN_ID]

set -euo pipefail

usage() {
	cat <<EOF
deploy-single-instance.sh <cmd> <instance> <environment>
  Set plugin URL Templates and/or version on specific instance to test
  your plugin before wider release via grafana.com provisioned-plugins api.
Environment variables:
  GCOM_TOKEN or ./gcom.token:                     A staff grafana.com API token if environment=prod
  GCOM_DEV_TOKEN or ./gcom-dev.token:             A staff grafana-dev.com API token if environment=dev
  GCOM_OPS_TOKEN or ./gcom-ops.token:             A staff grafana-ops.com API token if environment=ops
  VERSION or ./version or package.json version:   Plugin version (e.g. 2.1.0)
  COMMIT_SHA:                                     Full SHA commit (e.g. a516a942d984115b524688ee3fd82d68287de7b4)
Parameters:
  cmd:
    install         Install specific version of the plugin to the requested instance
    status          Check whether the given instance has custom installation or not
    reset           Remove a previously applied version override on a specific instance
                    (doesn't uninstall or de-configure the plugin)
  instance:         the name of the instance where will be provisioned the specific plugin version
  environment:
    dev             It will provisioned the plugin on a dev instance
    ops             It will provisioned the plugin on a ops instance
    prod            It will provisioned the plugin on a prod instance
EOF
exit 1
}
PLUGIN_ID=$(cat "`dirname $0`"/../src/plugin.json | jq -r '.id')
environment="${3:-prod}"
environment=$(echo "${environment}" | awk '{ print tolower($0); }')

fail() {
	echo error: "$@" 1>&2
	exit 1
}

get_token_name() {
	[[ "${environment}" == 'prod' ]] && echo "GCOM_TOKEN" || echo "GCOM_${environment^^}_TOKEN"
}

get_token_value() {
	token_env_name=$(get_token_name)
	echo "${!token_env_name}"
}

get_base_api() {
	domain_suffix=$([[ "${environment}" == 'prod' ]] && echo "" || echo "-${environment}")
	echo "https://grafana${domain_suffix}.com/api"
}

ensure_token() {
	token_env_name=$(get_token_name)
	token_env_value=$(get_token_value)
	token_file=$([[ "${environment}" == 'prod' ]] && echo "gcom.token" || echo "gcom-${environment}.token")

	if [[ -z "${token_env_value:-}" ]]; then
		if [[ -f "${token_file}" ]]; then
			export "${token_env_name}"="$(cat "${token_file}")"
		else
			fail "need an API key in ${token_env_name} or ./${token_file}"
		fi
	fi
}

ensure_tools() {
	hash curl 2>/dev/null || fail "curl not found"
	hash jq 2>/dev/null || fail "jq not found"
}

ensure_version() {
	if [ -z "${VERSION:-}" ]; then
		if [ -f version ]; then
			VERSION=$(cat version)
		else
		  # take the version property of the package.json file by default
		  VERSION=$(cat package.json | jq -r '.version')
		fi
	fi
}

ensure_commit_sha() {
	if [ -z "${COMMIT_SHA:-}" ]; then
		fail "need a commit sha value in \$COMMIT_SHA"
	fi
}

# Curl-based client for the GCom API.
# First parameter is the API path to be invoked. Any subsequent
# parameter will be passed as-is to the curl binary.
gcom() {
	instance=${1}
	token=$(get_token_value)
	url=$(get_base_api)
	shift
	ret=$(curl -s -H "Authorization: Bearer ${token}" "${url}${instance}" "$@")
	if [[ "${ret}" = "true" ]]; then
		echo true
		return
	fi
	code=$(echo "${ret}" | jq '.code' | jq --raw-output 'select(type == "string")')
  msg=$(echo "${ret}" | jq '.message' | jq --raw-output 'select(type == "string")')

  if [[ -z "${code}" && -z "${msg}" ]]; then
    echo "$ret"
  else
    fail "${code}: ${msg}"
  fi
}

# Returns the current json configuration for the plugin installed
# on a Grafana instance.
# First parameter is the Grafana instance slug.
get_plugin_info() {
	gcom "/instances/$1/provisioned-plugins/${PLUGIN_ID}"
}

# Return commit_sha if a particular version was installed previously
# First parameter is the url installed.
get_existing_commit_sha() {
  match="^https://storage.googleapis.com/integration-artifacts/${PLUGIN_ID}/.*/main/.*/${PLUGIN_ID}-.*.zip$"
  if echo "${1}" | grep --quiet "${match}"; then
    commit_sha=$(echo "${1}" | grep "${match}" | sed -e "s/.*\/main\/\(.*\)\/${PLUGIN_ID}.*/\1/")

    if [[ "${commit_sha}" != "latest" ]]; then
      echo "${commit_sha}"
    else
      echo "UNMANAGED"
    fi
  else
    echo "UNMANAGED"
  fi
}

# Fetch the "status" for a given Grafana slug. In this context
# what we mean by status is a description of whether we've interacted
# with the instance via this script before.
# Status can be:
#   managed -> we've installed/updated the plugin with this script before
#   unmanaged -> we haven't installed/updated the plugin with this script before
instance_status() {
  echo "...Checking status of $PLUGIN_ID plugin for $environment instance $1"
  pluginInfo=$(get_plugin_info "$1")
  current_url=$(echo "${pluginInfo}" | jq -r .url)
  current_version=$(echo "${pluginInfo}" | jq -r .version)
	current_commit_sha=$(get_existing_commit_sha "${current_url}")

	if [[ ! -z "$current_url" && "${current_commit_sha}" != "UNMANAGED" ]]; then
	  echo managed version "${current_version}"
	else
		echo unmanaged
	fi
}

# Call the provisioned-plugins api to install a particular version
# and no manage the result
# First parameter is the Grafana instance slug.
update_version() {
	instance="$1"
	urlToUpdate="${2-}"
	versionToUpdate="${3-}"
	token=$(get_token_value)
	baseUrl=$(get_base_api)
	url="${baseUrl}/instances/${instance}/provisioned-plugins/${PLUGIN_ID}"
	shift
	ret=$(curl -s -H "Authorization: Bearer ${token}" "${url}" -d urlTemplate="${urlToUpdate}" -d version="${versionToUpdate}")

	code=$(echo "${ret}" | jq '.code' | jq --raw-output 'select(type == "string")')
  msg=$(echo "${ret}" | jq '.message' | jq --raw-output 'select(type == "string")')
	if [[ -z "${code}" && -z "${msg}" ]]; then
		[[ -z "${urlToUpdate}" ]] && echo reset || echo installed
	else
		pluginInfo=$(get_plugin_info "${instance}")
		current_url=$(echo "${pluginInfo}" | jq -r .url)
		current_version=$(echo "${pluginInfo}" | jq -r .version)
		current_commit_sha=$(get_existing_commit_sha "${current_url}")

		if [[ -z "${urlToUpdate}" && "${current_commit_sha}" == "UNMANAGED" ]] || [[ "${current_url}" == "${urlToUpdate}" && "${current_version}" == "${versionToUpdate}" ]]; then
			[[ -z "${urlToUpdate}" ]] && echo reset || echo installed
		else
			fail "${code:-"Error"}: ${msg:-"Version update not completed"}"
		fi
	fi
}

# Installs a particular version (specified via the `VERSION` env var)
# of the plugin on a Grafana instance.
# First parameter is the Grafana instance slug.
instance_install() {
  instance="$1"
	versionToInstall="${VERSION}-${COMMIT_SHA:0:8}"
  echo "...Installing $PLUGIN_ID version ${versionToInstall} for $environment instance ${instance}"
	urlTemplate="https://storage.googleapis.com/integration-artifacts/${PLUGIN_ID}/${VERSION}/main/${COMMIT_SHA}/${PLUGIN_ID}-${VERSION}.zip"
  BUCKET_PATH="gs://integration-artifacts/${PLUGIN_ID}/${VERSION}/main/${COMMIT_SHA}/${PLUGIN_ID}-${VERSION}.zip"
	bucketExist=$(gsutil -q stat "${BUCKET_PATH}" || echo 1)

	if [[ ${bucketExist} != 1 ]]; then
		update_version "${instance}" "${urlTemplate}" "${versionToInstall}"
	else
		fail "The file does not exists in GCS. Url: ${urlTemplate}"
	fi
}

# Remove a previously applied version override on a specific instance.
# First parameter is the Grafana instance slug.
instance_reset() {
	echo "...Resetting ${PLUGIN_ID} version for ${environment} instance $1"
	update_version "$1"
}

command="${1:-}"
if [ "$command" = help ]; then
	usage
fi

ensure_tools
ensure_token

instance="${2:-}"
if [ -z "$instance" ]; then
	usage
fi

case "$command" in
status)
	instance_status "$instance"
	;;
install)
	ensure_version
	ensure_commit_sha
	instance_install "$instance"
	;;
reset)
	instance_reset "$instance"
	;;
*)
	usage
	;;
esac