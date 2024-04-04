// "use client"
// import React, { useEffect, useState } from 'react'
// import classes from './bookCatalog.module.css'
// import Pagination from '../pagination/Pagination'
// import BookCard from '../bookCard/BookCard'
//
// const BookCatalog = () => {
//   const [title, setTitle] = useState("the lord of the rings")
//   const [books, setBooks] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const BASE_URL = `https://openlibrary.org/search.json?title=${title}`
//   // pagination
//   const [itemOffset, setItemOffset] = useState(0)
//   const itemsPerPage = 3
//
//   useEffect(() => {
//     const getData = setTimeout(async () => {
//       try {
//         setIsLoading(true)
//         const res = await fetch(BASE_URL)
//         const { docs } = await res.json()
//
//         let books = docs.slice(0, 50)
//
//         books = books.map((book) => {
//           const id = book.key.split("/")[2]
//
//           return {
//             id: id,
//             title: book.title,
//             cover_id: book.cover_i,
//             author_name: book.author_name,
//             public_rating: book.ratings_average,
//             published_year: book.first_published_year
//           }
//         })
//
//         const formattedBooks = []
//         for (let i = 0; i < books.length; i++) {
//           if (books[i]?.cover_id) {
//             formattedBooks.push(books[i])
//           }
//         }
//
//         setBooks(formattedBooks)
//       } catch (error) {
//         console.log(error)
//       }
//       setIsLoading(false)
//     })
//
//     return () => {
//       clearTimeout(getData)
//     }
//   }, [title])
//
//   const endOffset = itemOffset + itemsPerPage
//   const currentItems = books.slice(itemOffset, endOffset)
//
//   return (
//     <div className={classes.container}>
//       <div className={classes.wrapper}>
//         <div className={classes.titles}>
//           <h5>Catalog of books</h5>
//           <h2>Find your desired books</h2>
//         </div>
//         {isLoading && (
//           <div className={classes.loader} />
//         )}
//         <div className={classes.books}>
//           {!isLoading && (
//             currentItems?.map((book) => (
//               <BookCard
//                 key={book.id}
//                 book={book}
//               />
//             ))
//           )}
//         </div>
//         {!isLoading && (
//           <Pagination
//             setItemOffset={setItemOffset}
//             itemsPerPage={itemsPerPage}
//             books={books}
//           />
//         )}
//       </div>
//     </div>
//   )
// }
//
// export default BookCatalog

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
