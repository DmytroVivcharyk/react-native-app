import { useContext, useState, useEffect, createContext, ReactNode, FC } from 'react';
import { Models } from 'react-native-appwrite';
import { getCurrentUser } from '../lib/appwrite'
import { IUser } from '../types/userInterface'

type UserType = IUser | Models.Document | null;

interface IGlobalContext {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: UserType;
    setUser: (user: IUser | null) => void;
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
    // const [user, setUser] = useState<IUser | null | Models.Document>(null)
    const [user, setUser] = useState<Models.Document | IUser | null>(null)
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