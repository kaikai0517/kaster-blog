import Link from "next/link";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import { GetServerSideProps } from "next";
import Image from "next/image";
import k from "../public/k.png";
import { useThemeContext } from "../context/theme";

interface Props {
  posts: [Post];
}

const Home = ({ posts }: Props) => {
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
                Hello I'm <span className="underline decoration-4">Kaster</span>
              </h1>
              <h2>
                我是kaster 可以叫我阿凱或小凱
                <br />
                目前從事前端開發快一年的時間 <br />
                擅長vue框架與移動端產品開發(pwa)
                <br />
                與團隊合作git相關
                <br />
                經營這個網站主要是想統整自己的經歷與作品,並慢慢拓展網站的功能
              </h2>
            </div>
            <Image
              className="hidden md:inline-flex h-32 lg:h-full"
              priority={true}
              src={k}
              alt=""
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
            {posts.map((post) => (
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div className="border rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                    src={urlFor(post.mainImage).url()}
                    alt=""
                    width={500}
                    height={500}
                  />
                  <div className="flex justify-between p-5 bg-white">
                    <div>
                      <p className="text-lg font-bold">{post.title}</p>
                      <p className="text-xs">
                        {post.description} by {post.author.name}
                      </p>
                    </div>
                    <Image
                      className="h-12 w-12 rounded-full"
                      src={urlFor(post.author.image).url()}
                      alt=""
                      width={500}
                      height={500}
                    />
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
  const query = `*[_type == "post"]{
    _id,
    title,
    author-> {
        name,
        image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
