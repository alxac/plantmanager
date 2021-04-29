import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import firebase from "../../services/firebase";

const UserDetails = (props: any) => {
  const initialState = {
    id: "",
    name: "",
    email: "",
  };

  const [state, setState] = useState();
  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const getUserByID = async (id: any) => {
    const dbRef = firebase.db.collection("usuarios").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({
      ...user,
      id: doc.id,
    });
    setLoading(false);
  };

  const handleChangeText = (name: string, value: string) => {
    setUser({ ...user, [name]: value });
  };

  const update = async () => {
    const dbRef = firebase.db.collection("usuarios").doc(user.id);
    await dbRef.set({
      name: user.name,
      email: user.email,
    });
    setUser(initialState);
    props.navigation.navigate("UserList");
  };

  const deleteUser = async () => {
    const dbRef = firebase.db
      .collection("usuarios")
      .doc(props.route.params.userId);
    await dbRef.delete();
    props.navigation.navigate("UserList");
  };

  const confirmation = () => {
    Alert.alert("Exluir usuários", "Remover usuário?", [
      { text: "Sim", onPress: deleteUser },
      { text: "Não" },
    ]);
  };

  useEffect(() => {
    getUserByID(props.route.params.userId);
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#9e9e9e" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.conteiner}>
      <View style={styles.inputGroup}>
        <Text>Detalhes</Text>
      </View>
      <View>
        <TextInput
          placeholder="Seu nome"
          value={user.name}
          onChangeText={(value) => handleChangeText("name", value)}
        />
      </View>
      <View>
        <TextInput
          placeholder="Seu email"
          value={user.email}
          onChangeText={(value) => handleChangeText("email", value)}
        />
      </View>
      <View>
        <Button title="Salvar" onPress={update} />
        <Button title="Deletar" onPress={confirmation} />
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

export default UserDetails;
