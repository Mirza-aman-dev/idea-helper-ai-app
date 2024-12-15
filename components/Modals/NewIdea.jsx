import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const NewIdea = (props) => {

    const { a, b, name, refNo, dataList, setDataList } = props;

    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');

    //   const [Disable,setDisable] = useState(true);

    const handleSubmit = async () => {
        if (description && category && date && notes) {
            // { refNo: 'ID001', name: 'Idea One', createdDate: '2024-11-01', desc: 'Detailed description about Idea One. This could go into more detail, explaining the core concept and unique aspects of the idea.' },
            const _push = {
                refNo: refNo,
                name: name,
                createdDate: date,
                desc: description,
                category: category,
                notes: notes
            }
            // dataList.push(_push)
            const updatedArray = [...dataList, _push];
            await AsyncStorage.setItem('ideaList', JSON.stringify(updatedArray));
            setDataList([...dataList,_push])     
            b(false)
            setDescription('')
            setCategory('')
            setDate('')
            setNotes('')
        }
    }

    return (
        <Modal visible={a} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Create New Idea</Text>
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        <Text style={styles.label}>Ref No:</Text>
                        <Text style={styles.value}>{refNo}</Text>

                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter idea name"
                            value={name}
                            editable={false}
                        />

                        <Text style={styles.label}>Description:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter description"
                            value={description}
                            onChangeText={setDescription}
                        />

                        <Text style={styles.label}>Category:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter category"
                            value={category}
                            onChangeText={setCategory}
                        />

                        <Text style={styles.label}>Date:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter date"
                            value={date}
                            onChangeText={setDate}
                        />

                        <Text style={styles.label}>Notes:</Text>
                        <TextInput
                            style={[styles.input, styles.notesInput]}
                            placeholder="Additional notes"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                        />

                    </ScrollView>
                    <TouchableOpacity onPress={handleSubmit} disabled={description && category && date && notes ? false : true} style={[styles.submitButton, { backgroundColor: description && category && date && notes ? '#80ad92' : '#ccc', }]}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            setDescription('')
                            setCategory('')
                            setDate('')
                            setNotes('')
                            b(false)
                        }}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default NewIdea;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 20,
    },
    scrollContent: {
        paddingVertical: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#80ad92',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#80ad92',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#80ad92',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    notesInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#80ad92',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
