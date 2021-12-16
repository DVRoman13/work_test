import React from "react";
import s from './ErrorElem.module.scss'

export default (props) => {

  return (
    <div className={s.error_wrap}>
      <p className={s.title}>{props.title}</p>
      <p className={s.descrp}>{props.descrp}</p>
    </div>
  )
}