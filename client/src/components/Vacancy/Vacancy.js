import React, {useState} from "react";
import s from './Vacancy.module.scss'

export default (props) => {
  const [dropdown, setDropdown] = useState(false);

  const dropdownHandler = () => {
    setDropdown(!dropdown)
  }

  const delHandler = () => {
    props.delFunc(props.id)
  }
  
  const getVacancy = () => {
    props.formVacancy(props)
  }

  return (
    <div className={s.Vacancy}>
      <p className={s.title}>{props.title}</p>
      <p className={s.salary}>
        {props.salary.hasOwnProperty('from') ?
          `${props.salary.from} - ${props.salary.to}`
          : props.salary
        }
        {props.priceComment ? <span>  {props.priceComment}</span> : null}
      </p>
      <p className={s.city}>{props.city}{props.address ? `, ${props.address}` : null}</p>

      <div className={s.action_block}>
        <p onClick={dropdownHandler} className={s.action_block_btn}>Еще <span className={s.arrow}></span></p>
        {dropdown ?
          <div className={s.action_block_dropdown}>
            <p onClick={getVacancy}>Редактировать</p>
            <p onClick={delHandler}>Удалить</p>
          </div>
        : null
        }
      </div>
    </div>
  )
}