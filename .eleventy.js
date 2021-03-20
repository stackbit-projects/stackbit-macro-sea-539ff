const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

const path = require("path");
const Image = require("@11ty/eleventy-img");

const markdown = require("markdown-it")({
  html: true
});

async function imageShortcode(src, alt, classes, sizes) {
  let metadata = await Image('./src/' + src, {
    widths: [200, 400, 800, 1600, 3200],
    outputDir: "./_site/static/img/",
    urlPath: "/static/img/",
    formats: ["webp","jpeg"],
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);

      return `${name}-${width}w.${format}`;
    }
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    class: classes
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes, { whitespaceMode: "inline" });
}

async function imageSetShortcode(src, widths) {
  let metadata = await Image('./src/' + src, {
    widths: widths.split(/[^0-9]+/),
    outputDir: "./_site/static/img/",
    urlPath: "/static/img/",
    formats: ["jpeg"],
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    }
  });

  return `-webkit-image-set(${metadata.jpeg.map((p,i)=>`url(${p.url}) ${i+1}x`).join(', ')})`;
}


module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  eleventyConfig.addNunjucksAsyncShortcode("imageset", imageSetShortcode);
  eleventyConfig.addLiquidShortcode("imageset", imageSetShortcode);
  eleventyConfig.addJavaScriptFunction("imageset", imageSetShortcode);

  eleventyConfig.addFilter("md",content=>markdown.render(content));



  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.load(contents)
  );

  // Add Tailwind Output CSS as Watch Target
    eleventyConfig.addWatchTarget("./_tmp/static/css/style.css");

  // Copy Static Files to /_site
  eleventyConfig.addPassthroughCopy({
    "./_tmp/static/css/style.css": "./static/css/style.css",
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
    "./node_modules/turbolinks/dist/turbolinks.js":"./static/js/turbolinks.js",
    "./node_modules/alpine-turbo-drive-adapter/dist/alpine-turbo-adapter.js":"./static/js/alpine-turbo-adapter.js",
    "./node_modules/tocca/Tocca.min.js": "./static/js/Tocca.min.js",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy("./src/static/js");
  eleventyConfig.addPassthroughCopy("./src/static/css/*.wof*");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
