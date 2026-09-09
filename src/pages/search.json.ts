import { formatDate } from '@utils/date';
import { getPostSlug } from '@utils/slug';
import { getPublishedPosts } from '@utils/content';

// R24 (see astro6-review.md): only the first MAX_INDEXED_CONTENT_LENGTH
// normalized body characters per post are indexed, so matches later in long
// articles are not found. Full-text indexing of rendered bodies is deferred;
// there is deliberately no `?limit=` override — this constant is the only
// knob. It is a one-constant change to raise, and with the demo's nine posts
// going from 1,200 to 4,000 characters has a negligible index-size impact
// while making late-article terms in the demo content findable. Revisit
// (Pagefind, a prebuilt index, or a worker) if real content size demands it.
const MAX_INDEXED_CONTENT_LENGTH = 4000;

function excerptContent(content = '') {
  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_INDEXED_CONTENT_LENGTH);
}

export async function GET() {
  // Get all posts
  const posts = await getPublishedPosts();

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
