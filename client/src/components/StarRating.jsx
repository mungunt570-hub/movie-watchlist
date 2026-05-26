export default function StarRating({ value, onChange, max = 10 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          className={`text-lg transition-colors ${
            n <= value ? 'text-yellow-400' : 'text-dark-500 hover:text-yellow-300'
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-400 font-body self-center">{value}/10</span>
    </div>
  );
}
