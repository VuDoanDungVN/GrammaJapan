import { ArrowRight, CheckCircle2 } from 'lucide-react'

function GrammarCard({ grammar, onClick, isLearned, onToggleLearned }) {
  const handleToggle = (e) => {
    e.stopPropagation()
    onToggleLearned(grammar.id)
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-300 cursor-pointer border ${
        isLearned ? 'border-green-300 bg-green-50/30' : 'border-gray-100 hover:border-primary-300'
      } group touch-manipulation relative`}
    >
      <button
        onClick={handleToggle}
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full transition-all touch-manipulation active:scale-90 ${
          isLearned 
            ? 'bg-green-500 text-white hover:bg-green-600 shadow-md' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-green-500'
        }`}
        aria-label={isLearned ? 'Đánh dấu chưa học' : 'Đánh dấu đã học'}
      >
        <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isLearned ? 'fill-current scale-110' : ''}`} />
      </button>

      <div className="flex items-start justify-between mb-3 sm:mb-4 pr-8 sm:pr-10">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs sm:text-sm font-semibold text-primary-600">
              #{grammar.id}
            </span>
            {isLearned && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-fade-in">
                ✓ Đã học
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors break-words">
            {grammar.pattern}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
            {grammar.meaning}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </div>
      
      {grammar.examples && grammar.examples.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1 sm:mb-2">Ví dụ:</p>
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-1 italic">
            {grammar.examples[0].vietnamese}
          </p>
        </div>
      )}
    </div>
  )
}

export default GrammarCard


