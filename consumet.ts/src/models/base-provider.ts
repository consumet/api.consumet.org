import { IProviderStats } from '.';
import Proxy from './proxy';

abstract class BaseProvider extends Proxy {
  /**
   * Name of the provider
   */
  abstract readonly name: string;

  /**
   * The main URL of the provider
   */
  protected abstract readonly baseUrl: string;

  /**
   * Most providers are english based, but if the provider is not english based override this value.
   * must be in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format
   */
  protected readonly languages: string[] | string = 'en';

  /**
   * override as `true` if the provider **only** supports NSFW content
   */
  readonly isNSFW: boolean = false;

  /**
   * Logo of the provider (used in the website) or `undefined` if not available. ***128x128px is preferred***\
   * Must be a valid URL (not a data URL)
   */
  protected readonly logo: string =
    'https://png.pngtree.com/png-vector/20210221/ourmid/pngtree-error-404-not-found-neon-effect-png-image_2928214.jpg';

  /**
   * The class's path is determined by the provider's directory structure for example:\
   * MangaDex class path is `MANGA.MangaDex`. **(case sensitive)**
   */
  protected abstract readonly classPath: string;

  /**
   * override as `false` if the provider is **down** or **not working**
   */
  readonly isWorking: boolean = true;

  /**
   * returns provider stats
   */
  get toString(): IProviderStats {
    return {
      name: this.name,
      baseUrl: this.baseUrl,
      lang: this.languages,
      isNSFW: this.isNSFW,
      logo: this.logo,
      classPath: this.classPath,
      isWorking: this.isWorking,
    };
  }
}

export default BaseProvider;
