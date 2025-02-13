import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: { id: string } }) => {
  try {
    const { id } = await params;

    // Fetch startup data and editor picks
    const [post, editorData] = await Promise.all([
      client.fetch(STARTUP_BY_ID_QUERY, { id }),
      client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks-new" }),
    ]);

    // Ensure post exists, otherwise return 404
    if (!post) return notFound();

    // Ensure editor picks are correctly extracted
    const editorPosts: StartupTypeCard[] = editorData?.select || [];

    // Convert markdown pitch to HTML
    const parsedContent = md.render(post?.pitch || "");

    return (
      <>
        {/* Startup Info */}
        <section className="pink_container !min-h-[230px]">
          <p className="tag">{formatDate(post?._createdAt)}</p>

          <h1 className="heading">{post.title}</h1>
          <p className="sub-heading !max-w-5xl">{post.description}</p>
        </section>

        {/* Startup Image & Details */}
        <section className="section_container">
          {post.image && (
            <img
              src={post.image}
              alt="thumbnail"
              className="w-full h-auto rounded-xl"
            />
          )}

          <div className="space-y-5 mt-10 max-w-4xl mx-auto">
            <div className="flex-between gap-5">
              {/* Author Info */}
              {post.author ? (
                <Link
                  href={`/user/${post.author?._id}`}
                  className="flex gap-2 items-center mb-3"
                >
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      alt="avatar"
                      width={64}
                      height={64}
                      className="rounded-full drop-shadow-lg"
                    />
                  )}
                  <div>
                    <p className="text-20-medium">
                      {post.author.name || "Unknown"}
                    </p>
                    <p className="text-16-medium !text-black-300">
                      @{post.author.username || "N/A"}
                    </p>
                  </div>
                </Link>
              ) : (
                <p className="text-16-medium !text-black-300">Unknown Author</p>
              )}

              <p className="category-tag">{post.category || "Uncategorized"}</p>
            </div>

            {/* Pitch Details */}
            <h3 className="text-30-bold">Pitch Details</h3>
            {parsedContent ? (
              <article
                className="prose max-w-4xl font-work-sans break-all"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="no-result">No details provided</p>
            )}
          </div>

          <hr className="divider" />

          {/* Editor Picks Section */}
          {editorPosts.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-30-semibold">Editor Picks</p>

              <ul className="mt-7 card_grid-sm">
                {editorPosts.map((post: StartupTypeCard, i: number) => (
                  <StartupCard key={i} post={post} />
                ))}
              </ul>
            </div>
          )}

          {/* View Component with Suspense */}
          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={id} />
          </Suspense>
        </section>
      </>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p className="text-red-500 text-center">Error loading data.</p>;
  }
};

export default Page;
