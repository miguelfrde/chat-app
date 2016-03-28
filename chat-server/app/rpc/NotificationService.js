//
// Autogenerated by Thrift Compiler (0.9.3)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;


var ttypes = require('./rpc_types');
//HELPER FUNCTIONS AND STRUCTURES

NotificationService_postMessage_args = function(args) {
  this.message = null;
  if (args) {
    if (args.message !== undefined && args.message !== null) {
      this.message = new ttypes.Message(args.message);
    }
  }
};
NotificationService_postMessage_args.prototype = {};
NotificationService_postMessage_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.message = new ttypes.Message();
        this.message.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

NotificationService_postMessage_args.prototype.write = function(output) {
  output.writeStructBegin('NotificationService_postMessage_args');
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRUCT, 1);
    this.message.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

NotificationService_postMessage_result = function(args) {
};
NotificationService_postMessage_result.prototype = {};
NotificationService_postMessage_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

NotificationService_postMessage_result.prototype.write = function(output) {
  output.writeStructBegin('NotificationService_postMessage_result');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

NotificationServiceClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this._seqid = 0;
    this._reqs = {};
};
NotificationServiceClient.prototype = {};
NotificationServiceClient.prototype.seqid = function() { return this._seqid; }
NotificationServiceClient.prototype.new_seqid = function() { return this._seqid += 1; }
NotificationServiceClient.prototype.postMessage = function(message, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_postMessage(message);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_postMessage(message);
  }
};

NotificationServiceClient.prototype.send_postMessage = function(message) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('postMessage', Thrift.MessageType.CALL, this.seqid());
  var args = new NotificationService_postMessage_args();
  args.message = message;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

NotificationServiceClient.prototype.recv_postMessage = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new NotificationService_postMessage_result();
  result.read(input);
  input.readMessageEnd();

  callback(null)
};
NotificationServiceProcessor = exports.Processor = function(handler) {
  this._handler = handler
}
NotificationServiceProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}

NotificationServiceProcessor.prototype.process_postMessage = function(seqid, input, output) {
  var args = new NotificationService_postMessage_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.postMessage.length === 1) {
    Q.fcall(this._handler.postMessage, args.message)
      .then(function(result) {
        var result = new NotificationService_postMessage_result({success: result});
        output.writeMessageBegin("postMessage", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("postMessage", Thrift.MessageType.EXCEPTION, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.postMessage(args.message, function (err, result) {
      if (err == null) {
        var result = new NotificationService_postMessage_result((err != null ? err : {success: result}));
        output.writeMessageBegin("postMessage", Thrift.MessageType.REPLY, seqid);
      } else {
        var result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("postMessage", Thrift.MessageType.EXCEPTION, seqid);
      }
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
}

