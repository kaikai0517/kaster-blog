// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { notion } from "../../notion";

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, comment } = JSON.parse(req.body);

  try {
    await notion.comments.create({
      parent: {
        page_id: id,
      },
      rich_text: [
        {
          text: {
            content: comment,
          },
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({ message: "Couldnt submit comment", error });
  }
  return res.status(200).json({ message: "Comment submit" });
}
