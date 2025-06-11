import { useSelector } from 'react-redux';
import { useState } from 'react';
import Pages from './components/Pages/Pages';
import Productcard from './components/Productcard/Productcard';
import GlobalToastContainer from './components/GlobalToastContainer';
function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");

  const products = useSelector((state) => state.products.products);

  // Handle text input filter
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // Handle category/price filter (radio button)
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value === "All" ? null : value);
  };

  // Apply filters
  const filteredData = (products, selected, query) => {
    let filteredProducts = [...products];

    // Category / Price filtering
    if (selected) {
      if (selected.includes('-')) {
        const [min, max] = selected.split('-').map(Number);
        filteredProducts = filteredProducts.filter(
          (item) => item.listPrice >= min && item.listPrice < max
        );
      } else if (selected.includes('+')) {
        const min = Number(selected.split('+')[0]);
        filteredProducts = filteredProducts.filter(
          (item) => item.listPrice >= min
        );
      } else {
        filteredProducts = filteredProducts.filter(
          (item) =>
            item.category === selected ||
            item.productName === selected ||
            item.division === selected ||
            item.subCategory === selected
        );
      }
    }

    // Search filtering
    if (query) {
      filteredProducts = filteredProducts.filter((item) =>
        item.productName.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Return product cards
    return filteredProducts.map((productItem) => (
      <Productcard key={productItem.articleNo} productItem={productItem} />
    ));
  };

  const result = filteredData(products, selectedCategory, query);

  return (
    <>
       <GlobalToastContainer />
      <Pages
        handleChange={handleChange}
        query={query}
        handleInputChange={handleInputChange}
        result={result}
      />
    </>
  );
}

export default App;
