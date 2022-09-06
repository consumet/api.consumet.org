import { WebSocket } from 'ws';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class RapidCloud {
  private readonly baseUrl =
    'wss://ws1.rapid-cloud.co/socket.io/?EIO=4&transport=websocket';

  private socket: WebSocket;

  public sId = undefined;
  constructor() {
    this.socket = new WebSocket(this.baseUrl);
    try {
      this.socket.on('open', () => {
        this.socket.send('40');
      });

      this.socket.on('close', (data) => {
        console.log('Disconnected from RapidCloud');
        this.sId = undefined;
        this.socket = new WebSocket(this.baseUrl);
      });

      this.socket.on('message', (data: string) => {
        data = data.toString();
        if (data?.startsWith('40')) {
          this.sId = JSON.parse(data.split('40')[1]).sid;
        } else if (data == '2') {
          console.log("recieved pong from RapidCloud's server");
          this.socket.send('3');
        }
      });

      this.socket.on('error', (err) => {
        this.socket.close();
        console.log(err);
      });

      setInterval(() => {
        this.socket.send('3');
      }, 25000);

      setInterval(() => {
        this.socket.close();
      }, 8200000);
    } catch (err) {
      console.log(err);
    }
  }

  returnSID = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.get('/rapid-cloud', async (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send(this.sId);
    });
  };
}

export default RapidCloud;
