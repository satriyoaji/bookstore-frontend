import React from 'react'
import classes from './bookCard.module.css'
import Link from 'next/link'
import Image from 'next/image'

const BookCard = ({
  book
}) => {
  const coverImage = book.coverImage

  return (
    <Link href={`/details/${book.id}`} className={classes.container}>
        <div>
          <h5 className={classes.titles}>{book.title}</h5>
        </div>
        <div className={classes.wrapper}>
          <Image
            src={coverImage}
            alt="book cover"
            height='275'
            width='175'
          />
        </div>
    </Link>
  )


}

export default BookCard
