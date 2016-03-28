const thrift = require('thrift');
const NotificationService = require('./rpc/NotificationService');
const ttypes = require('./rpc/rpc_types');


const tclient = module.exports = {}

tclient.postMessage = (msg) => {
  const thriftMessage = new ttypes.Message({
      src: msg.src || msg.from, dest: msg.dest || msg.to, content: msg.content, type: msg.type,
      timestamp: msg.timestamp});
  const transport = thrift.TBufferedTransport()
  const protocol = thrift.TBinaryProtocol()

  const connection = thrift.createConnection('192.168.99.100', 9090, {
    transport : transport,
    protocol : protocol
  });

  connection.on('error', (err) => {
    console.log(err)
  });

  const client = thrift.createClient(NotificationService, connection);

  client.postMessage(thriftMessage, (err, msg) => {
    connection.end();
  });
}
