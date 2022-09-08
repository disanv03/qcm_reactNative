import Checkbox from 'expo-checkbox';
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
        <Text>Bienvenue!
          Chargement en cours...
        </Text>
      )
    }
}

function QuestionCards(props){
  console.log(props.questions);
  const [questionIndex, setQuestionIndex] = useState(0);

    return (
      <View className="question">
        <Text title={questionIndex}>{props.questions[questionIndex]['question']}</Text>
        <Answer reponses={props.questions[questionIndex]} />
      </View>
      )
}

function Answer(props){
  let array = [... props.reponses.incorrect_answers, 
              props.reponses.correct_answer];
              
  return (
    <View>
      {array.map((reponse, id) => (
        <View key={id} style={styles.lesReponses}>
          <Text>{reponse}<Check /></Text>
        </View>
      ))}
    </View>
  )
}

function Check(){
  const [isChecked, setChecked] = useState(false);
  return (
    <View>
      <Checkbox value={isChecked} onValueChange={setChecked} />
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
