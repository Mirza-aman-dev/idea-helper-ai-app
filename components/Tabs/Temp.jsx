import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';

const Home2 = () => {

    const [loading, setLoading] = useState(true);
    const [ideas, setIdeas] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [expandCard, setExpandCard] = useState(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchIdeasFromFirestore = async () => {
            const userId = auth.currentUser.uid;
            const ideasRef = collection(db, "users", userId, "ideas"); // Reference to user's 'ideas' subcollection
          
            try {
              const querySnapshot = await getDocs(ideasRef);
              if (!querySnapshot.empty) {
                const fetchedIdeas = querySnapshot.docs.map(doc => doc.data().todos);
                setIdeas(fetchedIdeas[0]); // Store the fetched data into state
                console.log('Ideas fetched from Firestore:', fetchedIdeas);
                setLoading(false)
                console.log(ideas);
                
              } else {
                console.log('No ideas found in Firestore.');
              }
            } catch (error) {
              console.error('Error fetching ideas from Firestore:', error);
            }
          };
    
          fetchIdeasFromFirestore(); // Call the function to fetch data
      }, []); 

    const filteredIdeas = ideas
    console.log(`filtereefddd : ${filteredIdeas}`);
        
    

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#80ad92" />
            </View>
        );
    }
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <SafeAreaView style={styles.container}>

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
                    data={ideas}
                    keyExtractor={(item) => item.refNo}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const isExpanded = expandCard === item.refNo;
                        return (
                            <TouchableOpacity style={styles.card} onPress={() => handleExpand(item.refNo)} key={item.refNo}>
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Home2;