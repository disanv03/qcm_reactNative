
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


function Index() {
  const [questions, setQuestion] = useState();

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=9")
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
  const [tempsEcoule, setTempsEcoule] = useState(30);
  if(questionIndex >= props.questions.length){
    return (
      <View>
        <Text title={score} style={styles.scoreStyle}>Score: {score}/{props.questions.length}</Text>
      </View>
    )
  }
  return (
    <View className="question" style={styles.questionMain}>
      <Image 
        style={styles.logo}
        source={require('./assets/quiz.png')}
      />
      <LinearGradient
        // Background Linear Gradient
        
        colors={['rgba(0,143,245,96.8)', 'transparent']}
        style={styles.gradientBar}
        start={{ x: 0, y: 1 }}
        end={{ x: tempsEcoule/30, y: 1 }}
      />
      <Timer 
        tempsMax={30}
        tempsEcoule={setTempsEcoule}
        questionMax={props.questions.length}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex} />
      <Text title={questionIndex} style={styles.questionStyle}>{props.questions[questionIndex]['question'].replace(/&quot;|&#039;|&ldquo;|&shy;/g, "\'")}</Text>
      <Answer reponses={props.questions[questionIndex]}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
        score={score}
        setScore={setScore}
      />
      <Text title={score} style={styles.scoreStyle}>Score: {score}/{props.questions.length}</Text>
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
          <Button title={reponse.replace(/&quot;|&#039;|&ldquo;|&shy;/g, "\'")} onPress={()=>validate(reponse)}></Button>
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
      props.tempsEcoule(timer-1)
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
    <View ><Text style={styles.timer}>{timer}</Text></View>
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
    backgroundColor: '#61dafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBar: {
    borderRadius: 5,
    left: 0,
    right: 0,
    top: 20,
    height: 20,
  },
  timer: {
    color: '#009FFA',
    textShadowColor:'#585858',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
    fontSize: 25,
    fontWeight: "bold",
    top: -10,
    right: -5
  },
  questionStyle: {
    color: 'white',
    textShadowOffset: {width: 2, height: 1},
    textShadowRadius: 2,
    fontSize: 20,
    fontWeight: "bold"
  },
  scoreStyle: {
    color: 'white',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2
  },
  logo: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    top: -50,
  },
  questionMain: {
    flex: 1,
    justifyContent: 'center',
    
  }
});
