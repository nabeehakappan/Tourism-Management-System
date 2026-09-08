export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('traveliaUser');

        if (!user) {
            return null;
        }

        return JSON.parse(user);
    } catch {
        return null;
    }
};

export const isLoggedIn = () => {
    return getCurrentUser() !== null;
};

export const isAdmin = () => {
    const user = getCurrentUser();

    return user?.role === 'ADMIN';
};

export const isUser = () => {
    const user = getCurrentUser();

    return user?.role === 'USER';
};

export const logout = () => {
    localStorage.removeItem('traveliaUser');
    window.location.href = '/login';
};

