import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { Button } from "../../components/Button";
import firebase from "../../services/firebase";

const CreateUser = (props: any) => {
  const [state, setState] = useState({
    name: "",
    email: "",
  });

  const handleChangeText = (name: string, value: string) => {
    setState({ ...state, [name]: value });
  };

  const save = async () => {
    if (state.name === "") {
      alert("Digite um nome");
    } else {
      try {
        await firebase.db.collection("usuarios").add({
          name: state.name,
          email: state.email,
        });
        props.navigation.navigate("UserList");
      } catch (error) {
        console.log(error);
      }
      alert("add");
    }
  };

  return (
    <ScrollView style={styles.conteiner}>
      <View style={styles.inputGroup}>
        <Text>Create</Text>
      </View>
      <View>
        <TextInput
          placeholder="Seu nome"
          onChangeText={(value) => handleChangeText("name", value)}
        />
      </View>
      <View>
        <TextInput
          placeholder="Seu email"
          onChangeText={(value) => handleChangeText("email", value)}
        />
      </View>
      <View>
        <Button title="Salvar" onPress={save} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    padding: 35,
    top: 50,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
});

export default CreateUser;
