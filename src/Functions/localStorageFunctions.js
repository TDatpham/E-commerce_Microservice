export const getLocalStorage = (keyName) => {
  const localData = localStorage.getItem(keyName);
  return localData ? JSON.parse(localData) : null;
};

export const setItemToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
