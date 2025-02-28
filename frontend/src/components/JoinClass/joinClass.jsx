import React from 'react';
import { useLocalContext } from '../../context/context';
import { makeStyles } from '@mui/styles'; 

const useStyles = makeStyles({
  
});

const JoinClass = () => {
  const classes = useStyles();
  const { join , setJoin} = useLocalContext(); 

  return (
    <div>
      {join && <h1>Hello</h1>}
    </div>
  );
};

export default JoinClass;
