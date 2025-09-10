import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { simpleBlogCard } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

async function getData() {
  const query = `*[_type == 'blog'] | order(_createdAt desc) {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage
  }`;

  const data = await client.fetch(query);
  return data;
}

export default async function Home() {
  const data: simpleBlogCard[] = await getData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-5">
      {data.map((post, idx) => (
        <Card
          key={idx}
          className="overflow-hidden shadow-md hover:shadow-lg transition rounded-2xl"
        >
          {/* Image sits flush at the top */}
          <div className="relative w-full h-48">
            <Image
              src={urlFor(post.titleImage).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>

          {/* Content below image */}
          <CardContent className="p-4 flex flex-col justify-between">
            <h3 className="text-lg font-bold line-clamp-2">{post.title}</h3>
            <p className="line-clamp-3 text-sm mt-2 text-gray-600 dark:text-gray-300">
              {post.smallDescription}
            </p>
            <Button asChild className="w-full mt-4">
              <Link href={`/blog/${post.currentSlug}`}>Read More</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
