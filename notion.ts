import { Client } from "@notionhq/client";

const databaseId = process.env.NEXT_NOTION_DATABASE_ID as string;
const notion = new Client({ auth: process.env.NEXT_NOTION_KEY });

export { notion, databaseId };
