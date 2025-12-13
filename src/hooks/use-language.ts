import type {LanguageContextValue} from "../types";
import {useContext} from "react";
import {LanguageContext} from "../provider/context";

export const useLanguage = (): LanguageContextValue => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}