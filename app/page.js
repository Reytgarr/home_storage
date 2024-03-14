'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';

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
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const boxParam = searchParams.get('box');




//register

const handleRegister = async () => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password 
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
    router.push('/');
    setUsername('');
    setPassword('');
    // Handle successful registration
    // For example, redirect to the login page or show a success message
  } catch (error) {
    console.error('Error during registration:', error);
  }
};


//login

useEffect(() => {
  // Check for the presence of the isLoggedIn cookie
  const storedLoggedInStatus = Cookies.get('loggedIn');
  // Update the login state based on the cookie value
  setIsLoggedIn(storedLoggedInStatus === 'true');
}, []);


const handleLogin = async () => {
  try {
    if (!password) {
      console.error('Password is missing');
      // Display an error message to the user indicating that the password is required
      return;
    }
    // Send a request to your server to validate user credentials
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    // If authentication is successful, setLoggedIn(true)
    setIsLoggedIn(true);
    Cookies.set('loggedIn', 'true', { expires: 365 });
    // Redirect the user to the dashboard or desired page
    router.push('/');
    setUsername('');
    setPassword('');


  } catch (error) {
    setError('Invalid username or password');
  }
};

  // Function to handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    Cookies.remove('loggedIn');
  };



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
    console.log(newQty)
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
    <div className="mx-auto mt-8 max-w-7xl">
    {isLoggedIn ? (
      <div className="w-full max-w-4xl mx-auto">
        <div className='flex items-center justify-end'>
        <button onClick={handleLogout} className="mr-auto mb-4 px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
        <input
              type="text"
              placeholder="Search items..."
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 dark:text-gray-300 mb-2"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
        </div>
        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-700 px-4 py-3">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-200 mr-2">Items from</span>
              <select
                className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 dark:text-gray-300 mr-2 mb-2"
                value={selectedBox}
                onChange={handleBoxChange}
              >
                {boxNames.map((box, index) => (
                  <option key={index} value={box.box_name}>{box.box_name}</option>
                ))}
              </select>
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
            </div>

          </div>
      <table className="w-full divide-y divide-gray-700 dark:divide-gray-400">
        <thead className="bg-gray-800 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700 w-3/5">Item Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700 w-1/5">Item Qty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700 w-1/5"></th> {/* Set a fixed width */}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700 dark:bg-gray-800 dark:divide-gray-400">
          {filteredData.map((item, index) => (
            <tr
              key={item.item_id}
              className={`bg-${index % 2 === 0 ? 'gray-700' : 'gray-800'} hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200`}
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
                    className="px-2 bg-red-500 text-white rounded-md"
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
      <div className="py-2 max-w-3xl mx-auto">
  <div className="flex items-center justify-end"> {/* Center items horizontally */}
    <div className="w-2/5 mr-2"> {/* Set width for item name */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
      <input
        type="text"
        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={itemName}
        onChange={handleItemNameChange}
      />
    </div>
    <div className="w-24 mr-2"> {/* Set width for item quantity */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Quantity</label>
      <input
        type="number"
        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={itemQty}
        onChange={handleItemQtyChange}
      />
    </div>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2 "
      onClick={addItem}
    >
      Add
    </button>
  </div>
</div>
    </div>
    </div>
      ) : (
<div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="bg-gray-900 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2">Username</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            Log In
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
      )}
    </div>
  );
  }  