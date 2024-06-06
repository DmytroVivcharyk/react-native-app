import { useContext, useState, useEffect, createContext, ReactNode, FC } from 'react';
import { getCurrentUser } from '../lib/appwrite'
import { IUser } from '../types/userInterface'

interface IGlobalContext {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: IUser;
    setUser: (user: any) => void;
    isLoading: boolean;
    setIsLoading?: (value: boolean) => void;
}

interface IGlobalProvider {
    children: ReactNode;
}

const GlobalContext = createContext<IGlobalContext | undefined>(undefined);

export const useGlobalContext = (): IGlobalContext => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
}

export const GlobalProvider: FC<IGlobalProvider>  = ({ children }: IGlobalProvider) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [user, setUser] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(  () => {
        setIsLoading(true)
        getCurrentUser()
            .then(res => {
                if(res){
                    setIsLoggedIn(true)
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setUser(null)
                } 
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                isLoading,
                isLoggedIn,
                user,
                setUser,
                setIsLoggedIn
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}