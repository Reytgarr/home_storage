'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [selectedBox, setSelectedBox] = useState('');
  const [boxNames, setBoxNames] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [items, setItems] = useState([]);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBoxName, setNewBoxName] = useState(''); // State for new box name

  const router = useRouter();
  const boxParam = router.query?.box || '';

  useEffect(() => {
    async function fetchBoxNames() {
      try {
        const response = await fetch('/api/box_names');
        if (!response.ok) {
          throw new Error('Failed to fetch box names');
        }
        const boxNamesData = await response.json();
        setBoxNames(boxNamesData);

        // If boxParam is provided, set selectedBox to boxParam
        if (boxParam) {
          setSelectedBox(boxParam);
        } else if (boxNamesData.length > 0) {
          // If no boxParam is provided but boxNamesData is available, default to the first box
          setSelectedBox(boxNamesData[0].box_name);
        }
      } catch (error) {
        console.error('Error fetching box names:', error);
      }
    }

    fetchBoxNames();
  }, [boxParam]); // Re-fetch box names if boxParam changes

  useEffect(() => {
    if (selectedBox) {
      fetchData(selectedBox, setData);
    }
  }, [selectedBox]);

  const fetchData = async (selectedBox, setData) => {
    try {
      const response = await fetch(`/api/test?box=${selectedBox}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBoxChange = async (event) => {
    const newSelectedBox = event.target.value;
    setSelectedBox(newSelectedBox);
    router.push(`/?box=${newSelectedBox}`);

    if (newSelectedBox) {
      fetchData(newSelectedBox, setData);
    }
  };

  const handleNewBoxInputChange = (event) => {
    setNewBoxName(event.target.value); // Update new box name state
  };

  const handleAddNewBox = async () => {
    if (newBoxName.trim() !== '') {
      try {
        const response = await fetch('/api/insert_box', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set Content-Type header
          },
          body: JSON.stringify({
            boxName: newBoxName.trim(),
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to insert new box');
        }
  
        setBoxNames([...boxNames, { box_name: newBoxName.trim() }]);
        setNewBoxName(''); // Clear input field
      } catch (error) {
        console.error('Error inserting new box:', error);
      }
    }
  };
  


  const handleItemNameChange = (event) => {
    setItemName(event.target.value);
  };

  const handleItemQtyChange = (event) => {
    setItemQty(parseInt(event.target.value)); // Parse the input value as an integer
  };

  const handleItemQtyChangeForItem = async (event, itemId) => {
    const newQty = parseInt(event.target.value);
    if (!isNaN(newQty) && newQty >= 0) {
      try {
        const response = await fetch(`/api/update_item_qty?itemId=${itemId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newQty }),
        });

        if (!response.ok) {
          throw new Error('Failed to update item quantity');
        }

        //fetchData();
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
      fetchData();
    }
  };

  const addItem = async () => {
    if (itemName && itemQty > 0) {
      try {
        const response = await fetch('/api/insert_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            box: selectedBox,
            itemName,
            itemQty,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add item');
        }

        fetchData();
      } catch (error) {
        console.error('Error adding item:', error);
      }

      setItemName('');
      setItemQty(1);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`/api/remove_item?itemId=${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      fetchData();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto dark:bg-gray-800 max-w-6xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center flex-wrap">
          <span className="mr-2">Items from</span>
          <select
            className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 dark:text-gray-300 mr-2 mb-2"
            value={selectedBox}
            onChange={handleBoxChange}
          >
            {boxNames.map((box, index) => (
              <option key={index} value={box.box_name}>{box.box_name}</option>
            ))}
          </select>
          {/* Text input for adding a new box */}
          <input
            type="text"
            placeholder="New box name"
            value={newBoxName}
            onChange={handleNewBoxInputChange}
            className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 dark:text-gray-300 mr-2 mb-2"
          />
          <button
            onClick={handleAddNewBox}
            className="px-4 py-2 bg-blue-500 text-white rounded-md mb-2"
          >
            Add
          </button>
          {/* Search input */}
          <input
            type="text"
            placeholder="Search items..."
            className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 dark:text-gray-300 mb-2"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap">
        <div className="flex-1 mr-2 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={itemName}
            onChange={handleItemNameChange}
          />
        </div>
        <div className="flex-2 ml-2 mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Quantity</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={itemQty}
            onChange={handleItemQtyChange}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2 mb-2"
          onClick={addItem}
        >
          Add
        </button>
      </div>
      <table className="w-full divide-y divide-gray-700 dark:divide-gray-400">
        <thead className="bg-gray-800 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">Item Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">Item Qty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700 w-16"></th> {/* Set a fixed width */}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700 dark:bg-gray-800 dark:divide-gray-400">
          {filteredData.map((item, index) => (
            <tr
              key={item.item_id}
              className={`bg-${index % 2 === 0 ? 'gray-800' : 'gray-700'} hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-200`}
              onMouseEnter={() => setHoveredItemIndex(index)}
              onMouseLeave={() => setHoveredItemIndex(null)}
            >
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 border-b border-gray-700">{item.item_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 border-b border-gray-700">
                <input
                  type="number"
                  className="w-16 border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={item.item_qty}
                  onChange={(e) => handleItemQtyChangeForItem(e, item.item_id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 border-b border-gray-700">
                {hoveredItemIndex === index && (
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                    onClick={() => handleRemoveItem(item.item_id)}
                  >
                    X
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  }  