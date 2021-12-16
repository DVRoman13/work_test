import React from "react";
import s from './MainContainer.module.scss'
export default (props) => {

  return (
    <div className={s.wrap}>
      {props.children}
    </div>
  )
}