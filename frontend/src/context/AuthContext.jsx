import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem("accessToken")
    );

    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem("refreshToken")
    );

    const [loading, setLoading] = useState(true);

    const login = async (
        employeeId,
        username,
        password
    ) => {
        const response = await authService.login(
            employeeId,
            username,
            password
        );

        console.log(
            "LOGIN RESPONSE FROM AUTH SERVICE:",
            response
        );

        /*
         * Possible backend responses:
         *
         * {
         *   access: "...",
         *   refresh: "...",
         *   user: {...}
         * }
         *
         * OR
         *
         * {
         *   success: true,
         *   data: {
         *      access: "...",
         *      refresh: "...",
         *      user: {...}
         *   }
         * }
         */

        let loginData = response;

        if (response?.data?.access) {
            loginData = response.data;
        }

        const access = loginData?.access;
        const refresh = loginData?.refresh;
        const authenticatedUser =
            loginData?.user;

        console.log(
            "LOGIN DATA:",
            loginData
        );

        console.log(
            "AUTHENTICATED USER:",
            authenticatedUser
        );

        if (!access) {
            throw new Error(
                "Access token was not returned by the server."
            );
        }

        if (!refresh) {
            throw new Error(
                "Refresh token was not returned by the server."
            );
        }

        if (!authenticatedUser) {
            throw new Error(
                "User information was not returned by the server."
            );
        }

        localStorage.setItem(
            "accessToken",
            access
        );

        localStorage.setItem(
            "refreshToken",
            refresh
        );

        localStorage.setItem(
            "user",
            JSON.stringify(
                authenticatedUser
            )
        );

        setAccessToken(access);
        setRefreshToken(refresh);
        setUser(authenticatedUser);

        console.log(
            "LOGIN SUCCESS:",
            authenticatedUser
        );

        return authenticatedUser;
    };

    const logout = async () => {
        try {
            if (refreshToken) {
                await authService.logout(
                    refreshToken
                );
            }
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );
        }

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "user"
        );

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const response =
                    await authService.getCurrentUser();

                console.log(
                    "CURRENT USER RESPONSE:",
                    response
                );

                let currentUser =
                    response?.data || response;

                /*
                 * If backend returns:
                 *
                 * {
                 *   data: {
                 *      user: {...}
                 *   }
                 * }
                 */

                if (currentUser?.user) {
                    currentUser =
                        currentUser.user;
                }

                setUser(currentUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        currentUser
                    )
                );

            } catch (error) {
                console.error(
                    "AUTH INITIALIZATION ERROR:",
                    error
                );

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "refreshToken"
                );

                localStorage.removeItem(
                    "user"
                );

                setAccessToken(null);
                setRefreshToken(null);
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                loading,

                isAuthenticated:
                    Boolean(
                        accessToken &&
                        user
                    ),

                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}