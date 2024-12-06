import React, { useState, useCallback } from "react";
import axios from "axios";
import { SearchIcon } from "@heroicons/react/outline";
import debounce from "lodash.debounce";
import { useAuth } from "../../../../../context/authContext";
import SearchResult from "./searchResult";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const {authToken} = useAuth()

  const fetchResults = useCallback(
    debounce(async (searchQuery) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_HOST2}/users/find`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            params: { q: searchQuery },
          }
        );
        setResults(response.data.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSearchClick = () => {
    if (query.length >= 3) {
      fetchResults(query);
    }
  };


  return (
    <div className="flex flex-col items-center py-8">
      {/* Search Bar */}
      <div className="relative w-[90%] mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearchClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
      <SearchResult props={{loading:loading, results:results}} />
    </div>
  );
};

export default SearchBar;
