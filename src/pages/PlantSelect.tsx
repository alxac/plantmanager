import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { EnviromentButton } from "../components/EnviromentButton";
import { Header } from "../components/Header";
import { Load } from "../components/Load";
import { PlanCardPrimary } from "../components/PlanCardPrimary";
import api from "../services/api";

interface EnviromentProps {
  key: string;
  title: string;
}

interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
}

export function PlantSelect() {
  const [enviroment, setEnviroment] = useState<EnviromentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filtredPlants, setFiltredPlants] = useState<PlantProps[]>([]);
  const [selected, setSelected] = useState("all");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  function handleEnviromentSelected(enviroment: string) {
    setSelected(enviroment);
    if (enviroment == "all") return setFiltredPlants(plants);

    const filtred = plants.filter((plant) =>
      plant.environments.includes(enviroment)
    );
    setFiltredPlants(filtred);
  }

  useEffect(() => {
    async function fetchEnviroment() {
      const { data } = await api.get(
        "plants_environments?_sort=title&_order=asc"
      );
      setEnviroment([
        {
          key: "all",
          title: "Todos",
        },
        ...data,
      ]);
    }
    fetchEnviroment();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  async function fetchPlants() {
    const { data } = await api.get(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=8`
    );

    if (!data) return setLoading(true);

    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFiltredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFiltredPlants(data);
    }
    setLoading(false);
    setLoadingMore(false);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((oldvalue) => oldvalue + 1);
    fetchPlants();
  }
  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual hambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={enviroment}
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              key={item.key}
              active={item.key == selected}
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviroment}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filtredPlants}
          renderItem={({ item }) => <PlanCardPrimary data={item} />}
          showsHorizontalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 18,
    color: colors.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  enviroment: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 25,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "center",
  },
});
