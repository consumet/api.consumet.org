import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';
import axios from 'axios';
import { empty } from 'cheerio/lib/api/manipulation';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const zoro = new ANIME.Zoro(process.env.ZORO_URL);
  const anix = new ANIME.Anix(process.env.ANIX_URL);
  let baseUrl = "https://hianime.to";
  if(process.env.ZORO_URL){
    baseUrl = `https://${process.env.ZORO_URL}`;
  }

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        `Welcome to the zoro provider: check out the provider's website @ ${baseUrl}`,
      routes: ['/:query', '/recent-episodes', '/top-airing', '/most-popular', '/most-favorite', '/latest-completed', '/recent-added', '/info?id', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/zoro',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;

    const res = await zoro.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get(
    '/recent-episodes',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;

      const res = await zoro.fetchRecentlyUpdated(page);

      reply.status(200).send(res);
    },
  );

  fastify.get('/top-airing', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    const res = await zoro.fetchTopAiring(page);

    reply.status(200).send(res);
  });

  fastify.get('/most-popular', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    const res = await zoro.fetchMostPopular(page);

    reply.status(200).send(res);
  });

  fastify.get('/most-favorite', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    const res = await zoro.fetchMostFavorite(page);

    reply.status(200).send(res);
  });

  fastify.get(
    '/latest-completed',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;

      const res = await zoro.fetchLatestCompleted(page);

      reply.status(200).send(res);
    },
  );

  fastify.get('/recent-added', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    const res = await zoro.fetchRecentlyAdded(page);

    reply.status(200).send(res);
  });

  fastify.get('/top-upcoming', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    const res = await zoro.fetchTopUpcoming(page);

    reply.status(200).send(res);
  });

  fastify.get('/schedule/:date', async (request: FastifyRequest, reply: FastifyReply) => {
    const date = (request.params as { date: string }).date;

    const res = await zoro.fetchSchedule(date);

    reply.status(200).send(res);
  });

  fastify.get('/studio/:studioId', async (request: FastifyRequest, reply: FastifyReply) => {
    const studioId = (request.params as { studioId: string }).studioId;
    const page = (request.query as { page: number }).page ?? 1;

    const res = await zoro.fetchStudio(studioId, page);

    reply.status(200).send(res);
  });

  fastify.get('/spotlight', async (request: FastifyRequest, reply: FastifyReply) => {
    const res = await zoro.fetchSpotlight();

    reply.status(200).send(res);
  });

  fastify.get('/search-suggestions/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const res = await zoro.fetchSearchSuggestions(query);

    reply.status(200).send(res);
  });


  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await zoro
        .fetchAnimeInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      return reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  const watch = async (request: FastifyRequest, reply: FastifyReply) => {
    let episodeId = (request.params as { episodeId: string }).episodeId;
    if(!episodeId){
      episodeId = (request.query as { episodeId: string }).episodeId;
    }

    if (episodeId.includes("/watch/")) 
    {
      let episodeIdAux = episodeId.replace("/watch/", "");
      let episodeIdAuxParts = episodeIdAux.split("?ep=");
      episodeId = episodeIdAuxParts[ 0 ] + "$episode$" + episodeIdAuxParts[ 1 ];      
    }    

    /*
    if ( episodeId.includes("$sub") ) 
    {
      episodeId = episodeId.replace(
        "$sub",
        "$both"
      );  
    }
    */

    const server = (request.query as { server: string }).server as StreamingServers;

    if (server && !Object.values(StreamingServers).includes(server))
      return reply.status(400).send({ message: 'server is invalid' });

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      var res = await zoro
        .fetchEpisodeSources(episodeId, server);          

      for (let index = 0; index < res.sources.length; index++) {
        let obj = res.sources[index];
        if (!obj.hasOwnProperty('quality')) {
          obj.quality = "AUTO";
        }else if( obj?.quality !== undefined && obj.quality == "auto" )
        {
          obj.quality = "AUTO";
        }
      }

      if ( res.subtitles != null ) 
      {
        for (let index = 0; index < res.subtitles.length; index++) {
          if ( res.subtitles[ index ].lang == "Thumbnails" || res.subtitles[ index ].lang == "thumbnails" ) 
          {
            res.subtitles.splice(index, 1);
          }
        } 
      }    

      if ( res.sources == undefined || res.sources.length == 0 ) 
      {      
        const parts = episodeId.split('$');
        if ( parts[2] != null && parts[2].length <=3 ) 
        {
          const resAnix = await fetchEpisodeSourcesTemp(parts[0], parts[2]);
          if (resAnix != null) {
            res = resAnix;
          }
        }else{  
          const resAniwatch = await fetchEpisodeSources(parts[0], parts[2], false, parts[3]);
          if (resAniwatch != null) 
          {
            res = resAniwatch;
          }else{
            const resAniwatchRaw = await fetchEpisodeSources(parts[0], parts[2], true, parts[3]);
            if (resAniwatchRaw != null) 
            {
              res = resAniwatchRaw;
            }else{
              const resAnix = await fetchEpisodeSourcesTemp(parts[0], parts[2]);
              if (resAnix != null) {
                res = resAnix;
              }
            }        
          }
        }
      }

      reply.status(200).send(res);
    } catch (err) {
      const parts = episodeId.split('$');
      try {
        const data = await fetchEpisodeSources(parts[0], parts[2], false, parts[3]);
        if (data != null) 
        {
          reply.status(200).send(data);  // Solo se envía la respuesta cuando tenemos los datos 
        }else{
          try {
            const data = await fetchEpisodeSources(parts[0], parts[2], true, parts[3]);
            if (data != null) 
            {
              reply.status(200).send(data);  // Solo se envía la respuesta cuando tenemos los datos 
            }else{
              reply.status(500).send({});
            }
          } catch (error) {
            reply.status(500).send({ message: 'Something went wrong. Contact developer for help.' });
          }
        }
      } catch (error) {
        reply.status(500).send({ message: 'Something went wrong. Contact developer for help.' });
      }
    }
  };
  fastify.get('/watch', watch);
  fastify.get('/watch/:episodeId', watch);


  function getNameFromZoroId(input: string): string {
    if (input == "ranma-1-2-19335") {
      return "Ranma ½ (2024)";
    }
    const formattedString = input.replace(/-|\d+/g, ' ');
    return formattedString.trim();
  }

  function containsSubstring(mainString: string, subString: string): boolean {
      const cleanedMainString = mainString.replace(/[:?]/g, '');
      return cleanedMainString.toLowerCase().includes(subString.toLowerCase());
  }

  const fetchEpisodeSources = async (animeEpisodeId: string, episodeId: string, raw : Boolean, category : string): Promise<any> => {    
    try {
      var response = null;
      if (!raw) {
        if ( category.includes("both") ) 
        {
          console.log("category.raw: ", category);            
          category = category.replace(
            "both",
            "sub"            
          );  
          console.log("category.fix: ", category);
        }
        const urlServers = `https://scrape-aniwatch.csc-lab-api.xyz/api/v2/hianime/episode/servers?animeEpisodeId=${animeEpisodeId}?ep=${episodeId}`;
        const servers = await axios.get(urlServers);        
        console.log("response.data: ", servers.data);             
        if (servers.data != null && servers.data.data != null && servers.data.data[category] && servers.data.data[category].length > 0 ) {                
          for (let i = 0; i < servers.data.data[category].length; i++) 
          {
            const element = servers.data.data[category][i];
            if(element.serverName != null && element.serverName != "")
            {
              var url = `https://scrape-aniwatch.csc-lab-api.xyz/api/v2/hianime/episode/sources?animeEpisodeId=${animeEpisodeId}?ep=${episodeId}&server=${element.serverName}&category=${category}`;
              console.log("axios.url: ", url);
              response = await axios.get(url);
              console.log("axios.response: ", response.data);
              if (response.data.success && response.data.data != null && response.data.data.sources != null && response.data.data.sources.length > 0)     
                break;                              
            }                    
          }          
        }
      }else{
        // Crear la URL con los parámetros necesarios
        const url = `https://scrape-aniwatch.csc-lab-api.xyz/api/v2/hianime/episode/sources?animeEpisodeId=${animeEpisodeId}?ep=${episodeId}&category=raw`;
        // Hacer una solicitud GET a la URL
        response = await axios.get(url);
      }
  
      // Verificar si la respuesta es nula
      if (response == null) 
        return null;            

      // Accedemos a response.data.data correctamente
      const data = response.data.data;

      // Verificar si las claves existen y asignar valores predeterminados
      const sources = Array.isArray(data.sources) ? data.sources : [];
      const subtitles = Array.isArray(data.tracks) ? data.tracks : [];
      const introData = data.intro || {};  // Si intro existe, lo usamos
      const outroData = data.outro || {};  // Lo mismo con outro    

      // Extraer los parámetros de cada objeto en `sources`
      const sourcesDetails = sources.map((source: any) => ({
        url: source.url,  // Extraemos la URL
        type: source.type,  // Tipo de fuente (puede ser 'hls', etc.)
        quality: "AUTO",  // Calidad de la fuente
        isM3U8: true  // Si es un archivo M3U8
      }));

      // Extraer los parámetros de cada objeto en `subtitles`
      const subtitleDetails = subtitles
        .filter((subtitle: any) => subtitle.label)  // Filtra para incluir solo los elementos con `label` definido
        .map((subtitle: any) => ({
          url: subtitle.file,  // Archivo de subtítulo
          lang: subtitle.label.replace("CR_", "")   // Idioma del subtítulo (puede ser 'English', 'Spanish', etc.)
        }));

      // Crear el objeto final con todos los detalles extraídos
      const obj = {
        sources: sourcesDetails,  // Todos los detalles de las fuentes
        subtitles: subtitleDetails,  // Todos los detalles de los subtítulos
        intro: introData,  // URL de la intro
        outro: outroData,  // URL del outro
      };

      return obj;  // Retornar el objeto con todos los detalles
    } catch (error) {
      console.error("Error (fetchEpisodeSources):", error);
      return null;
    }
  };

  const fetchEpisodeSourcesTemp = async (animeName: string, episodeId: string): Promise<any> => {
    try {

      const searchName = getNameFromZoroId(
        animeName
      );
      
      const search = await anix.search(
        searchName
      );

      console.log("\n - - -");

      console.log("\nanimeSlug: " + animeName);

      console.log("\nanimeName: " + searchName);
      
      console.log("\nepisodeId: " + episodeId);

      if (search != null && search.results && search.results.length > 0) {
        var animeId = search.results[0].id;        
        search.results.forEach(element => {
          var searchAnimeRawName = element.title.toString().trim();
          var searchAnimeEnName = element.englishTitle.toString().trim();
          if ( searchAnimeRawName != null && searchAnimeRawName != undefined && searchAnimeRawName != "" ) {
            searchAnimeRawName = searchAnimeRawName.replace("½", "1/2");
          }
          if ( searchAnimeEnName != null && searchAnimeEnName != undefined && searchAnimeEnName != "" ) {
            searchAnimeEnName = searchAnimeEnName.replace("½", "1/2");
          }
          console.log(
            "\nsearch.title-raw:", searchAnimeRawName
          );     
          console.log(
            "\nsearch.title-english:", searchAnimeEnName
          );              
          if ( containsSubstring(searchAnimeRawName, searchName) || containsSubstring(searchAnimeEnName, searchName) ) {
            animeId = element.id.trim();
            console.log(
              "\nsearch.encontro:", element
            ); 
          }     
        });

        console.log("\nanimeId: " + animeId);

        if (animeId != undefined && animeId != "") {
          const info = await anix.fetchAnimeInfo(
            animeId
          );

          console.log("\ninfo.episodes: ", info.episodes);

          var episodeKey = "";

          if (info.episodes && info.episodes.length > 0) {
            info.episodes.forEach((item: any) => {
              if (episodeId == item.number) {
                episodeKey = item.id.trim();
                console.log("\nepisodeKey:", episodeKey);
              }
            });
          }

          if ( episodeKey != "") 
          {
            const episode = await anix.fetchEpisodeSources(
              animeId,
              episodeKey
            );

            console.log("\nepisode: ", episode);

            if (episode.sources && episode.sources.length > 0) {        
              const sourcesDetails = episode.sources.map((source: any) => ({
                url: source.url,  // Extraemos la URL
                type: "hls",  // Tipo de fuente (puede ser 'hls', etc.)
                quality: "AUTO",  // Calidad de la fuente
                isM3U8: true  // Si es un archivo M3U8
              }));
              const obj = {
                sources: sourcesDetails,  // Todos los detalles de las fuentes
                subtitles: [],  // Todos los detalles de los subtítulos
                intro: {},  // URL de la intro
                outro: {},  // URL del outro
              };
              return obj;  
            }        
          }
        }
      }
      
      console.log("\n - - -");
     return null;
    } catch (error) {
      console.error("Error (fetchEpisodeSources):", error);
      return null;
    }
  };


};

export default routes;
