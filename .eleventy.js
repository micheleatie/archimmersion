const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const mdLib = markdownIt({
    html: true,
    linkify: true,
  });

  mdLib.renderer.rules.image = (tokens, index) => {
    const token = tokens[index];
    const src = token.attrGet("src") || "";
    const alt = token.content || token.attrGet("alt") || "";
    const title = token.attrGet("title") || "";
    const escapedSrc = mdLib.utils.escapeHtml(src);
    const escapedAlt = mdLib.utils.escapeHtml(alt);
    const titleAttribute = title
      ? ` title="${mdLib.utils.escapeHtml(title)}"`
      : "";
    const captionMarkup = escapedAlt ? `<figcaption>${escapedAlt}</figcaption>` : "";

    return `<figure class="md-image"><img src="${escapedSrc}" alt="${escapedAlt}"${titleAttribute} loading="lazy" />${captionMarkup}</figure>`;
  };

  eleventyConfig.setLibrary("md", mdLib);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/design/img": "design/img" });
  eleventyConfig.addPassthroughCopy({
    "src/representation/img": "representation/img",
  });
  eleventyConfig.addPassthroughCopy({
    "src/communication/img": "communication/img",
  });

  eleventyConfig.addFilter("resolvePageAsset", (assetPath, pageUrl) => {
    if (!assetPath) {
      return "";
    }

    if (/^(?:[a-z]+:)?\/\//i.test(assetPath) || assetPath.startsWith("/")) {
      return assetPath;
    }

    const cleanAsset = assetPath.replace(/^\.\//, "");
    const cleanPageUrl = pageUrl.endsWith("/") ? pageUrl : `${pageUrl}/`;

    return `${cleanPageUrl}${cleanAsset}`;
  });

  eleventyConfig.addCollection("sections", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter(
        (item) =>
          typeof item.data.sectionKey === "string" &&
          item.data.sectionKey.trim().length > 0
      )
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
