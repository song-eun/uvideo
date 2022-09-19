import classes from "./SearchForm.module.css";
import { FaSearch } from "react-icons/fa";
import { useRef } from "react";

function SearchForm(props) {
  const inputRef = useRef("");

  function handleSubmit(event) {
    event.preventDefault();
    const enteredText = inputRef.current.value;
    console.log(enteredText);
    props.handleInputText(enteredText);
  }

  return (
    <div className={classes.wrap}>
      <div className={classes.search}>
        <FaSearch className={classes.icon} />
        <input ref={inputRef} className={classes.searchTerm} type="text" placeholder="Search" />
        <button className={classes.searchButton} onClick={handleSubmit} type="submit">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchForm;
