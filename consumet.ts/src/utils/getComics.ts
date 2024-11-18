export const parsePostInfo = (post: string) => {
  let year = '';
  let size = '';
  let description = '';
  let sizeDone = false;
  for (let i = 0; i < post.length; i++) {
    if (
      i + 5 < post.length &&
      post[i] == 'Y' &&
      post[i + 1] == 'e' &&
      post[i + 2] == 'a' &&
      post[i + 3] == 'r' &&
      post[i + 4] == ' ' &&
      post[i + 5] == ':'
    ) {
      year = post[i + 7] + post[i + 8] + post[i + 9] + post[i + 10];
      i += 9;
    } else if (
      i + 5 < post.length &&
      post[i] == 'S' &&
      post[i + 1] == 'i' &&
      post[i + 2] == 'z' &&
      post[i + 3] == 'e' &&
      post[i + 4] == ' ' &&
      post[i + 5] == ':'
    ) {
      let j = i + 7;
      const temp = j;
      for (; j < temp + 4; j++) {
        if (!isNaN(Number(post[j]))) {
          size += post[j];
        } else {
          break;
        }
      }
      size += post[j] + post[j + 1];
      i += j - i;
      i += 2;
      sizeDone = true;
    }
    if (sizeDone) {
      description += post[i];
    }
  }
  description = description.substring(0, description.length - 12);
  return { year, size, description };
};
