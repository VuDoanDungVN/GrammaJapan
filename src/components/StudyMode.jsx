import { useState, useEffect } from 'react'
import { X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

function StudyMode({ grammars, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studied, setStudied] = useState(new Set())

  const currentGrammar = grammars[currentIndex]
  const progress = ((currentIndex + 1) / grammars.length) * 100

  useEffect(() => {
    setShowAnswer(false)
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < grammars.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setStudied(new Set([...studied, currentIndex]))
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setStudied(new Set())
  }

  if (!currentGrammar) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có dữ liệu để học</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <button
          onClick={onExit}
          className="flex items-center justify-center text-white hover:text-gray-200 active:text-gray-300 transition-colors py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 touch-manipulation"
        >
          <X className="w-5 h-5 mr-2" />
          <span className="text-sm sm:text-base">Thoát chế độ học</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center text-white hover:text-gray-200 active:text-gray-300 transition-colors py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 touch-manipulation"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          <span className="text-sm sm:text-base">Bắt đầu lại</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-semibold text-sm sm:text-base">
            {currentIndex + 1} / {grammars.length}
          </span>
          <span className="text-white font-semibold text-sm sm:text-base">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2.5 sm:h-3">
          <div
            className="bg-white rounded-full h-2.5 sm:h-3 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 min-h-[400px] sm:min-h-[500px] flex flex-col">
        <div className="flex-1">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-block bg-primary-100 text-primary-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              #{currentGrammar.id}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 break-words px-2">
              {currentGrammar.pattern}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-600 font-semibold px-2">
              {currentGrammar.meaning}
            </p>
          </div>

          {!showAnswer ? (
            <div className="text-center py-8 sm:py-12">
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-primary-600 hover:to-primary-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation"
              >
                Xem giải thích và ví dụ
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-5 border-l-4 border-primary-500">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Giải thích:</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {currentGrammar.explanation}
                </p>
              </div>

              {currentGrammar.examples && currentGrammar.examples.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Ví dụ:</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {currentGrammar.examples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 border border-blue-100"
                      >
                        <p className="text-sm sm:text-base text-gray-700 mb-2">{example.vietnamese}</p>
                        <p className="text-base sm:text-lg text-gray-800 font-semibold break-words">
                          {example.japanese}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentGrammar.notes && (
                <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-400">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Chú ý:</h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentGrammar.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center justify-center px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation order-2 sm:order-1"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Trước
          </button>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="px-4 sm:px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-primary-600 active:scale-95 transition-colors touch-manipulation order-1 sm:order-2"
          >
            {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === grammars.length - 1}
            className="flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:from-primary-600 hover:to-primary-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation order-3"
          >
            Sau
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyMode


