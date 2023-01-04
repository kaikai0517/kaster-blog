import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { GetStaticPaths, GetStaticProps } from "next";
import { NotionPost, Block, Comments } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useThemeContext } from "../../context/theme";
import { notion, databaseId } from "../../notion";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Chip from "@mui/material/Chip";
import LanguageIcon from "@mui/icons-material/Language";
import { Fragment } from "react";
import styles from "./post.module.css";
import Link from "next/link";

interface IFormInput {
  name: string;
  comment: string;
}
interface Props {
  post: NotionPost;
  comments: Comments;
  block: Block;
  hasMapComments: Array<Comment>;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  rich_text: [
    {
      plain_text: string;
    }
  ];
  created_by: {
    id: string;
  };
}

export const Text = ({ text }) => {
  if (!text) {
    return null;
  }
  return text.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    return (
      <span
        className={[
          bold ? styles.bold : "",
          code ? styles.code : "",
          italic ? styles.italic : "",
          strikethrough ? styles.strikethrough : "",
          underline ? styles.underline : "",
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

const renderNestedList = (block) => {
  const { type } = block;
  const value = block[type];
  if (!value) return null;

  const isNumberedList = value.children[0].type === "numbered_list_item";

  if (isNumberedList) {
    return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
  }
  return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p>
          <Text text={value.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h1>
          <Text text={value.rich_text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2>
          <Text text={value.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <Text text={value.rich_text} />
        </h3>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          <Text text={value.rich_text} />
          {!!value.children && renderNestedList(block)}
        </li>
      );
    case "to_do":
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
            <Text text={value.rich_text} />
          </label>
        </div>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <Text text={value.rich_text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case "child_page":
      return <p>{value.title}</p>;
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} />;
    case "quote":
      return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
    case "code":
      return (
        <pre className={styles.pre}>
          <code className={styles.code_block} key={id}>
            {value.rich_text[0].plain_text}
          </code>
        </pre>
      );
    case "file":
      const src_file =
        value.type === "external" ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split("/");
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <div className={styles.file}>
            📎{" "}
            <Link href={src_file} passHref>
              {lastElementInArray.split("?")[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
    case "bookmark":
      const href = value.url;
      return (
        <a href={href} target="_brank" className={styles.bookmark}>
          {href}
        </a>
      );
    default:
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
};

function Post({ post, blocks, hasMapComments }: Props) {
  console.log(blocks);
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useThemeContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await fetch("/api/createComment", {
        method: "post",
        body: JSON.stringify({
          id: post.id,
          comment: JSON.stringify(data),
        }),
      });

      setSubmitted(true);
    } catch (error) {
      setSubmitted(false);
    }
  };
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <main className="dark:bg-[#696B7B] dark:text-white">
        <Header />
        <Image
          className="w-full h-40 object-cover"
          src={post.properties["Files & media"].files[0].file.url}
          alt=""
          width={500}
          height={500}
        />
        <article className="max-w-3xl mx-auto p-5 space-y-5">
          <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
          <h2 className="text-xl font-light text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center space-x-2">
            <p className="font-extraLight text-sm">
              Leetcode{" "}
              <span className="text-green-600">
                {post.properties.Name.title[0].plain_text}{" "}
              </span>{" "}
              - Published at {new Date(post.created_time).toLocaleString()}{" "}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex gap-2 justify-end">
              {post.properties.Tags.multi_select.map((tag) => (
                <Chip key={tag.id} label={tag.name}></Chip>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-extraLight text-sm">熟練度 </p>
            <div className="text-red-600">
              {post.properties["熟練度"].select.name}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-extraLight text-sm">Youtube by Neetcode </p>
            <a
              className="text-red-600"
              href={post.properties["youtube 網址"].rich_text[0].href}
            >
              <YouTubeIcon></YouTubeIcon>
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-extraLight text-sm">Leetcode Website </p>
            <a
              className="text-blue-600"
              href={post.properties["網址"].rich_text[0].href}
            >
              <LanguageIcon></LanguageIcon>
            </a>
          </div>

          <div className="mt-10 space-y-5">
            {blocks.results.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
        {submitted ? (
          <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto ">
            <h3 className="text-3xl font-bold">
              Thank you for submitting your comment!
            </h3>
            <p>Once it has been approved, it will appear below!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          >
            <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
            <h3 className="text-3xl font-bold">Leave a comment below!</h3>
            <hr className="py-3 mt-2" />
            <label className="block mb-5">
              <span className="text-gray-700 dark:text-white">Name</span>
              <input
                {...register("name", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                placeholder="John Appleseed"
                type="text"
              />
            </label>

            <label className="block mb-5">
              <span className="text-gray-700 dark:text-white">Comment</span>
              <textarea
                {...register("comment", { required: true })}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                placeholder="John Appleseed"
                rows={8}
              />
            </label>

            <div className="flex flex-col p-5">
              {errors.name && (
                <span className="text-red-500">
                  -The Name Field is required
                </span>
              )}
              {errors.comment && (
                <span className="text-red-500">
                  -The Comment Field is required
                </span>
              )}
            </div>

            <input
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
            />
          </form>
        )}
        <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
          <h3 className="text-4xl">Comments</h3>
          <hr className="pb-2" />
          {hasMapComments.map((comment) => (
            <div key={comment.id}>
              <p>
                <span className="text-yellow-500">{comment.name}:</span>{" "}
                {comment.text}
              </p>
            </div>
          ))}
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const { results } = await notion.databases.query({
    database_id: databaseId,
  });

  const paths = results.map((result) => ({
    params: {
      slug: result.id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const comments = await notion.comments.list({
    block_id: params?.slug as string,
  });

  const blocks = await notion.blocks.children.list({
    block_id: params?.slug as string,
  });

  const post = await notion.pages.retrieve({
    page_id: params?.slug as string,
  });

  const mapUserInfo = (comments: Comments) => {
    const map = comments.results.map((comment: Comment) => {
      const data = JSON.parse(comment.rich_text[0].plain_text);
      return {
        ...comment,
        name: data.name,
        text: data.comment,
      };
    });

    return map;
  };

  const hasMapComments = mapUserInfo(comments);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      comments,
      blocks,
      hasMapComments,
    },
  };
};
