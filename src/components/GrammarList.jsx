import GrammarCard from './GrammarCard'

function GrammarList({ grammars, onGrammarClick, learnedIds, onToggleLearned }) {
  if (grammars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không tìm thấy mẫu ngữ pháp nào</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {grammars.map((grammar, index) => (
        <div
          key={grammar.id}
          className="fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <GrammarCard 
            grammar={grammar}
            onClick={() => onGrammarClick(grammar)}
            isLearned={learnedIds.has(grammar.id)}
            onToggleLearned={onToggleLearned}
          />
        </div>
      ))}
    </div>
  )
}

export default GrammarList


