import Link from "next/link";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NotionPost } from "../typings";
import { GetServerSideProps } from "next";
import Image from "next/image";
import k from "../public/k.png";
import { useThemeContext } from "../context/theme";
import { notion, databaseId } from "../notion";
import Chip from "@mui/material/Chip";

interface Props {
  results: [NotionPost];
}

const Home = ({ results }: Props) => {
  const [theme, setTheme] = useThemeContext();
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="dark:bg-[#696B7B] ">
        <div className="max-w-7xl mx-auto ">
          <Head>
            <title>Kaster Blog</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header />
          <div className="flex justify-center items-center dark:text-white dark:bg-[#363341] bg-[#A5ABB4]  border-y border-black py-10 lg:py-0">
            <div className="px-10 space-y-5">
              <h1 className="text-6xl max-w-xl font-serif">
                <span className="underline decoration-4">Leetcode Notes</span>
              </h1>
              <h2>This is a blog to record my leetcode process and notes</h2>
              <h2>Build with Next.js & notion api</h2>
            </div>
            <Image
              className="hidden md:inline-flex h-32 lg:h-full"
              priority={true}
              src={k}
              alt=""
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
            {results.map((result) => (
              <Link key={result.id} href={`/post/${result.id}`}>
                <div className="border rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                    src={result.properties["Files & media"].files[0].file.url}
                    alt=""
                    width={500}
                    height={500}
                  />
                  <div className=" p-5 space-y-2 bg-white">
                    <div>
                      <p className="text-lg font-bold">
                        {result.properties.Name.title[0].plain_text}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      {result.properties.Tags.multi_select.map((tag) => (
                        <Chip key={tag.id} label={tag.name}></Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const { results } = await notion.databases.query({
    database_id: databaseId,
  });
  return {
    props: {
      results,
    },
  };
};
