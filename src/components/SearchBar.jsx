import { Search } from 'lucide-react'

function SearchBar({ searchTerm, setSearchTerm, resultCount }) {
  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm ngữ pháp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3.5 sm:py-3 text-base sm:text-sm rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all duration-300 shadow-sm focus:shadow-md touch-manipulation"
        />
      </div>
      {searchTerm && (
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          Tìm thấy {resultCount} kết quả
        </p>
      )}
    </div>
  )
}

export default SearchBar


