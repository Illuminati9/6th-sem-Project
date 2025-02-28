import React from 'react'
import { useLocalContext } from '../../context/context'

const joinClass = () => {

    const classes = useStyles();
    const {join, setJoin} = useLocalContext();
  return (
    <div>
      <h1>hello</h1>
    </div>
  )
}

export default joinClass
