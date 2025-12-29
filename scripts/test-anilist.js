const {META,MANGA,PROVIDERS_LIST} = require('@consumet/extensions');
(async () => {
  for (const name of Object.keys(MANGA)) {
    try {
      const mClass = new META.Anilist.Manga(MANGA[name]);
      const resClass = await mClass.search('one piece');
      console.log(name, 'class ->', Array.isArray(resClass.results) ? resClass.results.length : 'no results');
    } catch (e) {
      console.log(name, 'class err', e.message);
    }

    try {
      const inst = PROVIDERS_LIST.MANGA.find(p => p.name === name);
      if (!inst) {
        console.log(name, 'no instance found');
        continue;
      }
      const mInst = new META.Anilist.Manga(inst);
      const resInst = await mInst.search('one piece');
      console.log(name, 'instance ->', Array.isArray(resInst.results) ? resInst.results.length : 'no results');
    } catch (e) {
      console.log(name, 'instance err', e.message);
    }
  }
})();