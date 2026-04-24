import { getCollection } from 'astro:content';
import { formatDate } from '@utils/date';
import { getPostSlug } from '@utils/slug';

const MAX_INDEXED_CONTENT_LENGTH = 1200;

function excerptContent(content = '') {
  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_INDEXED_CONTENT_LENGTH);
}

export async function GET() {
  // Get all posts
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  // Format posts for search
  const searchData = posts.map(post => {
    // Create a serializable version of the image data if it exists
    const imageData = post.data.image ? {
      src: post.data.image.src,
      width: post.data.image.width,
      height: post.data.image.height
    } : null;
    
    return {
      slug: getPostSlug(post),
      title: post.data.title,
      description: post.data.description || '',
      date: post.data.date ? formatDate(post.data.date) : '',
      image: imageData,
      categories: post.data.categories || [],
      tags: post.data.tags || [],
      content: excerptContent(post.body)
    };
  });

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
