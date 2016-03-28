rm -rf pull-notifications/app/rpc
rm -rf chat-server/app/rpc

thrift -r --gen py pull-notifications/rpc.thrift
thrift -r --gen js:node pull-notifications/rpc.thrift

cp -r gen-py/rpc pull-notifications/app/rpc
cp -r gen-nodejs chat-server/app/rpc

rm -rf gen-py
rm -rf gen-nodejs
