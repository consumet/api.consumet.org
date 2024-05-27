import { ANIME } from "..";

const main = async () => {
  // Create a new instance of the Gogoanime provider
  const gogoanime = new ANIME.Gogoanime();
  // Search for an anime. In this case, "One Piece"
  const results = await gogoanime.search("One Piece");
  // print the results
  console.log(results);
};

main();
