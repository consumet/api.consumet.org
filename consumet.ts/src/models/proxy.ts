import axios, { AxiosAdapter, AxiosInstance } from 'axios';

import { ProxyConfig } from './types';

export class Proxy {
  /**
   *
   * @param proxyConfig The proxy config (optional)
   * @param adapter The axios adapter (optional)
   */
  constructor(protected proxyConfig?: ProxyConfig, protected adapter?: AxiosAdapter) {
    this.client = axios.create();

    if (proxyConfig) this.setProxy(proxyConfig);
    if (adapter) this.setAxiosAdapter(adapter);
  }
  private validUrl = /^https?:\/\/.+/;
  /**
   * Set or Change the proxy config
   */
  setProxy(proxyConfig: ProxyConfig) {
    if (!proxyConfig?.url) return;

    if (typeof proxyConfig?.url === 'string')
      if (!this.validUrl.test(proxyConfig.url)) throw new Error('Proxy URL is invalid!');

    if (Array.isArray(proxyConfig?.url)) {
      for (const [i, url] of this.toMap<string>(proxyConfig.url))
        if (!this.validUrl.test(url)) throw new Error(`Proxy URL at index ${i} is invalid!`);

      this.rotateProxy({ ...proxyConfig, urls: proxyConfig.url });
    }

    this.client.interceptors.request.use(config => {
      if (proxyConfig?.url) {
        config.headers = {
          ...config.headers,
          'x-api-key': proxyConfig?.key ?? '',
        };
        config.url = `${proxyConfig.url}${config?.url ? config?.url : ''}`;
        console.log(config.url);
      }

      if (config?.url?.includes('anify'))
        config.headers = {
          ...config.headers,
          'User-Agent': 'consumet',
        };

      return config;
    });
  }

  /**
   * Set or Change the axios adapter
   */
  setAxiosAdapter(adapter: AxiosAdapter) {
    this.client.defaults.adapter = adapter;
  }
  private rotateProxy = (proxy: Omit<ProxyConfig, 'url'> & { urls: string[] }) => {
    setInterval(() => {
      const url = proxy.urls.shift();
      if (url) proxy.urls.push(url);

      this.setProxy({ url: proxy.urls[0], key: proxy.key });
    }, proxy?.rotateInterval ?? 5000);
  };

  private toMap = <T>(arr: T[]): [number, T][] => arr.map((v, i) => [i, v]);

  protected client: AxiosInstance;
}

export default Proxy;
