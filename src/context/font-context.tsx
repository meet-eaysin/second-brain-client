import React, { createContext, useContext, useEffect, useState } from 'react'
import {fonts} from "@/app/config";

type Font = (typeof fonts)[number]

interface FontContextType {
    font: Font
    setFont: (font: Font) => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {
    const [font, _setFont] = useState<Font>(() => {
        const savedFontValue = localStorage.getItem('font')
        const savedFont = fonts.find(f => f.value === savedFontValue)
        return savedFont || fonts[0]
    })

    useEffect(() => {
        const applyFont = (fontObj: Font) => {
            const root = document.documentElement
            // Remove existing font classes
            root.classList.forEach((cls) => {
                if (cls.startsWith('font-')) root.classList.remove(cls)
            })
            // Add the new font class
            root.classList.add(fontObj.class)
        }

        applyFont(font)
    }, [font])

    const setFont = (font: Font) => {
        localStorage.setItem('font', font.value)
        _setFont(font)
    }

    return <FontContext value={{ font, setFont }}>{children}</FontContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
    const context = useContext(FontContext)
    if (!context) {
        throw new Error('useFont must be used within a FontProvider')
    }
    return context
}