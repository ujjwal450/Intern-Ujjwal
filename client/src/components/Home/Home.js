import React, { useEffect, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Home.module.css';
import UserList from '../Users/UsersList';
import UserFrom from '../Users/UserForm'
import Button from '../UI/Button/Button';
const Home = (props) => {
  const [userList, setUserList] = useState('')
  const [showUserList, setShowUserList] = useState(false)
  const [showCreateUserForm, setShowCreateUserForm] =useState(false)
  const [isUserCreated, setIsUserCreated] = useState(false)
  const [isUserUpdated, setIsUserUpdated] = useState(false)
  const [showCreateUserError, setShowCreateUserError] = useState(false)
  const accountType = localStorage.getItem('accountType')
  const token = localStorage.getItem('token')
  useEffect(() => {
    const accountType = localStorage.getItem('accountType')
    if (accountType === 'user'){
      return
    }
    const ListUsersHandler = async() => {
      setShowCreateUserForm(false)
      setIsUserCreated(false)
      const response = await fetch('http://127.0.0.1:3000/admin/listUsers',{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
      })
    
      if (response.status === 200) {
        let data = await response.json();
        setUserList(data);
        setShowUserList(true)
        
      } else {
        
      }
    }
    ListUsersHandler()
  }, [isUserUpdated, token, isUserCreated])

  const showFormHandler = () => {
    setShowUserList(false)
    setShowCreateUserForm(true)
    setIsUserCreated(false)
    setShowCreateUserError(false)
  }
  const createUserHandler = async (data) => {
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email:data.email,
      mobileNo: data.mobileNo,
      username: data.username,
      password: data.password,
      accountType: 'user'
    }
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://127.0.0.1:3000/admin/createUser',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        'body': JSON.stringify(userData)
      })
      const responseBody = await response.json()
      if (response.status === 201){
        setIsUserCreated(true)
      }
      if (responseBody.error){
        setShowCreateUserError((prevState) =>{
          return !prevState
        })
      }
    } catch (error) {
      console.log(error.error)
    }
    setShowCreateUserForm(false)
  }

  const reloadUsersHandler = () => {
    setIsUserUpdated((prevState) => {
      return !prevState
    })
  }
  return (
    <div>
    
      <Card className={classes.home}>
      <h1>Welcome {props.onLogin}!</h1>
      {accountType === 'admin' &&
      <div>
      <Button onClick={showFormHandler}>Create User</Button>
      </div>
      }
      {showCreateUserError && <div>Unable to Create User</div>}
      {isUserCreated && <h1>User Created</h1>}
      </Card>
      {showCreateUserForm && <UserFrom onSubmit={createUserHandler}/>}
      {accountType === 'admin' && <UserList users = {userList} onUpdate={reloadUsersHandler} />}
      
      
    
    </div>
  );
};

export default Home;
