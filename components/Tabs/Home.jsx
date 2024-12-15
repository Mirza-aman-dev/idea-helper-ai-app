import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,Animated,Easing, TouchableOpacity, FlatList, Modal, SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// modals
import NewIdea from '../Modals/NewIdea';

const Home = () => {

  const [ideas, setIdeas] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity
  const translateYAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    // Start the animation sequence
    Animated.sequence([
      // Slide down and fade in
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 0, // End position
          duration: 500, // Duration of slide
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1, // Fully visible
          duration: 500, // Duration of fade-in
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
      // Wait for 1 second, then fade out
      Animated.timing(fadeAnim, {
        toValue: 0, // Fully invisible
        duration: 500, // Duration of fade-out
        delay: 1000, // Delay for 1 second before fading out
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedArray = await AsyncStorage.getItem('ideaList');
        if (savedArray !== null) {
          setIdeas(JSON.parse(savedArray));  // Parse the string back into an array
          console.log('Loaded Ideas:', JSON.parse(savedArray));  // Log the loaded data
        }
      } catch (error) {
        console.error('Error loading data: ', error);
      }
    };

    loadData();  // Call the loadData function when the component mounts
  }, []);  // Empty dependency array ensures this runs only once

  const [searchText, setSearchText] = useState('');
  const [expandCard, setExpandCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [name, setName] = useState('');
  const [RefNo, setRefNo] = useState('');
  const [Disable, setDisable] = useState(true);

  const flatListRef = useRef(null);

  const filteredIdeas = ideas.filter(idea =>
    idea.refNo.toLowerCase().includes(searchText.toLowerCase()) ||
    idea.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleExpand = (refNo) => {
    setExpandCard(prevState => {
      const isExpanded = prevState === refNo;
      if (!isExpanded && refNo === filteredIdeas[filteredIdeas.length - 1].refNo) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
      return isExpanded ? null : refNo;
    });
  };

  const handleNewIdea = (IdeaName) => {
    if(name){
      const ref = ideas.length===0?'ID000':ideas[ideas.length - 1].refNo;
      const refNumber = parseInt(ref.match(/\d+/)[0], 10);
      const newRefNumber = refNumber + 1;
      const newRefNo = `ID${String(newRefNumber).padStart(3, '0')}`;
      setRefNo(newRefNo);
      setIsModalVisible(false);
      setIsModalVisible2(true);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
      {/* <Animated.Text
        style={{
          fontSize: 15,
          color: '#80ad92',
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
          position:'absolute',
          top:130,
          alignSelf:'center',
          zIndex:1
        }}
      >
        Created!
      </Animated.Text> */}
        <TouchableOpacity style={styles.fab} onPress={() => {
          setName('');
          setIsModalVisible(true);
        }}>
          <Ionicons name="add-outline" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#80ad92" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Ref No or Idea"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        

        {/* Ideas List */}
        <FlatList
          ref={flatListRef} // Add the ref here
          data={filteredIdeas}
          keyExtractor={(item) => item.refNo}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isExpanded = expandCard === item.refNo;
            return (
              <TouchableOpacity style={styles.card} onPress={() => handleExpand(item.refNo)}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Ref No: {item.refNo}</Text>
                  <Text style={styles.cardText}>Name: {item.name}</Text>
                  <Text style={styles.cardText}>Created: {item.createdDate}</Text>
                  {isExpanded && (
                    <>
                      <Text style={styles.cardDesc}>{item.desc}</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Modal for adding a new idea */}
        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add New Idea</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Name"
                value={name}
                onChangeText={(text) => {
                  if(text.length > 0){
                    setDisable(false);
                    setName(text);
                  } else {
                    setDisable(true);
                    setName(text);
                  }
                }}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: Disable ? '#ccc' : '#80ad92'}]} onPress={() => handleNewIdea(name)} disabled={Disable}>
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'red' }]} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <NewIdea a={isModalVisible2} b={setIsModalVisible2} name={name} refNo={RefNo} dataList={ideas} setDataList={setIdeas} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingVertical: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    height: 50,
    elevation: 3,
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    width: '95%',
    alignSelf: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  cardDesc: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: '#80ad92',
    zIndex: 1,
    padding: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#80ad92',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;


// import { Button, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { printToFileAsync } from 'expo-print'
// import { shareAsync } from 'expo-sharing'

// import htmlCode from '.'

// const Home = () => {


//   const handlePDF = async () => {
//     const html = `
//     <html>
// <head>
// </head>
// <body>
//     <h1>
//         Hello World
//     </h1>
//     <p>Sample idea pdf</p>
// </body>
// </html>
//     `
//     const file = await printToFileAsync({
//       html: htmlCode,
//       base64: false
//     });
//     await shareAsync(file.uri);
//   }

//   return (
//     <View style={styles.container}>
//       <Button title='Generate PDF' onPress={handlePDF} />
//     </View>
//   )
// }

// export default Home

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// })