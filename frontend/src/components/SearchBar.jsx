import React from 'react';
import { IoSearch } from 'react-icons/io5';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-10"
        style={{ maxWidth: '320px' }}
      />
    </div>
  );
};

export default SearchBar;
