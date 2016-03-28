echo "Starting pull notifications $SERVER"

if [ "$SERVER" = "thrift" ]; then
    python thrift-server.py
else
    python api.py
fi
