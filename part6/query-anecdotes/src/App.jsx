import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./requests";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useNotificationDispatch } from "./NotificationContext";

const App = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
    },
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    dispatch({ type: "SET_NOTIFICATION", payload: `Anecdote '${anecdote.content}' voted` });
    setTimeout(() => {
      dispatch({ type: "REMOVE_NOTIFICATION" });
    }, 5000);
  }

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) return <div>Loading data..</div>

  if (result.isError) return <div>Anecdote service not available due to problems in server</div>

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;
