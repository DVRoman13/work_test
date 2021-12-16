import React, {useState, useEffect, useRef} from "react";
import s from './Form.module.scss'
import TitleText from "../../components/TitleText/TitleText";
import Button from "../../components/Button/Button";
import {axiosGet} from "../../Helpers/helpers";
import Suggestions from "../../components/Suggestions/Suggestions";
import ErrorElem from "../../components/ErrorElem/ErrorElem";
import {axiosPost, axiosPut} from "../../Helpers/helpers";

export default (props) => {
  const [errorStatus, setErrorStatus] = useState(false);

  const [radioActive, setRadioActive] = useState('single');

  useEffect(()=> {
    if(props.vacancy) {
      if(props.vacancy.salary.hasOwnProperty('to')) {
        setRadioActive('range')
      }
    }
  }, [props.vacancy])


  const [formDataObj, setFormData] = useState({
    name: {
      value: props.vacancy ? props.vacancy.title : '',
      error: false,
      require: true
    },
    city: {
      value: props.vacancy ? props.vacancy.city : '',
      error: false,
      require: true
    },
    price: {
      value: props.vacancy && !props.vacancy.salary.hasOwnProperty('to')  ? props.vacancy.salary : '',
      error: false,
      require: true,
      from: props.vacancy && props.vacancy.salary.hasOwnProperty('from') ? props.vacancy.salary.from : '',
      to: props.vacancy && props.vacancy.salary.hasOwnProperty('to') ? props.vacancy.salary.to : '',
      activeTab: 'single'
    },
    address: {
      value: props.vacancy ? props.vacancy.address : '',
      error: false,
      require: true
    },
    priceComment: {
      value:  '',
      require: false,
      error: false,
    }
  });

  const [citiesData, setCities] = useState(null);

  const [autocomplete, setAutocomplete] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);


  useEffect(()=> {
    if(citiesData) return
    axiosGet('/cities')
      .then((res) => {
        setCities(res.data)
      })
  }, [])

  const getValues = (e) => {
    if(e.target.name === 'city') {
      suggestionHandler(e.target.value)
    }

    formDataObj[e.target.name].value = e.target.name === 'price' ? e.target.value.replace(/[^+\d]/g, '') : e.target.value
    setFormData({...formDataObj})
  }
  
  const suggestionHandler = (val) => {
    const unLinked = citiesData.filter(
      (suggestion) => {
         return suggestion.name.toLowerCase().indexOf(val) > -1
      }
    );
    if(unLinked.length > 0) {
      setShowSuggestions(true)
      setAutocomplete(unLinked)
    }
  }

  const changeRadioBtns = (e) => {
    formDataObj.price.value = ''
    formDataObj.price.from = ''
    formDataObj.price.to = ''
    formDataObj.price.activeTab = e.target.value
    setFormData({...formDataObj})
    setRadioActive(e.target.value)
  }

  const errorHandler = () => {
    let isValid;
    for(let key in formDataObj) {
      if(formDataObj[key].require) {
        formDataObj[key].error = !formDataObj[key].value
      }
    }

    switch (radioActive) {
      case 'single': {
        if(formDataObj.price.value) {
          formDataObj.price.error = false
        }
        break
      }

      case 'range': {
        if(formDataObj.price.from && formDataObj.price.to) {
          formDataObj.price.error = false
        }
        break
      }

      case 'none': {
        formDataObj.price.error = false
        break
      }
    }

    isValid = Object.keys(formDataObj).some((el) => {
      return formDataObj[el].error === true
    })

    setFormData({...formDataObj})
    setErrorStatus(isValid)

    return isValid
  }

  const focusOnCity = () => {
    if(autocomplete.length > 0) {
      setShowSuggestions(true)
    }
  }

  const saveData = () => {

    if(!errorHandler()) {
      let price

      switch (radioActive) {
        case 'single': {
          price = formDataObj.price.value
          break
        }

        case 'range': {
          price = {from: formDataObj.price.from, to:formDataObj.price.to}
          break
        }

        default: {
          price = ' '
        }

      }


      let data = {
        name: formDataObj.name.value,
        price: price,
        city: formDataObj.city.value,
        address: formDataObj.address.value,
        priceComment: formDataObj.priceComment.value,
      }

      if(props.vacancy) {
        axiosPut(`/vacancy/${props.vacancy.id}`, {vacancy: data})
          .then((res) => {
            props.formFunc(false)
          })
      } else {
        axiosPost('/vacancy', {vacancy: data})
          .then((res) => {
            props.formFunc(false)
          })
      }
    }
  }

  const getRangePrice = (e) => {
    formDataObj.price[e.target.name] = e.target.value.replace(/[^+\d]/g, '');
    setFormData({...formDataObj})
  }

  const pickHandler = (cityName) => {
    formDataObj.city.value = cityName;
    setFormData({...formDataObj})
    setShowSuggestions(false)
  }

  const formClick = () => {
    setShowSuggestions(false)
  }

  const cityClick = (e) => {
    e.stopPropagation();
  }

  const closeForm = () => {
    props.formFunc(false)
  }



  return (
    <>
      <TitleText  title={'Создать вакансию'}/>

      {errorStatus ? <ErrorElem title={'Ошибка при заполнении формы'} descrp={'Пожалуйста, отредактируйте поля, отмеченные красным, и нажмите кнопку «Сохранить».'}/> : null}


      <form className={s.form}  onClick={formClick}>
        <div className={s.form_header}>
          <p className={s.form_titles}>Название должности<span>*</span></p>
          <input type="text" name='name' value={formDataObj.name.value} onChange={getValues} placeholder={'Оставить комментарий'} />
          {
            formDataObj.name.error ? <p className={s.error}>Пожалуйста, укажите название должности.</p>
              : null
          }
        </div>
        <div>
          <p className={s.form_titles}>Условия работы</p>
          <div className={s.form_work_conditions_wrap} onClick={cityClick}>
            <p className={s.form_sub_titles}>Город работы<span>*</span>:</p>

            <input type="text" name='city'
                   value={formDataObj.city.value}
                   autoComplete="off"
                   onChange={getValues}
                   onFocus={focusOnCity}

                   placeholder={'Город'} />
            {
              formDataObj.city.error ? <p className={s.error}>Пожалуйста, укажите город работы.</p>
                : null
            }
            <div className={s.block}>
              {showSuggestions ?
                <Suggestions pickHandler={pickHandler} data={autocomplete}/>
              : null
              }
            </div>
          </div>
          <div  className={s.form_work_adress_wrap}>
            <p className={s.form_sub_titles}>Адрес работы<span>*</span>:</p>
            <input type="text"
                   name='address'
                   onChange={getValues}
                   value={formDataObj.address.value}
                   placeholder={'Улица и дом'} />
            {
              formDataObj.address.error ? <p className={s.error}>Пожалуйста, укажите адресс.</p>
                : null
            }
          </div>
        </div>

        <div className={s.form_work_salary_wrap}>
          <p  className={s.form_titles}>Зарплата<span>*</span></p>
          <div>
            <label>
              <input type="radio" name="price_radio" checked={radioActive === 'range'} value={'range'} onChange={changeRadioBtns}/>
              Диапазон
            </label>
            {radioActive === 'range' ?
              <div className={s.form_range_wrap}>
                <input type="text" placeholder={'от'} name={'from'}  value={formDataObj.price.from} onChange={getRangePrice} /> - <input type="text" name={'to'} placeholder={'до'} value={formDataObj.price.to} onChange={getRangePrice} />
                { !formDataObj.price.to || !formDataObj.price.from  ? <p className={s.error}>Пожалуйста, укажите сумму.</p>
                  : null}
              </div>
              : null}
          </div>
          <div className={s.form_single_wrap}>
            <label>
              <input type="radio" name="price_radio" checked={radioActive === 'single'} value={'single'} onChange={changeRadioBtns}/>
              Одно значение
            </label>
            {radioActive === 'single' ?
              <div>
                <input type="text" name={'price'} placeholder={'Сумма'} value={formDataObj.price.value} onChange={getValues}/>
                {formDataObj.price.error ? <p className={s.error}>Пожалуйста, укажите сумму.</p>
                  : null}
              </div>
              : null}
          </div>
          <div>
            <label>
              <input type="radio" name="price_radio" checked={radioActive === 'none'} value={'none'} onChange={changeRadioBtns}/>
              Не указывать <span>(не рекомендуется)</span>
            </label>
          </div>

          <div className={s.form_work_salary_wrap_comment}>
            <p>Комментарий к зарплате</p>
            <input type="text" name={'priceComment'} value={formDataObj.priceComment.value} onChange={getValues}/>
          </div>
        </div>
      <div className={s.form_buttons_wrap}>
        <Button text={'Сохранить'} func={saveData}/>
        <span>или</span>
        <span className={s.form_buttons_wrap_cancel} onClick={closeForm}>Отменить</span>
      </div>
      </form>
    </>
  )
}