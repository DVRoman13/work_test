import React, {useEffect, useState} from "react";
import TitleText from "../../components/TitleText/TitleText";
import s from './Vacancies.module.scss';
import Button from "../../components/Button/Button";
import Vacancy from "../../components/Vacancy/Vacancy";
import axios from "axios";
import {axiosDelete} from "../../Helpers/helpers";


export default (props) => {
  const [vacancies, setVacancies] = useState(null);
  useEffect(() => {
      axios('/vacancies')
        .then(res => {
          setVacancies(res.data.length < 1 ? null : res.data)
        })
  }, []);

  const formOpenHandler = () => {
    props.formFunc(true)
  }

  const deleteVacancy = (id) => {
    axiosDelete(`vacancy/${id}`)
      .then((res) => {
        axios('/vacancies')
          .then(res => {
            setVacancies(res.data.length < 1 ? null : res.data)
          })
      })
  }

  const getVacancy = (vacancy) => {
    props.getVac(vacancy)
  }

  const renderVacancies = (data) => {
    return data.map((el)=> {
      return <Vacancy
                title={el.name}
                key={el.id}
                id={el.id}
                city={el.city}
                salary={el.price}
                address={el.address}
                formHandler={formOpenHandler}
                formVacancy={getVacancy}
                delFunc={deleteVacancy}
                priceComment={el.hasOwnProperty('priceComment') ? el.priceComment: null}
                />
    })
  }

  const openForm = () => {
    props.formFunc(true)
  }

  return(
    <>
      <div className={s.header}>
        <TitleText  title={'Вакансии и отклики'} />
        <Button text={'Создать вакансию'} func={openForm}/>
      </div>
      <div className={s.vacancies_wrapp}>
        {vacancies ? renderVacancies(vacancies) : <TitleText  title={'Нет вакансий.'}/>}
      </div>
      <div className={s.button_wrapp}>
        <Button text={'Создать вакансию'} func={openForm}/>
      </div>
    </>
    )
}