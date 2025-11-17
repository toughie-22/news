// netlify/functions/fetchNews.js
import fetch from "node-fetch";

export async function handler(event) {
  const { search, country, category, page } = event.queryStringParameters || {};
  // NOTE: I kept your original API key. It's best practice to use a Netlify Environment Variable for this.
  const API_KEY = "cf93adbc461d829a05e162ae825e66f0";
  const pageSize = 9;

  let url = "";

  if (search) {
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      search
    )}&token=${API_KEY}&lang=en&max=${pageSize}&page=${page || 1}`;
  } else {
    // topic in GNews API is called 'topic', not 'category' in the top-headlines endpoint
    url = `https://gnews.io/api/v4/top-headlines?token=${API_KEY}&lang=en&max=${pageSize}&country=${
      country || "us"
    }&topic=${category || ""}&page=${page || 1}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // GNews API returns an array of articles directly under the 'articles' property
    if (data.errors) {
      // Handle API-specific errors (e.g., rate limit, invalid topic)
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "GNews API Error",
          details: data.errors,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch news",
        details: error.message,
      }),
    };
  }
}
