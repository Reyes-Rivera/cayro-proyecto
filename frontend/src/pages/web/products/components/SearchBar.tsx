"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [search, setSearch] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Buscando:", search)
  }

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Search className="text-gray-400" />
        </button>
      </div>
    </form>
  )
}

