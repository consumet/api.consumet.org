<p align="center">
  <a href="https://consumet.org/">
    <img alt="Consumet" src="https://consumet.org/images/consumetlogo.png" width="150">
  </a>
</p>

<h1 align="center">
  Consumet API
</h1>
<p align="center">
  Consumet provides an APIs for accessing information and links for various entertertainments like movies, books, anime, etc.
</p>
<p align="center">
  <a href="https://github.com/consumet/api/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/consumet/api" alt="GitHub">
  </a>
    <a href="https://discord.gg/qTPfvMxzNH">
    <img src="https://img.shields.io/discord/987492554486452315?color=7289da" alt="Discord">
  </a>
</p>

Consumet scrapes data from various websites and provides APIs for accessing the data to satisfy your needs.

<h2> Table of Contents </h2>

- [Installation](#installation)
  - [Locally](#locally)
  - [Docker](#docker)
  - [Heroku](#heroku)
- [Documentation](#documentation)
- [Development](#development)
- [Provider Request](#provider-request)
- [Support](#support)
- [Other repositories](#other-repositories)

## Installation
### Locally
installation is simple.

Run the following command to clone the repository, and install the dependencies.

```sh
$ git clone https://github.com/consumet/consumet-api.git
$ cd consumet-api
$ npm install #or yarn install
```

start the server!

```sh
$ npm start #or yarn start
```

### Docker
Docker image is available at [Docker Hub](https://hub.docker.com/r/riimuru/consumet-api).

run the following command to pull and run the docker image.

```sh
$ docker pull riimuru/consumet-api
$ docker run -p 3000:3000 riimuru/consumet-api
```
This will start the server on port 3000. You can access the server at http://localhost:3000/, And can change the port by changing the -p option to `-p <port>:3000`.

You can add `-d` flag to run the server in detached mode.

### Heroku
Host your own instance of Consumet API on Heroku using the button below.\
[![Deploy on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/consumet/consumet-api/tree/main)

## Documentation
Please refer to the [documentation](https://docs.consumet.org). Join our [Discord server](https://discord.gg/qTPfvMxzNH) if you need any additional help or have any questions, comments, or suggestions.

## Development
Pull requests and stars are always welcome, For bugs and features create a new [issue]. If you're brave to make make a commit to the project see [CONTRIBUTING.md](https://github.com/consumet/extensions/blob/master/docs/guides/contributing.md).

## Provider Request
Make a new [issue](https://github.com/consumet/consumet.ts/issues/new?assignees=&labels=provider+request&template=provider-request.yml) with the name of the provider on the title, as well as a link to the provider in the body paragraph.

## Support
You can contact the maintainers of consumet.ts via [email](mailto:consumet.org@gmail.com), or [join the discord server](https://discord.gg/qTPfvMxzNH) (Recommended).
<p align="center">
  <a href="https://discord.gg/sP2k8vhjdb">
    <img src="http://invidget.switchblade.xyz/987492554486452315">
  </a>
</p>

## Related repositories
 - [Consumet.ts](https://github.com/consumet/extensions)
 - [Website](https://github.com/consumet/consumet.org)
 - [Providers Status](https://github.com/consumet/providers-status)
