const localstorage = {
  save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Handle any potential errors, such as exceeding storage quota
      console.error("Error saving to Local Storage:", error);
    }
  },

  // Function 2: Retrieve a string from Local Storage by its key
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch (error) {
      // Handle any potential errors, such as exceeding storage quota
      console.error("Error retrieving from Local Storage:", error);
      return null; // Return null in case of an error
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

export default localstorage;
