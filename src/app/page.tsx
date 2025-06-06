"use client";

import { movies } from "../data/movies";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, SetStateAction } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const genresList = movies.reduce((acc: string[], item) => {
    return [...acc, ...item.genre];
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
  const initialGenres = searchParams.getAll("genre");
  const initialYear = searchParams.get("year") || "";
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const initialSortType = searchParams.get("sort") || null;
  const [sortType, setSortType] = useState(initialSortType);
  const currentPageParam = searchParams.get("page");
  const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : 1;
  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedGenres.length > 0) {
      selectedGenres.forEach((genre) => params.append("genre", genre));
    }

    if (selectedYear) {
      params.set("year", selectedYear);
    }

    router.push(`?${params.toString()}`);
  }, [router, selectedGenres, selectedYear]);

  useEffect(() => {
    const currentSort = searchParams.get("sort");

    if (currentSort !== sortType) {
      setSortType(currentSort);
    }
  }, [searchParams, sortType]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleYearChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedYear(e.target.value);
  };

  const handleSortByAlphabet = () => {
    setSortType("alphabet");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "alphabet");
    router.push(`?${params.toString()}`);
  };

  const handleSortByYear = () => {
    setSortType("year");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "year");
    router.push(`?${params.toString()}`);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchGenre =
      selectedGenres.length === 0 ||
      movie.genre.some((g) => selectedGenres.includes(g));
    const matchYear = !selectedYear || movie.year.toString() === selectedYear;
    return matchGenre && matchYear;
  });

  const sortedMovies = [...filteredMovies];

  if (sortType === "alphabet") {
    sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortType === "year") {
    sortedMovies.sort((a, b) => a.year - b.year);
  }

  const paginatedMovies = sortedMovies.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedMovies.length / itemsPerPage);

  const goToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber === 1) {
      params.delete("page");
    } else {
      params.set("page", pageNumber.toString());
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="grid w-full max-w-[1200px] m-auto py-10 px-4">
      <h1 className="text-4xl text-center">Movie Catalog</h1>
      <form className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <fieldset>
          <legend className="text-xl">Genres</legend>
          <div className="flex flex-wrap gap-4 mt-3">
            {genres.map((item, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer capitalize"
              >
                <input
                  type="checkbox"
                  name={item}
                  value={item}
                  checked={selectedGenres.includes(item)}
                  onChange={() => toggleGenre(item)}
                />
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
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="" className="text-(--background)">
              Show all years
            </option>
            {yearsList.map((year, index) => (
              <option key={index} value={year} className="text-(--background)">
                {year}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <legend className="text-xl">Sort by...</legend>
          <div className="flex flex-wrap gap-3 mt-3">
            <button
              type="button"
              className="border rounded px-4 py-2 cursor-pointer"
              onClick={handleSortByAlphabet}
            >
              By alphabet
            </button>
            <button
              type="button"
              className="border rounded px-4 py-2 cursor-pointer"
              onClick={handleSortByYear}
            >
              By year
            </button>
          </div>
        </fieldset>
      </form>

      <ul className="grid place-content-center sm:place-content-start sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-10">
        {paginatedMovies.map((item) => (
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

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`px-4 py-2 border rounded cursor-pointer ${
              currentPage === pageNum ? "bg-gray-300" : ""
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
