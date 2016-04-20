# Parameters
export SERVICE_PORT=YOUR_LISTENING_PORT

curl -i -X POST \
  --url http://localhost:8001/apis/ \
  --data 'name=slack2mm' \
  --data 'request_path=/slack' \
  --data 'strip_request_path=false' \
  --data 'upstream_url=http://127.0.0.1:${SERVICE_PORT}'

curl -i -X POST \
  --url http://localhost:8001/apis/ \
  --data 'name=mm2slack' \
  --data 'request_path=/mm' \
  --data 'strip_request_path=false' \
  --data 'upstream_url=http://127.0.0.1:${SERVICE_PORT}'


