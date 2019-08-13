const assert = require('assert');
const net = require('net');

const { testPort } = require('..');

describe('Test Port', _ => {

  // Settings for tests
  let server;
  const settings = {
    host: '127.0.0.1',
    port: Math.floor(Math.random() * 9999)
  };

  it('should scan closed port', done => {
    testPort(settings.host, settings.port)
    .then(result => {
      assert.equal(result.Open, false);
      done();
    })
  });

  it('should start a server', done => {
    server = net.createServer(socket => {
      const remoteAddr = `${socket.remoteAddress}:${socket.remotePort}`;
      console.log(`New client at ${remoteAddr}`);

      socket.on('data', data => {
        console.log(`${remoteAddr} says ${data}`);
        socket.write(data);
        socket.write(' exit');
      })

    });
    server.listen(settings.port, settings.host, _ => {
      console.log(`Server running on port ${settings.port}`);
      done();
    });
  });

  it('should scan open port', done => {
    testPort(settings.host, settings.port)
    .then(result => {
      assert.equal(result.Open, true);
      server.close();
      done();
    })
  });

});
