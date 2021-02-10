import './App.css';
import Post from './Post.js';
import {useState,useEffect} from 'react';
import {db, auth} from './firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input } from '@material-ui/core';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [user,setUser]=useState(null);
  const [posts,setPosts]=useState([])
  const [open,setOpen]=useState(false);
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");


  useEffect(()=>{db.collection('posts').onSnapshot(snapshot=>setPosts(snapshot.docs.map(doc=>({id:doc.id,data:doc.data()}))))},[])

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in
        setUser(authUser);

        if(authUser.displayName){
          //dont update the user
        }
        else{
          //if we just created someone
          return authUser.updateProfile({
            displayName:username
          })
        }
      }
      else{
        //user has logged out
        setUser(null)
      }
    })
    return ()=>{
      //perform some cleanup actions
      unsubscribe();
    }
  },[user,username])

  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
  }

  return (
    <div className="app">
      <Modal open={open} onClose={()=>setOpen(false)} >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup" >
          <center>
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="instagram logo"
          />
          </center>
          <Input
          placeholder="Username"
          type="username"
          value={username}
          onChange={(event)=>setUsername(event.target.value)}
          />
          <Input
          placeholder="Email"
          type="text"
          value={email}
          onChange={(event)=>setEmail(event.target.value)}
          />
          <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event)=>setPassword(event.target.value)}
          />
          <Button type="submit" variant="contained" onClick={signUp} >SIGN UP</Button>
          </form>
        </div>
      </Modal>
      <div className="app_header" >
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo"
        />
      </div>

      <Button onClick={()=>setOpen(true)} >SIGN UP</Button>

      <h1>This is the new instagram from now !!</h1>
      {
        posts.map(post=>(
          <Post key={post.id} username={post.data.username} caption={post.data.caption} imageUrl={post.data.imageUrl} />
        ))
      }
    </div>
  );
}

export default App;
