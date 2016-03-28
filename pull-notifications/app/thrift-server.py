import logging
from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from rpc import NotificationService
from handler import NotificationServiceHandler


def server(port=9090):
    handler = NotificationServiceHandler()
    processor = NotificationService.Processor(handler)

    transport = TSocket.TServerSocket(host='0.0.0.0', port=port)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()
    server = TServer.TThreadedServer(processor, transport, tfactory, pfactory)

    logging.info('Starting the Thrift server on port {0}'.format(port))
    server.serve()


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    server()
