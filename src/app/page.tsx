"use client";

import { movies } from "../data/movies";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const genresList = movies.reduce((acc: string[], item) => {
    acc = [...acc, ...item.genre];
    return acc;
  }, []);

  const yearsList = movies
    .reduce((acc: number[], item) => {
      if (!acc.includes(item.year)) {
        acc.push(item.year);
      }
      return acc;
    }, [])
    .sort();

  const genres = Array.from(new Set(genresList)).sort();
  const params: { [key: string]: string } = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  console.log(params.genre.split(','));

  return (
    <div className="grid w-full max-w-[1200px] m-auto py-10 px-4">
      <h1 className="text-4xl text-center">Movie Catalog</h1>
      <form className="grid sm:grid-cols-2 gap-8 mt-8">
        <fieldset>
          <legend className="text-xl">Genres</legend>
          <div className="flex flex-wrap gap-4 mt-3">
            {genres.map((item, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer capitalize"
              >
                <input type="checkbox" name={item} value={item} />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-xl">Release Year</legend>
          <select
            name="years"
            className="border mt-3 cursor-pointer rounded-lg px-4 py-2"
          >
            <option
              defaultValue="Choose release year"
              hidden
              className="text-(--background)"
            >
              Choose release year
            </option>
            {yearsList.map((year, index) => (
              <option key={index} value={year} className="text-(--background)">
                {year}
              </option>
            ))}
          </select>
        </fieldset>
      </form>

      <ul className="grid place-content-center sm:place-content-start sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-10">
        {movies.map((item) => (
          <li key={item.id} className="rounded-xl overflow-hidden border">
            <a href="#">
              <Image
                src="/dummy.jpg"
                alt={item.title}
                width={280}
                height={173}
                className="w-full object-fit aspect-video"
              />
              <div className="p-4">
                <h2 className="text-xl">{item.title}</h2>
                <div className="mt-2">Release date: {item.year}</div>
                <div className="text-sm mt-2">
                  Genre: {item.genre.join(", ")}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
