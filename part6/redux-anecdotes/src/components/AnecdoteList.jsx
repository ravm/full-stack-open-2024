import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { addNotification, removeNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
  );
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter === "") {
      return state.anecdotes;
    }
    return state.anecdotes.filter(obj => obj.content.toLowerCase().includes(state.filter.toLowerCase()));
  });
  const dispatch = useDispatch();

  return(
    <ul>
      {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() =>
            {
              dispatch(voteAnecdote(anecdote.id))
              dispatch(addNotification(`You voted '${anecdote.content}'`))
              setTimeout(() => {
                dispatch(removeNotification());
              }, 5000)
            }
          }
        />
      )}
    </ul>
  );
}

export default AnecdoteList;
