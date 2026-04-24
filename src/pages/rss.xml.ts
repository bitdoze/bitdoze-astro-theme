import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@config/site';
import { getPostUrl } from '@utils/slug';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

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
      // Optional custom data
      customData: post.data.tags ? 
        `<tags>${post.data.tags.join(',')}</tags>` : '',
    })),
    // Optional: customize the RSS output
    stylesheet: '/rss/styles.xsl',
  });
}
