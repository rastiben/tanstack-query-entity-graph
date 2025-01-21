import { useMutation, useQuery } from '@tanstack/react-query';

const useUpdateName = () => {
    return useMutation({
        meta: {
            affects: ['name'],
        },
        mutationFn: async () => {
            localStorage.setItem('firstname', 'benoit');
            localStorage.setItem('lastname', 'rastier');
            return;
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

const User = () => {
    const { data: firstname } = useReadFistName();
    const { data: lastname } = useReadLastName();
    const { mutate: updateName } = useUpdateName();

    return (
        <>
            <button onClick={() => updateName()}>Update name</button>
            <div>Firstname: {firstname}</div>
            <div>Lastname: {lastname}</div>
        </>
    );
};

export default User;
