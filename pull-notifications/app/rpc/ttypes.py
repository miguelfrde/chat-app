#
# Autogenerated by Thrift Compiler (0.9.3)
#
# DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
#
#  options string: py
#

from thrift.Thrift import TType, TMessageType, TException, TApplicationException

from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol, TProtocol
try:
  from thrift.protocol import fastbinary
except:
  fastbinary = None



class Message:
  """
  Attributes:
   - src
   - dest
   - content
   - type
   - timestamp
  """

  thrift_spec = (
    None, # 0
    (1, TType.STRING, 'src', None, None, ), # 1
    (2, TType.STRING, 'dest', None, None, ), # 2
    (3, TType.STRING, 'content', None, None, ), # 3
    (4, TType.STRING, 'type', None, None, ), # 4
    (5, TType.I64, 'timestamp', None, None, ), # 5
  )

  def __init__(self, src=None, dest=None, content=None, type=None, timestamp=None,):
    self.src = src
    self.dest = dest
    self.content = content
    self.type = type
    self.timestamp = timestamp

  def read(self, iprot):
    if iprot.__class__ == TBinaryProtocol.TBinaryProtocolAccelerated and isinstance(iprot.trans, TTransport.CReadableTransport) and self.thrift_spec is not None and fastbinary is not None:
      fastbinary.decode_binary(self, iprot.trans, (self.__class__, self.thrift_spec))
      return
    iprot.readStructBegin()
    while True:
      (fname, ftype, fid) = iprot.readFieldBegin()
      if ftype == TType.STOP:
        break
      if fid == 1:
        if ftype == TType.STRING:
          self.src = iprot.readString()
        else:
          iprot.skip(ftype)
      elif fid == 2:
        if ftype == TType.STRING:
          self.dest = iprot.readString()
        else:
          iprot.skip(ftype)
      elif fid == 3:
        if ftype == TType.STRING:
          self.content = iprot.readString()
        else:
          iprot.skip(ftype)
      elif fid == 4:
        if ftype == TType.STRING:
          self.type = iprot.readString()
        else:
          iprot.skip(ftype)
      elif fid == 5:
        if ftype == TType.I64:
          self.timestamp = iprot.readI64()
        else:
          iprot.skip(ftype)
      else:
        iprot.skip(ftype)
      iprot.readFieldEnd()
    iprot.readStructEnd()

  def write(self, oprot):
    if oprot.__class__ == TBinaryProtocol.TBinaryProtocolAccelerated and self.thrift_spec is not None and fastbinary is not None:
      oprot.trans.write(fastbinary.encode_binary(self, (self.__class__, self.thrift_spec)))
      return
    oprot.writeStructBegin('Message')
    if self.src is not None:
      oprot.writeFieldBegin('src', TType.STRING, 1)
      oprot.writeString(self.src)
      oprot.writeFieldEnd()
    if self.dest is not None:
      oprot.writeFieldBegin('dest', TType.STRING, 2)
      oprot.writeString(self.dest)
      oprot.writeFieldEnd()
    if self.content is not None:
      oprot.writeFieldBegin('content', TType.STRING, 3)
      oprot.writeString(self.content)
      oprot.writeFieldEnd()
    if self.type is not None:
      oprot.writeFieldBegin('type', TType.STRING, 4)
      oprot.writeString(self.type)
      oprot.writeFieldEnd()
    if self.timestamp is not None:
      oprot.writeFieldBegin('timestamp', TType.I64, 5)
      oprot.writeI64(self.timestamp)
      oprot.writeFieldEnd()
    oprot.writeFieldStop()
    oprot.writeStructEnd()

  def validate(self):
    return


  def __hash__(self):
    value = 17
    value = (value * 31) ^ hash(self.src)
    value = (value * 31) ^ hash(self.dest)
    value = (value * 31) ^ hash(self.content)
    value = (value * 31) ^ hash(self.type)
    value = (value * 31) ^ hash(self.timestamp)
    return value

  def __repr__(self):
    L = ['%s=%r' % (key, value)
      for key, value in self.__dict__.iteritems()]
    return '%s(%s)' % (self.__class__.__name__, ', '.join(L))

  def __eq__(self, other):
    return isinstance(other, self.__class__) and self.__dict__ == other.__dict__

  def __ne__(self, other):
    return not (self == other)
