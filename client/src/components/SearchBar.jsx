function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search by filename..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
  );
}

export default SearchBar;