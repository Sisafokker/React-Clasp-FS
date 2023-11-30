// src/components/actions/sortingTables.js // Custome Shared Hook
import { useState, useMemo } from 'react';

export const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = parseValue(a[sortConfig.key]);
        const bValue = parseValue(b[sortConfig.key]);

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

// Helper to parse diff value types
function parseValue(value) {
  if (typeof value === 'string') {
    
    const date = new Date(value); // Check if date
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    if (/^\$?\d+(\.\d+)?\$?$/.test(value) || /^\d+(\.\d+)?€?$/.test(value)) { // Checks if currency format and convert to number
      return parseFloat(value.replace(/[^\d.-]/g, ''));
    }
    
    return value.toLowerCase(); // Default string
  }

  return value; // Default for other types
}

