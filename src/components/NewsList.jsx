// src/components/NewsList.jsx
import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner"; // Spinner component

function NewsList({ country, category, searchQuery }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch news via Netlify serverless function
  const fetchNews = async (pageNumber = 1) => {
    if (pageNumber === 1) setLoading(true);

    // FIX: Using /api/fetchNews is correct for Netlify Functions when deployed,
    // but in local development with Vite/Netlify Dev, it might need to be /netlify/functions/fetchNews or similar,
    // but we'll assume /api/fetchNews is set up in netlify.toml or is the default.
    let url = `/api/fetchNews?page=${pageNumber}`;

    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (country) url += `&country=${country}`;
    if (category) url += `&category=${category}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error || !data.articles) {
        // Log the error details from the serverless function
        console.error("Serverless function error:", data.details || data.error);
        throw new Error("Failed to retrieve articles data.");
      }

      const validArticles = data.articles.filter(
        (item) => item.title && item.url
      );

      setArticles((prevArticles) =>
        pageNumber === 1 ? validArticles : [...prevArticles, ...validArticles]
      );

      // GNews API uses 'totalArticles' for total available articles.
      setTotalResults(data.totalArticles || validArticles.length);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Set total results to current article count to stop infinite scroll on error
      setTotalResults(articles.length);
    } finally {
      setLoading(false);
    }
  };

  // Run whenever filters change
  useEffect(() => {
    setArticles([]); // Clear old articles
    fetchNews(1);
    // CRITICAL FIX: The dependency array is correct.
  }, [country, category, searchQuery]);

  const fetchMoreData = () => {
    fetchNews(page + 1);
  };

  // If loading for the first time
  if (loading && articles.length === 0) {
    return <Spinner />;
  }

  // If no articles found after initial load
  if (articles.length === 0 && !loading) {
    const message = searchQuery
      ? `No results found for "${searchQuery}". Try a different search term.`
      : `No news articles found for this selection.`;

    return (
      <div
        className="container"
        style={{
          textAlign: "center",
          padding: "50px",
          fontSize: "1.2rem",
          color: "#888",
        }}
      >
        {message}
      </div>
    );
  }

  return (
    <div className="container">
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        // Use totalResults which is based on the API response.
        hasMore={articles.length < totalResults}
        loader={
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Spinner />
          </div>
        }
        endMessage={
          <div style={{ textAlign: "center", padding: "20px" }}>
            You have reached the end of the news.
          </div>
        }
      >
        <div className="row">
          {articles.map((item, index) => (
            <div className="col-lg-4 col-md-6" key={item.url + index}>
              <NewsItem
                title={item.title}
                description={item.description}
                // CRITICAL FIX: GNews uses 'image' for the image URL
                imageUrl={item.image}
                newsUrl={item.url}
                // CRITICAL FIX: GNews uses 'publishedAt' for the date
                date={item.publishedAt}
                sourceName={item.source?.name || "Unknown"}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default NewsList;
