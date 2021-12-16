import React from "react";
import s from './TitleText.module.scss'

export default (props) => {

  return (
    <p className={s.title}>{props.title}</p>
  )
}