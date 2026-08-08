import { Feed } from 'feed';
import { getAllPosts } from '@/data/posts';

export async function GET() {
  const posts = getAllPosts();
  
  const site_url = 'https://marcyk.com'; // update with your actual domain

  const feed = new Feed({
    title: "MarCYK - Words",
    description: "Thoughts and things.",
    id: site_url,
    link: site_url,
    language: "en",
    image: `${site_url}/favicon.ico`,
    favicon: `${site_url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, MarCYK`,
    author: {
      name: "MarCYK",
      link: site_url
    }
  });

  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${site_url}${post.href}`,
      link: `${site_url}${post.href}`,
      description: post.title,
      content: post.contentHtml,
      author: [
        {
          name: post.author || "MarCYK",
          link: site_url
        }
      ],
      date: new Date(post.date || new Date()),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
