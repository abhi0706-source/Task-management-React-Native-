import React, { useEffect,useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import firestore from '@react-native-firebase/firestore';

interface Mystate{
  name: string;
  age: number;
}


function App(): JSX.Element {
  useEffect(() => {
    getDatabase()
  }, [])

  const [myData,setMyData]=useState<Mystate>({
    name:"",
    age:0
  });

  const getDatabase = async () => {
    try {
      const documentSnapshot = await firestore().collection("mytest").doc("user123").get();
      
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data() as Mystate;
        console.log("Data:", data);
        setMyData(data);
      } else {
        console.log("Document not found.");
      }


      console.log("Hello");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      <Text>{myData.name}</Text>
      <Text>{myData.age}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
