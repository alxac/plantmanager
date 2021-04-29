import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { baseProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlers";
import { Button } from "../../components/Button";
import firebase from "../../services/firebase";

const UserList = (props: any) => {
  const [users, setUsers] = useState([]);
  const URI = "https://avatars1.githubusercontent.com/u/10724571?v=4";

  function navegar(rota: string) {
    props.navigation.navigate(rota);
  }

  useEffect(() => {
    firebase.db.collection("usuarios").onSnapshot((query: any) => {
      const users: any = [];

      query.docs.forEach((doc: any) => {
        const { name, email } = doc.data();
        users.push({
          id: doc.id,
          name,
          email,
        });
      });
      setUsers(users);
    });
  }, []);

  return (
    <ScrollView style={styles.conteiner}>
      <Button
        title="Novo"
        onPress={() => props.navigation.navigate("CreateUser")}
      />
      {users.map((user: any) => {
        return (
          <ListItem
            key={user.id}
            bottomDivider
            onPress={() =>
              props.navigation.navigate("UserDetails", {
                userId: user.id,
              })
            }
          >
            <ListItem.Chevron />
            <Avatar source={{ uri: URI }} rounded />
            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
              <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        );
      })}
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

export default UserList;
