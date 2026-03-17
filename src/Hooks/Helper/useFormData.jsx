import { useState } from "react";
import { setItemToLocalStorage } from "src/Functions/localStorageFunctions";

const useFormData = ({
  initialValues,
  onSubmit,
  storeInLocalStorage,
  localStorageKey,
}) => {
  const [values, setValues] = useState(() => {
    if (!storeInLocalStorage) return initialValues;
    const valuesLocal = localStorage.getItem(localStorageKey);
    return valuesLocal ? JSON.parse(valuesLocal) : initialValues;
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((prevValues) => {
      const newValues = { ...prevValues, [name]: value };

      if (storeInLocalStorage) setItemToLocalStorage(localStorageKey, newValues);
      return newValues;
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return { values, handleChange, handleSubmit };
};

export default useFormData;
