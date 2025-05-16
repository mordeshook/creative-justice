
// utils/AssetPreloader.js
export async function preloadAssets(assetList) {
    const promises = assetList.map((asset) => {
      if (asset.type === 'image') {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = asset.src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
      if (asset.type === 'font') {
        const font = new FontFace(asset.name, `url(${asset.src})`);
        return font.load().then((loaded) => document.fonts.add(loaded));
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
  }
  