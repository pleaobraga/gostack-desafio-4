import React, {useState, useEffect} from "react";
import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repos, setRepos] = useState([])

  useEffect(() => {
    api.get('repositories').then(resp => {
      setRepos(resp.data)
    })
  }, [])

  async function handleLikeRepository(id) {

    const index = repos.findIndex(repo => repo.id === id)

    if(index >= 0) {
      repos[index].likes = repos[index].likes + 1
      api.post(`repositories/${id}/like`).then(() => {
        setRepos([...repos])
      })
    }
  }

  const listItem = ({title, techs, id, likes}) => {
    return (
      <>
        <Text style={styles.repository}>{title}</Text>

        { techs && (
          <View style={styles.techsContainer}>
            {
              techs.map(tech => (
                <Text key={tech} style={styles.tech}>
                  {tech}
                </Text>
              ))
            }
          </View>
          )
        }

        <View style={styles.likesContainer}>
          <Text
            style={styles.likeText}
            testID={`repository-likes-${id}`}
          >
            {likes} curtidas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(id)}
          testID={`like-button-${id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          style={styles.repositoryContainer}
          data={repos}
          keyExtractor={repo => repo.id}
          renderItem={({item}) => listItem(item)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
