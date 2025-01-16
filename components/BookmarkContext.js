import React, { createContext, useState, useContext } from 'react'

const BookmarkContext = createContext()

export const BookmarkProvider = ({ children }) => {
    const [bookmarks, setBookmarks] = useState([])

    const toggleBookmark = (item) => {
        setBookmarks(
            (prev) =>
                prev.some((b) => b.id === item.id)
                    ? prev.filter((b) => b.id !== item.id) // Remove if exists
                    : [...prev, item] // Add if not exists
        )
    }

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark }}>
            {children}
        </BookmarkContext.Provider>
    )
}

export const useBookmarks = () => useContext(BookmarkContext)
