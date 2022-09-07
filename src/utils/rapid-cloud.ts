import ReconnectingWebSocket from 'reconnecting-websocket';
import { WebSocket } from 'ws';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class RapidCloud {
  private readonly baseUrl =
    'wss://ws1.rapid-cloud.co/socket.io/?EIO=4&transport=websocket';

  private socket: ReconnectingWebSocket;

  public sId = undefined;
  constructor() {
    this.socket = new ReconnectingWebSocket(this.baseUrl, undefined, {
      WebSocket: WebSocket,
    });
    try {
      this.socket.onopen = () => {
        this.socket.send('40');
      };

      this.socket.onmessage = ({ data }) => {
        if (data?.startsWith('40')) {
          this.sId = JSON.parse(data.split('40')[1]).sid;
        } else if (data == '2') {
          console.log("recieved pong from RapidCloud's server");
          this.socket.send('3');
        }
      };

      this.socket.onerror = (err) => {
        console.error('Websocket error: ', err);
      };

      setInterval(() => {
        this.socket.send('3');
      }, 25000);

      setInterval(() => {
        this.socket.reconnect();
      }, 7200000);
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
