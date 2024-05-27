<h1>ReadLightNovels</h1>

```ts
const readlightnovels = new LIGHT_NOVELS.ReadLightNovels();
```

<h2>Methods</h2>

- [search](#search)
- [fetchLightNovelInfo](#fetchlightnovelinfo)
- [fetchChapterContent](#fetchchaptercontent)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                         |
| --------- | -------- | ----------------------------------------------------------------------------------- |
| query     | `string` | query to search for. (*In this case, We're searching for `Classrrom of the Elite`*) |

```ts
readlightnovels.search("Classrrom of the Elite").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of light novels. (*<a href= "https://github.com/consumet/extensions/blob/master/src/models/types.ts#L128-L134"> <code>Promise<ISearch\<ILightNovelResult>></code></a>*)\
output:
```js
{
  results: [
    {
      id: 'youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e', // the light novel id
      title: 'Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e Novel (Classroom of the Elite Novel)',
      url: 'https://readlightnovels.net/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e.html',
      image: 'https://readlightnovels.net/wp-content/uploads/2020/01/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e.jpg'
    },
    {...}
    ...
  ]
}
```

### fetchLightNovelInfo

<h4>Parameters</h4>

| Parameter              | Type     | Description                                                                                            |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| lightNovelUrl          | `string` | id or url of the light novel. (*light novel id or url can be found in the light novel search results*) |
| chapterPage (optional) | `number` | chapter page number (*default: -1 meaning will fetch all chapters*)                                    |

```ts
readlightnovels.fetchLightNovelInfo("youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an light novel info object (including the chapters or volumes). (*<a href="https://github.com/consumet/extensions/blob/master/src/models/types.ts#L148-L156"><code>Promise\<ILightNovelInfo></code></a>*)\
output:
```js
{
  id: 'youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e',
  title: 'Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e Novel (Classroom of the Elite Novel)',
  url: 'https://readlightnovels.net/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e.html',
  image: 'https://readlightnovels.net/wp-content/uploads/2020/01/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e.jpg',
  author: 'Kinugasa Shougo衣笠彰梧',
  genres: [
    'Drama',
    'Harem',
    '...'
  ],
  rating: 8.6,
  views: 651729,
  description: 'Kōdo Ikusei Senior High School, a leading prestigious school with state-of-the-art facilities where nearly...',
  status: 'Ongoing',
  pages: 13,
  chapters: [
    {
      id: 'youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e/volume-1-prologue-the-structure-of-japanese-society',
      title: 'Volume 1, Prologue: The structure of Japanese society',
      url: 'https://readlightnovels.net/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e/volume-1-prologue-the-structure-of-japanese-society.html'
    },
    {...}
    ...
```

### fetchChapterContent

<h4>Parameters</h4>

| Parameter | Type     | Description                                                            |
| --------- | -------- | ---------------------------------------------------------------------- |
| chapterId | `string` | chapter id. (*chapter id can be found in the light novel info object*) |

```ts
readlightnovels.fetchChapterContent("youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e/volume-1-prologue-the-structure-of-japanese-society").then(data => {
  console.log(data);
})
```
returns a content object. (*<a href="https://github.com/consumet/extensions/blob/master/src/models/types.ts#L143-L146"><code>Promise\<ILightNovelChapterContent></code></a>*)\
output:
```js
{
  text: '\n' +
    'It’s a bit sudden,...',
  html: '<p></p><p>It’s a bit sudden, but listen seriously to the question I’m about to ask and think about...'
}
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/light-novels.md#">back to light novels providers list</a>)</p>
