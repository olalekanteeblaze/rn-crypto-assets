import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type defaultStateProps = {
    favorites: Array<any>,
    setFavorites: Dispatch<SetStateAction<any[]>>
}
const defaultState: defaultStateProps = {
    favorites: [],
    setFavorites: () => {}
}
const GlobalStateContext = createContext(defaultState);

const GlobalStateContextProvider = ({ children }: any) => {
    const [favorites, setFavorites] =  useState<any[]>([])
    return (
        <GlobalStateContext.Provider value={{ favorites, setFavorites }}>{children}</GlobalStateContext.Provider>
    )
}

export const useFavorites = () => {
    const {favorites, setFavorites} = useContext(GlobalStateContext)
    return {favorites, setFavorites}
}
export default GlobalStateContextProvider