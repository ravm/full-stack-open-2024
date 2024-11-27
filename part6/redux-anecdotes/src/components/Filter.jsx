import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    event.preventDefault();
    dispatch(setFilter(event.target.value));
  }

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter
      <input
        type="text"
        name="filter"
        onChange={handleChange}
      />
    </div>
  );
}

export default Filter;
