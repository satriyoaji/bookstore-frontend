
"use client"
import React, { useEffect, useState } from 'react'
import classes from './bookCatalog.module.css'
import Pagination from '../pagination/Pagination'
import BookCard from '../bookCard/BookCard'

const BookCatalog = () => {
  const [title, setTitle] = useState("")
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const BASE_URL = `http://localhost:8080/books`
  // pagination
  const [itemOffset, setItemOffset] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)

  useEffect(() => {
    const getData = setTimeout(async () => {
      try {
        setIsLoading(true)
        let apiURL = BASE_URL + `?name=${title}`
        // const endOffset = itemOffset + itemsPerPage
        apiURL = apiURL + `&page=${itemOffset+1}&limit=${itemsPerPage}`
        // const currentItems = books.slice(itemOffset, endOffset)
        const res = await fetch(apiURL)
        const { rows } = await res.json()

        setBooks(rows)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    })

    return () => {
      clearTimeout(getData)
    }
  }, [title])

  return (
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <div className={classes.titles}>
            <h5>Catalog of books</h5>
            <h2>Find your desired books</h2>
          </div>
          {isLoading && (
              <div className={classes.loader} />
          )}
          <div className={classes.books}>
            {!isLoading && (
                books?.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                    />
                ))
            )}
          </div>
          {!isLoading && (
              <Pagination
                  setItemOffset={setItemOffset}
                  itemsPerPage={itemsPerPage}
                  books={books}
              />
          )}
        </div>
      </div>
  )
}

export default BookCatalog
