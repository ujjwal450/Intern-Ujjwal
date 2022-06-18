import Card from "../UI/Card/Card"
import { useState } from 'react';
import classes from './userForm.module.css'
import Button from "../UI/Button/Button";

const UserForm = (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const firstNameChangeHandler = (e) => {
    setFirstName(e.target.value)
  }
  const lastNameChangeHandler = (e) => {
    setLastName(e.target.value)
  }
  const emailChangeHandler = (e) => {
    setEmail(e.target.value)
  }
  const usernameChangeHandler = (e) => {
    setUsername(e.target.value)
  }
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value)
  }
  const mobileNoChangeHandler = (e) => {
    setMobileNo(e.target.value)
  }
  const submitHandler = (e) => {
    e.preventDefault()
    props.onSubmit({
      firstName,
      lastName,
      email,
      mobileNo,
      username,
      password,
    })
  }
  return (
    <Card className={classes.createUser}>
      <form onSubmit={submitHandler}>
      <div
          className={classes.control}
        >
          <label>First Name</label>
          <input
            type="test"
            value={firstName}
            onChange={firstNameChangeHandler}
            required
          />
        </div>
        <div
          className={classes.control}
        >
          <label>Last Name</label>
          <input
            type="test"
            value={lastName}
            onChange={lastNameChangeHandler}
            required
          />
        </div>
        <div
          className={classes.control}
        >
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={emailChangeHandler}
            required
          />
        </div>
        <div
          className={classes.control}
        >
          <label>Mobile No</label>
          <input
            type="text"
            value={mobileNo}
            onChange={mobileNoChangeHandler}
            required
          />
        </div>
        <div
          className={classes.control}
        >
          <label>Username</label>
          <input
            type="test"
            value={username}
            onChange={usernameChangeHandler}
            required
          />
        </div>
        <div
          className={classes.control}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={passwordChangeHandler}
            required
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Submit
          </Button>
        </div>
      </form>
      {props.signupError && <div>Unable to create Account</div>}
      {props.createUserError && <div>Unable to create User</div>}
    </Card>
    
  )
}

export default UserForm