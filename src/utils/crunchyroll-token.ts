import axios from 'axios';

class KamyrollManager {
  private readonly baseUrl = 'https://api.kamyroll.tech';

  #token = undefined;

  static async create() {
    const instance = new KamyrollManager();
    await instance.init();
    return instance;
  }

  async init() {
    try {
      await this.fetchToken();

      setInterval(async () => {
        await this.fetchToken();
      }, 3.6e6);
    } catch (err) {
      console.log(err);
    }
  }

  private fetchToken = async () => {
    const data = await axios.get(`${this.baseUrl}/auth/v1/token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        device_id: 'com.service.data',
        device_type: 'consumet.org',
        access_token: process.env.ACCESS_TOKEN!,
      },
    });

    this.#token = data.data.access_token;
    //ts-ignore
    (
      global as typeof globalThis & {
        CrunchyrollToken: string;
      }
    ).CrunchyrollToken = data.data.access_token;
  };

  get token() {
    return this.#token;
  }
}

export default KamyrollManager;
