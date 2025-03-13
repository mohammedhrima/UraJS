import Ura from "ura";

const endpoint = "https://api.mangadex.org";

async function fetchMangaByTitle(title) {
  const url = `${endpoint}/manga?title=${encodeURIComponent(title)}`;
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch manga");
  }
}

async function fetchMangaCover(mangaId) {
  const coverResponse = await fetch(`${endpoint}/cover?manga[]=${mangaId}`);
  if (!coverResponse.ok) {
    throw new Error("Failed to fetch cover");
  }

  const coverData = await coverResponse.json();
  const coverId = coverData.data[0].id;
  
  const coverImageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverId}.512.jpg`;
  return coverImageUrl;
}


async function fetchMangaDetails(mangaId) {
  const url = `${endpoint}/manga/${mangaId}`;
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch manga details");
  }
}

const api = {
  fetchMangaByTitle,
  fetchMangaCover,
  fetchMangaDetails,
};

export default api;