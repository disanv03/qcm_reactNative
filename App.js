import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


function Index() {
  const [questions, setQuestion] = useState();

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=18")
      .then(response => response.json())
      .then(data => setQuestion(data.results))
      .catch((e)=> console.log("Error: " + e))
  }, [])

  if (questions) {
    return (
      <QuestionCards questions={questions}></QuestionCards>
    )
  } else {
    return (
      <Text>Bienvenue! Chargement en cours...</Text>
    )
  }
}

function QuestionCards(props) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  if(questionIndex >= props.questions.length){
    return (
      <View>
        <Text title={score}>Votre Score: {score}/{props.questions.length}</Text>
      </View>
    )
  }
  return (
    <View className="question">
      <Timer 
        tempsMax={30}
        questionMax={props.questions.length}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex} />
      <Text title={questionIndex}>{props.questions[questionIndex]['question'].replace(/&quot;|&#039;/g, "\'")}</Text>
      <Answer reponses={props.questions[questionIndex]}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
        score={score}
        setScore={setScore}
      />
      <Text title={score}>Votre Score: {score}/{props.questions.length}</Text>
    </View>
  )
}

function Answer(props) {
  let correct_answer = props.reponses.correct_answer;
  let array = [...props.reponses.incorrect_answers, correct_answer];
  array.sort();

  function validate(checkReponse) {
    if (checkReponse == correct_answer) {
      props.setScore(props.score + 1);
      props.setQuestionIndex(props.questionIndex + 1);
    } else {
      props.setQuestionIndex(props.questionIndex + 1);
    }
  }
  return (
    <View>
      {array.map((reponse, id) => (
        <View key={id} style={styles.lesReponses}>
          <Button title={reponse.replace(/&quot;|&#039;/g, "\'")} onPress={()=>validate(reponse)}></Button>
        </View>
      ))}
    </View>
  )
}

function Timer(props){
  const  [timer, setTimer] = useState(props.tempsMax);

  useEffect(() => {
    setTimer(props.tempsMax)
  }, [props.questionIndex])

  useEffect(()=> {
    let timeout = setTimeout(() => {
      setTimer(timer-1)
    }, 1000)
    if(timer <= 0 && props.questionIndex < props.questionMax){
      clearTimeout(timeout);
      setTimer(props.tempsMax);
      props.setQuestionIndex(props.questionIndex+1);
    }else if(props.questionIndex >= props.questionMax){
      clearTimeout(timeout);
    }
    return () => clearTimeout(timeout)
  })

  return (
    <View><Text>{timer}</Text></View>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <Index />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lesReponses: {
  }
});
