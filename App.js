import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';




function Index(){
    const [questions, setQuestion] = useState();
    
    useEffect(() => {
      fetch("https://opentdb.com/api.php?amount=10&category=18")
        .then(response => response.json())
        .then(data => setQuestion(data.results))
    },[])

    if(questions){
    return (
      <QuestionCards questions={questions}></QuestionCards>
    );
    }else{
      return(
        <Text>Bienvenue! Chargement en cours...</Text>
      )
    }
}

function QuestionCards(props){
  console.log(props.questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

    return (
      <View className="question">
        <Text title={questionIndex}>{props.questions[questionIndex]['question']}</Text>
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

function Answer(props){
  let correct_answer = props.reponses.correct_answer;
  let array = [... props.reponses.incorrect_answers, 
              correct_answer];
  
  let validate = (e) =>{
    e.target == correct_answer ? props.setScore(props.score+1) :
                                 props.setQuestionIndex(props.questionIndex+1);
  }

  return (
    <View>
      {array.map((reponse, id) => (
        <View key={id} style={styles.lesReponses}>
          <Button title={reponse} onPress={validate}>{reponse}</Button>
        </View>
      ))}
    </View>
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
