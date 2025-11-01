import SearchBar from '../SearchBar';
import { useState } from 'react';

export default function SearchBarExample() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-8 bg-background">
      <SearchBar 
        value={search} 
        onChange={(value) => {
          setSearch(value);
          console.log('Search:', value);
        }} 
      />
    </div>
  );
}