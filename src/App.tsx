import { useMutation, useQuery } from '@tanstack/react-query';

const useUpdateName = () => {
  return useMutation({
    entities: ['name'],
    mutationFn: () => {
      localStorage.setItem('firstname', 'benoit');
      localStorage.setItem('lastname', 'rastier');
    },
  });
};

const useReadFistName = () => {
  return useQuery({
    queryKey: ['firstname'],
    queryFn: () => localStorage.getItem('firstname'),
  });
};

const useReadLastName = () => {
  return useQuery({
    queryKey: ['lastname'],
    queryFn: () => localStorage.getItem('lastname'),
  });
};

function App() {
  const { data: firstname } = useReadFistName();
  const { data: lastname } = useReadLastName();
  const { mutate: updateName } = useUpdateName();

  return (
    <>
      <button onClick={updateName}>Update name</button>
      <div>Firstname: {firstname}</div>
      <div>Lastname: {lastname}</div>
    </>
  );
}

export default App;
