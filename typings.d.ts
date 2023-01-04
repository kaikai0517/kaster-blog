export interface NotionPost {
  object: string;
  id: string;
  created_time: string;
  created_by: object;
  last_edited_time: string;
  last_edited_by: string;
  title: array;
  description: array;
  icon: object;
  cover: object;
  properties: {
    "Files & media": {
      files: array;
    };
    "youtube 網址": {
      rich_text: array;
    };
    熟練度: {
      select: {
        name: string;
      };
    };
    網址: {
      rich_text: array;
    };

    Name: {
      title: array;
    };
    Tags: {
      multi_select: [
        {
          name: string;
          color: string;
          id: string;
        }
      ];
    };
  };
  parent: object;
  url: string;
  archived: boolean;
  is_inline: boolean;
}

export interface Block {
  object: string;
  results: array;
}

export interface Comments {
  object: string;
  results: Array;
}
