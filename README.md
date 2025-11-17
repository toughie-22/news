                                                  #React News Website — READMe
This project is a React-based News Website built using Vite.

The purpose of the application is to fetch and display real-time news articles from external news APIs, organize them into categories, and present them in a clean, responsive interface.

                    The project emphasizes:

i. Clean component structure

ii. Reusable and maintainable UI parts

iii. A centralized API utility (fetchNews.js)

iv. Graceful error handling

v. A simple and user-friendly design

                          Features

i. Dynamic news fetching

ii. Category-based filtering

iii. Search functionality

iv. Responsive hero section

v. Clean and minimal layout

vi. Reusable components such as NewsList, NewsItem, Navbar, and Footer

src/
├── Assets/
      ├──hero-bg.jpg
      ├──vid.mp4
      ├──placeholder.jpg
      ├──logo.jpg
      
├── components/
│   ├── NavBar.jsx
│   ├── HeroSection.jsx
│   ├── NewsList.jsx
│   └── NewsItem.jsx
     └── Footer.jsx
     └── CountrySelector.jsx
│
├── netlify/functions
│   └── fetchNews.js
│
├── App.jsx
└── main.jsx
└── App.css

                        How fetchNews.js Works

fetchNews.js is a centralized utility for making API calls. Instead of writing API code inside each component, all fetching logic is isolated in this file.

                Responsibilities of fetchNews.js

i.Build the API endpoint URL

ii. Make the actual network request

iii. Apply the API key

iv. Handle errors and unexpected responses

v. Return clean, standardized data to the components

                     Why this approach was chosen

i. Cleaner, more readable components

ii. All API logic centralized in one location

iii. Easy to switch to another news provider in the future

iv. Easier troubleshooting and debugging
API Issues Encountered

                  This project originally used two APIs:
  
i. GNews API (free tier)

ii. NewsAPI.org (free tier)

Both APIs worked correctly when running the project locally. However, once deployed to Netlify or Vercel, they stopped functioning entirely.

                        Reason for the failure

i. The issue was related to CORS and free-tier restrictions:

ii. Free-tier news APIs often block production domains

iii. They may only allow requests from localhost

iv. They do not provide the required CORS headers

v. Browsers automatically block these requests for security reasons

                            Verification

To confirm the source of the problem, a local Netlify server was installed and the project was run behind its proxy:

netlify dev


                    When running through Netlify Dev:

i. All API calls worked

ii. News articles were successfully displayed

iv. This confirmed that the issue was from the API provider and not the codebase or frontend framework.

                              Workaround

i. Due to the strict API limitations, the only stable solution is to:

ii. Use a different API with proper CORS support, or

iii. Proxy API requests through a backend or serverless function

iv. The deployed version no longer sends direct browser requests to GNews or NewsAPI because they do not support open CORS on the free tier.




