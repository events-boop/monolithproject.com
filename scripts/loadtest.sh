#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
RPS_MIN_HOME="${RPS_MIN_HOME:-1200}"
RPS_MIN_TICKETS="${RPS_MIN_TICKETS:-1100}"
RPS_MIN_HEALTH="${RPS_MIN_HEALTH:-1500}"
P95_MAX_MS="${P95_MAX_MS:-120}"

if ! command -v ab >/dev/null 2>&1; then
  echo "ApacheBench (ab) is required but not found."
  exit 1
fi

SERVER_PID=""
if [[ "${START_SERVER:-1}" == "1" ]]; then
  NODE_ENV=production node dist/index.js >/tmp/monolith-loadtest.log 2>&1 &
  SERVER_PID=$!
  trap '[[ -n "${SERVER_PID}" ]] && kill "${SERVER_PID}" >/dev/null 2>&1 || true' EXIT
  sleep 1
fi

check_json_api() {
  local route="$1"
  local headers
  headers="$(curl -sS -D - "${BASE_URL}${route}" -o /tmp/monolith-api-body.json)"
  echo "${headers}" | grep -qi "content-type: application/json" || {
    echo "FAIL: ${route} did not return JSON content-type"
    exit 1
  }
  grep -q '"ok":true' /tmp/monolith-api-body.json || {
    echo "FAIL: ${route} did not return expected ok:true JSON payload"
    exit 1
  }
}

run_ab() {
  local name="$1"
  local route="$2"
  local n="$3"
  local c="$4"
  local min_rps="$5"

  local out
  out="$(ab -n "${n}" -c "${c}" "${BASE_URL}${route}")"
  echo "${out}"

  local rps p95
  rps="$(echo "${out}" | awk '/Requests per second:/ {print $4}')"
  p95="$(echo "${out}" | awk '$1 == "95%" {print $2}')"

  awk -v val="${rps}" -v min="${min_rps}" 'BEGIN { if (val+0 < min+0) exit 1 }' || {
    echo "FAIL: ${name} RPS ${rps} < ${min_rps}"
    exit 1
  }
  awk -v val="${p95}" -v max="${P95_MAX_MS}" 'BEGIN { if (val+0 > max+0) exit 1 }' || {
    echo "FAIL: ${name} p95 ${p95}ms > ${P95_MAX_MS}ms"
    exit 1
  }
}

check_json_api "/api/health"
run_ab "home" "/" 2000 50 "${RPS_MIN_HOME}"
run_ab "tickets" "/tickets" 2000 50 "${RPS_MIN_TICKETS}"
run_ab "api_health" "/api/health" 4000 100 "${RPS_MIN_HEALTH}"

echo "PASS: load test thresholds satisfied"
