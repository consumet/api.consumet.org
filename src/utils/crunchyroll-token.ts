import axios from 'axios';

class CrunchyrollManager {
  private readonly baseUrl = 'https://api.kamyroll.tech';

  #token = undefined;

  static async create() {
    const instance = new CrunchyrollManager();
    await instance.init();
    return instance;
  }

  async init() {
    try {
      await this.fetchToken();

      setInterval(async () => {
        await this.fetchToken();
      }, 8.28e7);
    } catch (err) {
      console.log(err);
    }
  }

  private fetchToken = async () => {
    const data = await axios.post(
      `${this.baseUrl}/auth/v1/token`,
      new URLSearchParams({
        device_id: 'whatvalueshouldbeforweb',
        device_type: 'com.service.data',
        access_token: process.env.ACCESS_TOKEN!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

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

export default CrunchyrollManager;
