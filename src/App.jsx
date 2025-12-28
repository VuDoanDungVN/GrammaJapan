import { useState, useEffect } from 'react'
import GrammarList from './components/GrammarList'
import GrammarDetail from './components/GrammarDetail'
import SearchBar from './components/SearchBar'
import StudyMode from './components/StudyMode'
import grammarData from './data/grammar.json'
import './App.css'

const STORAGE_KEY = 'gramman2_learned'

function App() {
  const [grammars, setGrammars] = useState([])
  const [selectedGrammar, setSelectedGrammar] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [studyMode, setStudyMode] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'detail'
  const [learnedIds, setLearnedIds] = useState(new Set())
  const [filterLearned, setFilterLearned] = useState('all') // 'all', 'learned', 'not-learned'

  useEffect(() => {
    // Load grammar data
    setGrammars(grammarData)
    
    // Load learned IDs from localStorage
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const ids = JSON.parse(saved)
        setLearnedIds(new Set(ids))
      } catch (e) {
        console.error('Error loading learned IDs:', e)
      }
    }
  }, [])

  // Save learned IDs to localStorage whenever it changes
  useEffect(() => {
    if (learnedIds.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(learnedIds)))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [learnedIds])

  const toggleLearned = (grammarId) => {
    setLearnedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(grammarId)) {
        newSet.delete(grammarId)
      } else {
        newSet.add(grammarId)
      }
      return newSet
    })
  }

  const filteredGrammars = grammars.filter(grammar => {
    // Filter by learned status
    if (filterLearned === 'learned' && !learnedIds.has(grammar.id)) {
      return false
    }
    if (filterLearned === 'not-learned' && learnedIds.has(grammar.id)) {
      return false
    }
    
    // Filter by search term
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      grammar.pattern.toLowerCase().includes(searchLower) ||
      grammar.meaning.toLowerCase().includes(searchLower) ||
      grammar.explanation.toLowerCase().includes(searchLower) ||
      grammar.examples.some(ex => 
        ex.vietnamese.toLowerCase().includes(searchLower) ||
        ex.japanese.toLowerCase().includes(searchLower)
      )
    )
  })

  const handleGrammarClick = (grammar) => {
    setSelectedGrammar(grammar)
    setViewMode('detail')
  }

  const handleBackToList = () => {
    setSelectedGrammar(null)
    setViewMode('list')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            📚 Học Ngữ Pháp N2
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              {grammars.length} mẫu ngữ pháp với giải thích và ví dụ chi tiết
            </p>
            {learnedIds.size > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  ✓ Đã học: {learnedIds.size}/{grammars.length} ({Math.round((learnedIds.size / grammars.length) * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {!studyMode ? (
          <>
            <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
              <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                resultCount={filteredGrammars.length}
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex gap-2 sm:gap-3 bg-white rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setFilterLearned('all')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-sm transition-all touch-manipulation ${
                      filterLearned === 'all'
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tất cả ({grammars.length})
                  </button>
                  <button
                    onClick={() => setFilterLearned('learned')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-sm transition-all touch-manipulation ${
                      filterLearned === 'learned'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Đã học ({learnedIds.size})
                  </button>
                  <button
                    onClick={() => setFilterLearned('not-learned')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-sm transition-all touch-manipulation ${
                      filterLearned === 'not-learned'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Chưa học ({grammars.length - learnedIds.size})
                  </button>
                </div>
                <button
                  onClick={() => setStudyMode(true)}
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-base sm:text-sm hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation"
                >
                  🎯 Chế độ Học
                </button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <GrammarList 
                grammars={filteredGrammars}
                onGrammarClick={handleGrammarClick}
                learnedIds={learnedIds}
                onToggleLearned={toggleLearned}
              />
            ) : (
              <GrammarDetail 
                grammar={selectedGrammar}
                onBack={handleBackToList}
                isLearned={selectedGrammar ? learnedIds.has(selectedGrammar.id) : false}
                onToggleLearned={() => selectedGrammar && toggleLearned(selectedGrammar.id)}
              />
            )}
          </>
        ) : (
          <StudyMode 
            grammars={grammars}
            onExit={() => setStudyMode(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App


