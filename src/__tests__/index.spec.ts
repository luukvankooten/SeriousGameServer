import { createServer } from 'http';
import SocketIOFactory from '../socket';
import { io, Socket as ClientSocket } from 'socket.io-client';
import { AddressInfo } from 'net';
import { Socket } from 'socket.io';

describe('test socket connection flow', () => {
  let server: ReturnType<typeof SocketIOFactory>,
    p1: ClientSocket,
    p2: ClientSocket,
    p3: ClientSocket,
    p4: ClientSocket,
    ps1: Socket,
    ps2: Socket,
    ps3: Socket,
    ps4: Socket,
    uri: string;

  beforeAll((done) => {
    const httpServer = createServer();

    server = SocketIOFactory(httpServer);

    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;

      uri = `http://localhost:${port}?roomUri=803f024d-fabc-4af6-a68b-1fb54e2f617c`;
      p1 = io(uri);
      p2 = io(uri);
      p3 = io(uri);
      p4 = io(uri);

      let count = 0;

      const tempSocks: Socket[] = [];

      const handler = (fn: (s: Socket) => void, id: ClientSocket) => {
        const ss = tempSocks.find((s) => s.id === id.id);

        if (ss) {
          fn(ss);
        }

        if (count === 4) {
          done();
        }
      };

      p1.on('connect', () => {
        handler((s) => (ps1 = s), p1);
      });

      p2.on('connect', () => {
        handler((s) => (ps2 = s), p2);
      });

      p3.on('connect', () => {
        handler((s) => (ps3 = s), p3);
      });

      p4.on('connect', () => {
        handler((s) => (ps4 = s), p4);
      });

      server.on('connection', (socket) => {
        count += 1;

        tempSocks.push(socket);
      });
    });
  });

  beforeAll(() => {
    p1.emit('role:assign', { role: 'retailer' });
    // ps1.on('role:assign', done);
  });

  beforeAll(() => {
    p2.emit('role:assign', { role: 'wholesaler' });
    // ps2.on('role:assign', done);
  });

  beforeAll(() => {
    p3.emit('role:assign', { role: 'distributer' });
    // ps3.on('role:assign', done);
  });

  beforeAll(() => {
    p4.emit('role:assign', { role: 'manufacture' });
    // ps4.on('role:assign', done);
  });

  afterAll(() => {
    p1.close();
    p2.close();
    p3.close();
    p4.close();
    server.close();
  });

  it('test gameplay', (done) => {
    p1.on('game:started', () => {
      p1.emit('round:invoice', { order: 1 });
    });
    p2.on('game:started', () => {
      p2.emit('round:invoice', { order: 1 });
    });
    p3.on('game:started', () => {
      p3.emit('round:invoice', { order: 1 });
    });
    p4.on('game:started', () => {
      p4.emit('round:invoice', { order: 1 });
    });

    p4.on('round:next', (orders) => {
      console.log(orders);
      done();
    });

    p1.emit('game:start');
  });
});
