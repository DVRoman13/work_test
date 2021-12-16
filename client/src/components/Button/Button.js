import React from "react";
import s from './Button.module.scss'


export default (props) => {

  const handler = (e) => {
    e.preventDefault();
    props.func()
  }

  return (
    <button className={s.button} onClick={handler}>{props.text}</button>
  )
}