export const signup = async (name, email, username, password) => {
    console.log(name, email, username, password);
};

export const getUser = async () => {
    console.log('Not implemented.');
};

const userApi = { signup, getUser };

export default userApi;
