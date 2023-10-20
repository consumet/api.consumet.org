<p align="center">
  <a href="https://consumet.org/">
    <img alt="Consumet" src="https://consumet.org/images/consumetlogo.png" width="150">
  </a>
</p>

<h1 align="center">
  Consumet API
</h1>
<p align="center">
  Consumet provides an APIs for accessing information and links for various entertainments like movies, books, anime, etc.
</p>
<p align="center">
    <a href="https://github.com/consumet/api.consumet.org/actions/workflows/docker-build.yml">
      <img src="https://github.com/consumet/api.consumet.org/actions/workflows/docker-build.yml/badge.svg" alt="Discord">
    </a>
    <a href="https://github.com/consumet/api.consumet.org/actions/workflows/codeql-analysis.yml">
      <img src="https://github.com/consumet/api.consumet.org/actions/workflows/codeql-analysis.yml/badge.svg" alt="Discord">
    </a>
    <a href="https://discord.gg/qTPfvMxzNH">
      <img src="https://img.shields.io/discord/987492554486452315?color=7289da&label=discord&logo=discord&logoColor=7289da" alt="Discord">
    </a>
    <a href="https://github.com/consumet/api/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/consumet/api" alt="GitHub">
  </a>
</p>

Consumet scrapes data from various websites and provides APIs for accessing the data to satisfy your needs.

<h2> Table of Contents </h2>

- [Installation](#installation)
  - [Locally](#locally)
  - [Docker](#docker)
  - [Heroku](#heroku)
  - [Vercel](#vercel)
  - [Render](#render)
  - [Railway](#railway)
- [Documentation](#documentation)
- [Development](#development)
- [Showcases](#showcases)
- [Provider Request](#provider-request)
- [Support](#support)
- [Contributors ✨](#contributors-)
- [Related repositories](#related-repositories)

## Installation
### Locally
installation is simple.

Run the following command to clone the repository, and install the dependencies.

```sh
$ git clone https://github.com/consumet/api.consumet.org.git
$ cd api.consumet.org
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

Be sure to set `NODE_ENV` to `PROD` in your environment variables when running your own instance.
Check out the `.env.example` file for more information.

You can add `-d` flag to run the server in detached mode.

### Heroku
Host your own instance of Consumet API on Heroku using the button below.

[![Deploy on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/consumet/api.consumet.org/tree/main)

### Vercel
Host your own instance of Consumet API on Vercel using the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fconsumet%2Fapi.consumet.org)

### Render
Host your own instance of Consumet API on Render using the button below.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/consumet/api.consumet.org)

### Railway
Host your own instance of Consumet API on Railway using the button below.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/C0FwuP?referralCode=dv4TuD)

## Documentation
Please refer to the [documentation](https://docs.consumet.org). Join our [Discord server](https://discord.gg/qTPfvMxzNH) if you need any additional help or have any questions, comments, or suggestions.

## Development
Pull requests and stars are always welcome, for bugs and features create a new [issue](https://github.com/consumet/api.consumet.org/issues). If you're brave to make make a commit to the project see [CONTRIBUTING.md](https://github.com/consumet/consumet.ts/blob/master/docs/guides/contributing.md).

## Showcases
Showcases are welcome! If you have a project that uses Consumet API, please let us know by making a new discussion [here](https://github.com/consumet/api.consumet.org/discussions/categories/show-and-tell) or by joining our [Discord server](https://discord.gg/qTPfvMxzNH). We will add your project to our [showcases page](https://consumet.org/showcase).

## Provider Request
Make a new [issue](https://github.com/consumet/consumet.ts/issues/new?assignees=&labels=provider+request&template=provider-request.yml) with the name of the provider on the title, as well as a link to the provider in the body paragraph.

## Support
You can contact the maintainers of consumet.ts via [email](mailto:consumet.org@gmail.com), or [join the discord server](https://discord.gg/qTPfvMxzNH) (Recommended).

<a href="https://discord.gg/qTPfvMxzNH">
   <img src="https://discordapp.com/api/guilds/987492554486452315/widget.png?style=banner2"/>
</a>


## Contributors ✨
Thanks to the following people for keeping this project alive and thriving.

[![](https://contrib.rocks/image?repo=consumet/consumet.ts)](https://github.com/consumet/consumet.ts/graphs/contributors)

## Related repositories
 - [Consumet.ts](https://github.com/consumet/consumet.ts)
 - [Website](https://github.com/consumet/consumet.org)
 - [Providers Status](https://github.com/consumet/providers-status)
