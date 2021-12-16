import React from "react";
import s from './Suggestions.module.scss'

export default (props) => {

  const renderSuggestions = (data) => {
    return data.map((el) => {
      return <li key={el.id} onClick={()=>{props.pickHandler(el.name)}} >{el.name}</li>
    })
  }

  return (
    <ul>
      {renderSuggestions(props.data)}
    </ul>
  )
}