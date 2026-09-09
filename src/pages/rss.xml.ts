import rss from '@astrojs/rss';
import { siteConfig } from '@config/site';
import { getPostUrl } from '@utils/slug';
import { getPublishedPosts, sortPostsByDate } from '@utils/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const sortedPosts = sortPostsByDate(await getPublishedPosts());

  return rss({
    title: siteConfig.title, // Updated from siteConfig.name
    description: siteConfig.description,
    site: context.site ? context.site.toString() : '', // Use context.site, fallback to empty if undefined
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: getPostUrl(post),
      categories: post.data.categories || [],
    })),
    // Optional: customize the RSS output
    stylesheet: '/rss/styles.xsl',
  });
}
