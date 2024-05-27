import { BOOKS } from "..";

const main = async () => {
  const books = new BOOKS.Libgen();

  const res = await books.search("pride and prejudice");

  for (const v of res) {
    console.log(v.title);
  }
};

main();
