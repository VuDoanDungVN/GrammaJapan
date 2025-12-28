import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react'

function GrammarDetail({ grammar, onBack, isLearned, onToggleLearned }) {
  if (!grammar) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto fade-in px-2 sm:px-0">
      <button
        onClick={onBack}
        className="mb-4 sm:mb-6 flex items-center text-gray-600 hover:text-primary-600 active:text-primary-700 transition-colors py-2 touch-manipulation"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-sm sm:text-base">Quay lại danh sách</span>
      </button>

      <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 ${isLearned ? 'border-2 border-green-300' : ''}`}>
        <div className="mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
              #{grammar.id}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">
                  {grammar.pattern}
                </h1>
                {isLearned && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 whitespace-nowrap animate-fade-in">
                    ✓ Đã học
                  </span>
                )}
              </div>
              <p className="text-base sm:text-lg text-primary-600 font-semibold">
                {grammar.meaning}
              </p>
            </div>
            <button
              onClick={onToggleLearned}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all touch-manipulation active:scale-90 ${
                isLearned
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={isLearned ? 'Đánh dấu chưa học' : 'Đánh dấu đã học'}
            >
              <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isLearned ? 'fill-current scale-110' : ''}`} />
              <span className="hidden sm:inline">
                {isLearned ? 'Đã học' : 'Đánh dấu đã học'}
              </span>
            </button>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Giải thích</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-primary-500">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {grammar.explanation}
            </p>
          </div>
        </div>

        {grammar.examples && grammar.examples.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">💡</span>
              <span>Ví dụ</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {grammar.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 md:p-5 border border-blue-100 slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-2">
                    <p className="text-sm sm:text-base text-gray-700 font-medium">
                      {example.vietnamese}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-base sm:text-lg text-gray-800 font-semibold break-words">
                      {example.japanese}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {grammar.notes && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📝</span>
              <span>Chú ý</span>
            </h2>
            <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-400">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {grammar.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GrammarDetail


