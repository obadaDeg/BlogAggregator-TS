import { XMLParser } from "fast-xml-parser"

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(url: string): Promise<RSSFeed> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const xmlData = await response.text();
    const parser = new XMLParser();
    const jsonData = parser.parse(xmlData);
    const channel = jsonData?.rss?.channel;
    if (!channel) {
        throw new Error("Invalid RSS feed format");
    }
    if (!channel.title || !channel.link || !channel.description) {
        throw new Error("Missing required channel fields in RSS feed");
    }

    const items = [];

    if (channel.item) {
        if (Array.isArray(channel.item)) {
            for (const item of channel.item) {
                if (!item.title || !item.link || !item.description || !item.pubDate) {
                    continue;
                }
                items.push({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    pubDate: item.pubDate,
                });
            }
        } else {
            const item = channel.item;
            if (item.title && item.link && item.description && item.pubDate) {
                items.push({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    pubDate: item.pubDate,
                });
            }
        }
    }

    return {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: items,
        },
    };
}
