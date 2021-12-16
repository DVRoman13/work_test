import React, {useState} from "react";
import Vacancies from "./containers/Vacancies/Vacancies";
import Form from "./containers/Form/Form";
import MainContainer from "./containers/MainContainer/MainContainer";

function App() {
  const [formOpen, setFormOpen] = useState(false);

  const [currentVacancy, setCurrentVacancy] = useState(null);

  const setScreen = (status) => {
    setCurrentVacancy(null)
    setFormOpen(status)
  }

  const setVacancy = (vacancy) => {
    setCurrentVacancy(vacancy)
    setFormOpen(true)
  }

  return (
    <MainContainer>
      {formOpen ? <Form formFunc={setScreen} vacancy={currentVacancy}/> : <Vacancies getVac={setVacancy} formFunc={setScreen}/>}
    </MainContainer>
  );
}

export default App;
