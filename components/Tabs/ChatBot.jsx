import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Animated, Button } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

// imgages
import bot from '../../assets/bot.jpg'

const TypingEffect = ({ text, speed = 150 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const animationValue = new Animated.Value(0);

  useEffect(() => {
    let currentIndex = 0;

    const typeText = () => {
      if (currentIndex < text.length) {
        setDisplayedText((prevText) => prevText + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval); // Stop when text is fully typed
      }
    };

    const interval = setInterval(typeText, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <Text style={styles.bubbleText}>{displayedText}</Text>
  );
};

const ChatScreen = () => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [Indicator, setIndicator] = useState('Typing...');

  const [history, setHistory] = useState([]);

  const transformToHistory = (messages) => {
    return messages.map(message => {
      const role = message.user._id === 1 ? "user" : "model";
      return {
        role: role,
        parts: [message.text + "\n"] // Adding newline after the text
      };
    });
  };

  // const handleHistory = async() => {
  //   setHistory(await transformToHistory(messages));
  //   console.log(await transformToHistory(messages));
  // }

  const TypewriterEffect = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
      setDisplayedText(''); // Reset text on component mount or refresh
      let index = 0;

      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer); // Cleanup interval on unmount
    }, [text, speed]);

    return <Text style={styles.typingText}>{displayedText}</Text>;
  };


  useEffect(() => {
    setMessages([
      {
        _id: 2,
        text: "Hello, thinker! I'm Glob, your assistant here to help you explore and develop your ideas. Let’s work together to find the solutions you're looking for!",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
          avatar: 'https://i.pinimg.com/474x/ec/93/dc/ec93dc08974762159afc8e4bf14b6723.jpg',
        },
      },
    ]);
  }, []);

  useEffect(() => {
    const sendHistoryToBackend = async () => {
      const _history = await transformToHistory(messages)
      try {
        const response = await fetch("https://idear-qz4l.onrender.com/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _history }), // Send the history array as JSON
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Response from backend:", data);
        } else {
          setIndicator("Coudn't connect with backend!")
          console.error("Error sending data to backend");
        }
      } catch (error) {
        setIndicator("Something wen't wrong in fetching data!")
        console.error("Error in fetching:", error);
      }
    };
    sendHistoryToBackend();
  }, [messages]);

  const onSend = useCallback(async (messages = []) => {
    const userMessage = messages[0];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );

    // Send user message to API for bot response
    setLoading(true);
    try {
      const response = await axios.post('https://idear-qz4l.onrender.com/api/greet', { name: userMessage.text });
      const botReply = {
        _id: Math.random().toString(),
        // text: response.data.greeting,
        text: <TypewriterEffect text={response.data.greeting} speed={20} />,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
          avatar: 'https://i.pinimg.com/474x/ec/93/dc/ec93dc08974762159afc8e4bf14b6723.jpg',
        },
      };
      // Show bot's response after delay to simulate typing
      setTimeout(() => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [botReply])
        );
      }, 500); // Adjust delay here for realism
    } catch (error) {
      setIndicator("Something wen't wrong with data !")
      console.error('Error fetching greeting:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };



  const renderBubble = (props) => {
    const { currentMessage } = props;

    // Check if the message is from the bot and apply the typing effect
    if (currentMessage.user._id === 2) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#2e64e5',
            },
            left: {
              backgroundColor: '#f7f5f0',
            },
          }}
          textStyle={{
            right: {
              color: '#fff',
              lineHeight: 20,
            },
            left: {
              color: '#80ad92',
              lineHeight: 20,
            },
          }}
          containerStyle={{
            minHeight: 40,
          }}
        >
          {/* Show typing animation for bot's response */}
          {/* <TypingEffect text={currentMessage.text} /> */}
        </Bubble>
      );
    }
    return <Bubble {...props} />;
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  };

  return (
    <>
      {
        loading ? <Text style={styles.indicator} >{Indicator}</Text> : null
      }
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    fontSize: 16,
    color: '#fff',
  },
  indicator: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    zIndex: 1,
    fontWeight: '800',
    color: '#80ad92'
  }
});