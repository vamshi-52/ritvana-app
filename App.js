// App.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Alert
} from "react-native";

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQXI0gBiRSABfDRID5tVfYxMWZozsodNg",
  authDomain: "ritvana-free.firebaseapp.com",
  projectId: "ritvana-free",
  storageBucket: "ritvana-free.appspot.com",
  messagingSenderId: "518667502711",
  appId: "1:518667502711:web:fa8ec789770468889b7272"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gradient Background Component
const GradientBackground = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: '#FAFBFF' }}>
    {children}
  </View>
);

// Card Component for consistent styling
const Card = ({ children, style }) => (
  <View style={[{
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)'
  }, style]}>
    {children}
  </View>
);

// Beautiful Button Component
const BeautifulButton = ({ onPress, title, variant = "primary", style, disabled }) => {
  const getButtonStyle = () => {
    const baseStyle = {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    };

    if (variant === "primary") {
      return {
        ...baseStyle,
        backgroundColor: disabled ? '#E5E7EB' : '#8B5CF6',
      };
    } else if (variant === "secondary") {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#8B5CF6',
      };
    } else if (variant === "success") {
      return {
        ...baseStyle,
        backgroundColor: '#10B981',
      };
    } else if (variant === "neutral") {
      return {
        ...baseStyle,
        backgroundColor: '#F3F4F6',
      };
    }
  };

  const getTextStyle = () => {
    if (variant === "secondary") {
      return { color: '#8B5CF6', fontWeight: '600', fontSize: 16 };
    } else if (variant === "neutral") {
      return { color: '#6B7280', fontWeight: '600', fontSize: 16 };
    }
    return { color: 'white', fontWeight: '600', fontSize: 16 };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[getButtonStyle(), style]}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

// Progress Bar Component
const ProgressBar = ({ progress, height = 8 }) => (
  <View style={{
    height,
    backgroundColor: '#E5E7EB',
    borderRadius: height / 2,
    overflow: 'hidden',
  }}>
    <Animated.View style={{
      height: '100%',
      backgroundColor: '#8B5CF6',
      borderRadius: height / 2,
      width: `${progress}%`,
    }} />
  </View>
);

// Separate ChatInput component
const ChatInput = React.memo(({ 
  step, 
  tempUser, 
  isProcessing, 
  input, 
  setInput, 
  onSend 
}) => {
  const getPlaceholder = () => {
    if (step === "signup") {
      if (!tempUser.username) return "Choose your username...";
      if (!tempUser.email) return "Enter your email...";
      if (!tempUser.password) return "Create a password...";
      return "Type your message...";
    }
    if (step === "login") {
      if (!tempUser.email) return "Enter your email...";
      if (!tempUser.password) return "Enter your password...";
      return "Type your message...";
    }
    if (step === "ritual_setup") {
      return "Type your response...";
    }
    return "Type your message...";
  };

  const getSecureTextEntry = () => {
    if (step === "signup" || step === "login") {
      return tempUser.email && !tempUser.password;
    }
    return false;
  };

  return (
    <Card style={{ marginTop: 16, padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 0,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#F8FAFC",
            marginRight: 12,
            fontSize: 16,
            color: '#1F2937',
          }}
          value={input}
          onChangeText={setInput}
          placeholder={getPlaceholder()}
          placeholderTextColor="#9CA3AF"
          editable={!isProcessing}
          secureTextEntry={getSecureTextEntry()}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing ? "#9CA3AF" : "#8B5CF6",
            padding: 16,
            borderRadius: 12,
            minWidth: 80,
            alignItems: "center",
            justifyContent: 'center',
            shadowColor: '#8B5CF6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            {isProcessing ? "⏳" : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
});

// Ritual Item Component
const RitualItem = ({ ritual, onPress, index }) => (
  <TouchableOpacity
    onPress={() => onPress(index)}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: ritual.completed ? "#F5F3FF" : "white",
      padding: 20,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: ritual.completed ? "#8B5CF6" : "#F3F4F6",
      shadowColor: ritual.completed ? '#8B5CF6' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: ritual.completed ? 0.1 : 0.05,
      shadowRadius: ritual.completed ? 8 : 4,
      elevation: 2,
    }}
  >
    <View style={{
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: ritual.completed ? "#8B5CF6" : "#D1D5DB",
      backgroundColor: ritual.completed ? "#8B5CF6" : "transparent",
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    }}>
      {ritual.completed && (
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
      )}
    </View>
    
    <View style={{ flex: 1 }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: "600",
        color: ritual.completed ? "#8B5CF6" : "#1F2937",
        marginBottom: 4,
      }}>
        {ritual.name}
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
        {ritual.time && (
          <View style={{ 
            backgroundColor: '#E5E7EB', 
            paddingHorizontal: 8, 
            paddingVertical: 2, 
            borderRadius: 8,
            marginRight: 8,
            marginBottom: 4,
          }}>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>⏰ {ritual.time}</Text>
          </View>
        )}
        
        <View style={{ 
          backgroundColor: ritual.streak > 0 ? '#FEF3C7' : '#F3F4F6', 
          paddingHorizontal: 8, 
          paddingVertical: 2, 
          borderRadius: 8,
          marginBottom: 4,
        }}>
          <Text style={{ 
            fontSize: 12, 
            color: ritual.streak > 0 ? '#D97706' : '#6B7280',
            fontWeight: '500',
          }}>
            🔥 {ritual.streak} days
          </Text>
        </View>
      </View>
    </View>
    
    {!ritual.completed && (
      <View style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#8B5CF6',
        borderRadius: 12,
      }}>
        <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>+11</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function App() {
  const logo = require("./assets/ritvana_logo.jpg");

  // State variables
  const [screen, setScreen] = useState("welcome");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("auth_choice");
  const [tempUser, setTempUser] = useState({ username: "", email: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Ritual setup state
  const [currentRitual, setCurrentRitual] = useState("");
  const [rituals, setRituals] = useState([]);
  const [setupStep, setSetupStep] = useState("");

  // Modal states
  const [showHistory, setShowHistory] = useState(false);
  const [showAddRitual, setShowAddRitual] = useState(false);
  const [newRitualName, setNewRitualName] = useState("");
  const [newRitualTime, setNewRitualTime] = useState("");

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Pre-defined rituals
  const predefinedRituals = ["Morning Meditation", "Exercise", "Read Book", "Drink Water", "Sleep Early", "Journaling"];

  // Animation effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, [screen]);

  // Send message function
  const sendBotMessage = useCallback((text) => {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  }, []);

  // FIXED: Check if ritual was already completed today
  const canCompleteRitual = useCallback((ritualIndex) => {
    if (!userData || !userData.rituals) return true;
    
    const ritual = userData.rituals[ritualIndex];
    if (!ritual.lastCompleted) return true;
    
    const lastCompleted = new Date(ritual.lastCompleted);
    const today = new Date();
    
    return lastCompleted.toDateString() !== today.toDateString();
  }, [userData]);

  // FIXED: Improved ritual completion with proper streak logic
  const markRitualComplete = useCallback(async (ritualIndex) => {
    if (!userData || !userData.rituals) return;

    // Check if ritual was already completed today
    if (!canCompleteRitual(ritualIndex)) {
      Alert.alert("Already Completed", "You've already completed this ritual today! 🌟");
      return;
    }

    const updatedRituals = [...userData.rituals];
    const today = new Date();
    const todayISO = today.toISOString();
    
    const ritual = updatedRituals[ritualIndex];
    
    // Check if we should increment streak (completed yesterday or today for the first time)
    let shouldIncrementStreak = false;
    
    if (ritual.lastCompleted) {
      const lastCompleted = new Date(ritual.lastCompleted);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Increment streak if last completion was yesterday (maintaining streak)
      // Or if no last completion (first time)
      if (lastCompleted.toDateString() === yesterday.toDateString() || !ritual.lastCompleted) {
        shouldIncrementStreak = true;
      }
    } else {
      // First time completing this ritual
      shouldIncrementStreak = true;
    }
    
    // Update ritual
    updatedRituals[ritualIndex] = {
      ...ritual,
      completed: true,
      lastCompleted: todayISO,
      streak: shouldIncrementStreak ? ritual.streak + 1 : ritual.streak
    };

    // Check if all rituals are completed for today
    const allCompleted = updatedRituals.every(r => r.completed);
    
    // Calculate user streak - increment only if all rituals completed today
    // and last completion wasn't today
    let newUserStreak = userData.streak;
    if (allCompleted) {
      const lastActive = userData.lastActive ? new Date(userData.lastActive) : null;
      const today = new Date();
      
      if (!lastActive || lastActive.toDateString() !== today.toDateString()) {
        newUserStreak = userData.streak + 1;
      }
    }

    const newPoints = userData.points + 11;

    const updatedData = {
      ...userData,
      rituals: updatedRituals,
      points: newPoints,
      streak: newUserStreak,
      lastActive: todayISO
    };

    setUserData(updatedData);

    try {
      await updateDoc(doc(db, "users", userId), updatedData);
      
      // Send progress message
      const completedCount = updatedRituals.filter(r => r.completed).length;
      const totalCount = updatedRituals.length;
      
      sendBotMessage(getProgressMessage(completedCount, totalCount, newUserStreak));

      if (allCompleted) {
        setTimeout(() => {
          sendBotMessage("🎊 Day completed! Your streak is now " + newUserStreak + " days! 🌟");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating ritual:", error);
      Alert.alert("Error", "Failed to update ritual. Please try again.");
    }
  }, [userData, userId, sendBotMessage, canCompleteRitual]);

  // Handle authentication choice
  const handleAuthChoice = useCallback((choice) => {
    setStep(choice);
    setTempUser({ username: "", email: "", password: "" });
    
    if (choice === "signup") {
      sendBotMessage("Great! Let's create your account. What's your username?");
    } else {
      sendBotMessage("Welcome back! Please enter your email:");
    }
  }, [sendBotMessage]);

  // Handle authentication
  const handleAuth = useCallback(async () => {
    if (!input.trim() || isProcessing) return;
    
    const text = input.trim();
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setIsProcessing(true);

    try {
      if (step === "signup") {
        if (!tempUser.username) {
          setTempUser({ ...tempUser, username: text });
          sendBotMessage("Nice username! Now enter your email:");
        } else if (!tempUser.email) {
          if (!text.includes("@") || !text.includes(".")) {
            sendBotMessage("❌ Please enter a valid email (example@gmail.com)");
            setIsProcessing(false);
            return;
          }
          setTempUser({ ...tempUser, email: text });
          sendBotMessage("Perfect! Now create a password (min 6 characters):");
        } else if (!tempUser.password) {
          if (text.length < 6) {
            sendBotMessage("❌ Password must be at least 6 characters long");
            setIsProcessing(false);
            return;
          }
          
          const userCredential = await createUserWithEmailAndPassword(auth, tempUser.email, text);
          const uid = userCredential.user.uid;
          setUserId(uid);

          const newData = {
            username: tempUser.username,
            email: tempUser.email,
            points: 0,
            streak: 0,
            currentDay: 1,
            rituals: [],
            createdAt: new Date().toISOString(),
            lastActive: null
          };
          
          await setDoc(doc(db, "users", uid), newData);
          setUserData(newData);
          
          sendBotMessage(`🎉 Welcome ${tempUser.username}! Account created successfully!`);
          setTimeout(() => {
            startRitualSetup();
          }, 1500);
        }
      } else if (step === "login") {
        if (!tempUser.email) {
          if (!text.includes("@") || !text.includes(".")) {
            sendBotMessage("❌ Please enter a valid email");
            setIsProcessing(false);
            return;
          }
          setTempUser({ ...tempUser, email: text });
          sendBotMessage("Now enter your password:");
        } else {
          const userCredential = await signInWithEmailAndPassword(auth, tempUser.email, text);
          const uid = userCredential.user.uid;
          setUserId(uid);

          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setRituals(data.rituals || []);
            
            sendBotMessage(`🤖 Welcome back ${data.username}! 🌸`);
            
            if (data.rituals && data.rituals.length > 0) {
              setTimeout(() => {
                setScreen("home");
                setStep("");
              }, 1500);
            } else {
              setTimeout(() => {
                startRitualSetup();
              }, 1500);
            }
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.code === "auth/email-already-in-use") {
        sendBotMessage("❌ Email already exists. Try logging in instead.");
        setStep("auth_choice");
      } else if (error.code === "auth/user-not-found") {
        sendBotMessage("❌ No account found with this email. Try signing up.");
        setStep("auth_choice");
      } else if (error.code === "auth/wrong-password") {
        sendBotMessage("❌ Incorrect password. Please try again.");
        setTempUser({ ...tempUser, password: "" });
      } else {
        sendBotMessage(`❌ Error: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, step, tempUser, sendBotMessage]);

  // Start ritual setup
  const startRitualSetup = useCallback(() => {
    sendBotMessage("🌿 Let's set up your daily rituals! Choose from these popular ones or type your own:");
    setSetupStep("select_ritual");
    setStep("ritual_setup");
    setRituals([]);
  }, [sendBotMessage]);

  // Handle ritual selection
  const handleRitualSelect = useCallback(async (ritual) => {
    setCurrentRitual(ritual);
    
    // Directly add the ritual without asking for reminders
    await saveRitual(ritual, null);
    sendBotMessage(`✅ "${ritual}" added! Want to add another ritual? [Yes/No]`);
    setSetupStep("add_more");
  }, [sendBotMessage]);

  // Save ritual to Firestore
  const saveRitual = useCallback(async (ritualName, reminderTime) => {
    const newRitual = {
      name: ritualName,
      time: reminderTime,
      completed: false,
      streak: 0,
      lastCompleted: null
    };

    const updatedRituals = [...rituals, newRitual];
    setRituals(updatedRituals);

    if (userId) {
      try {
        await updateDoc(doc(db, "users", userId), {
          rituals: updatedRituals
        });
      } catch (error) {
        console.error("Error saving ritual:", error);
      }
    }
  }, [rituals, userId]);

  // Complete ritual setup
  const completeRitualSetup = useCallback(() => {
    sendBotMessage("🎉 Your rituals are set! Ready to start your journey today? [Yes/No]");
    setSetupStep("start_today");
  }, [sendBotMessage]);

  // Start today's journey
  const startTodaysJourney = useCallback(async (decision) => {
    if (decision === "yes") {
      const startData = {
        ...userData,
        currentDay: 1,
        streak: 0,
        points: 0,
        rituals: rituals.map(r => ({ ...r, completed: false })),
        startDate: new Date().toISOString()
      };

      setUserData(startData);
      
      try {
        await updateDoc(doc(db, "users", userId), startData);
        sendBotMessage("🚀 Day 1 begins now! Your rituals await completion. Let's build amazing habits together! 💫");
        setTimeout(() => {
          setScreen("home");
          setStep("");
        }, 3000);
      } catch (error) {
        console.error("Error starting journey:", error);
        sendBotMessage("❌ Error starting your journey. Please try again.");
      }
    } else {
      sendBotMessage("No worries! Come back whenever you're ready to begin 🌿");
      setTimeout(() => {
        setScreen("home");
        setStep("");
      }, 2000);
    }
  }, [userData, rituals, userId, sendBotMessage]);

  // Handle ritual setup flow
  const handleRitualFlow = useCallback(() => {
    if (!input.trim()) return;
    const text = input.trim().toLowerCase();
    
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    switch (setupStep) {
      case "select_ritual":
        handleRitualSelect(text);
        break;
        
      case "add_more":
        if (text === "yes") {
          sendBotMessage("Choose another ritual or type a custom one:");
          setSetupStep("select_ritual");
        } else if (text === "no") {
          completeRitualSetup();
        } else {
          sendBotMessage("❌ Please answer with 'Yes' or 'No'");
        }
        break;
        
      case "start_today":
        if (text === "yes" || text === "no") {
          startTodaysJourney(text);
        } else {
          sendBotMessage("❌ Please answer with 'Yes' or 'No'");
        }
        break;
        
      default:
        break;
    }
  }, [input, setupStep, handleRitualSelect, completeRitualSetup, startTodaysJourney, sendBotMessage]);

  // Main send handler
  const handleSend = useCallback(() => {
    if (step === "ritual_setup") {
      handleRitualFlow();
    } else if (step === "signup" || step === "login") {
      handleAuth();
    }
  }, [step, handleRitualFlow, handleAuth]);

  // Get progress message
  const getProgressMessage = useCallback((completed, total, streak) => {
    const percentage = (completed / total) * 100;

    if (percentage === 100) {
      return "🎉 Amazing! You completed all rituals today! Small steps become big journeys 🌱";
    }

    if (percentage >= 70) {
      return "Almost there! Just a few more rituals to complete your day strong 💪";
    }

    if (percentage >= 40) {
      return "Good progress! Keep going - every ritual completed builds your balance 🌿";
    }

    return "Every journey begins with a single step. You've got this! 🌈";
  }, []);

  // Add new ritual function
  const addNewRitual = useCallback(async () => {
    if (!newRitualName.trim()) {
      sendBotMessage("❌ Please enter a ritual name");
      return;
    }

    if (newRitualTime && !newRitualTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      sendBotMessage("❌ Please enter time in HH:MM format (e.g., 08:00 or 22:30) or leave blank");
      return;
    }

    const ritualToAdd = {
      name: newRitualName.trim(),
      time: newRitualTime || null,
      completed: false,
      streak: 0,
      lastCompleted: null
    };

    const updatedRituals = userData?.rituals ? [...userData.rituals, ritualToAdd] : [ritualToAdd];
    setRituals(updatedRituals);

    if (userId) {
      try {
        await updateDoc(doc(db, "users", userId), {
          rituals: updatedRituals
        });
        
        setShowAddRitual(false);
        setNewRitualName("");
        setNewRitualTime("");
        
        setUserData(prev => ({
          ...prev,
          rituals: updatedRituals
        }));
        
        setTimeout(() => {
          sendBotMessage(`✅ "${ritualToAdd.name}" added successfully!`);
        }, 300);
        
      } catch (error) {
        console.error("Error adding ritual:", error);
        sendBotMessage("❌ Error adding ritual. Please try again.");
      }
    }
  }, [newRitualName, newRitualTime, userData, userId, sendBotMessage]);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setScreen("welcome");
      setTempUser({ username: "", email: "", password: "" });
      setMessages([]);
      setStep("auth_choice");
      setUserId(null);
      setUserData(null);
      setRituals([]);
      setSetupStep("");
      setShowHistory(false);
      setShowAddRitual(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // FIXED: Reset completion status at midnight with improved logic
  useEffect(() => {
    const resetDailyRituals = () => {
      if (userData && userData.rituals) {
        const now = new Date();
        const shouldReset = userData.rituals.some(ritual => {
          if (!ritual.lastCompleted) return false;
          const lastCompleted = new Date(ritual.lastCompleted);
          return lastCompleted.toDateString() !== now.toDateString();
        });

        if (shouldReset) {
          const updatedRituals = userData.rituals.map(ritual => ({
            ...ritual,
            completed: false
          }));

          const updatedData = {
            ...userData,
            rituals: updatedRituals
          };

          setUserData(updatedData);
          
          if (userId) {
            updateDoc(doc(db, "users", userId), {
              rituals: updatedRituals
            }).catch(error => {
              console.error("Error resetting rituals:", error);
            });
          }
        }
      }
    };

    // Check every minute if we need to reset
    const interval = setInterval(resetDailyRituals, 60000);
    return () => clearInterval(interval);
  }, [userData, userId]);

  // Auto-login effect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setRituals(data.rituals || []);
            setScreen("home");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    return unsubscribe;
  }, []);

  // History Screen Component
  const HistoryScreen = () => {
    if (!userData) return null;

    return (
      <Modal visible={showHistory} animationType="slide">
        <GradientBackground>
          <View style={{ flex: 1, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1F2937' }}>Your Journey</Text>
              <TouchableOpacity 
                onPress={() => setShowHistory(false)}
                style={{ 
                  backgroundColor: '#F3F4F6', 
                  padding: 12, 
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: '#6B7280', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
              <Card style={{ flex: 1, marginRight: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#8B5CF6' }}>⭐ {userData.points}</Text>
                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Total Points</Text>
              </Card>
              
              <Card style={{ flex: 1, marginHorizontal: 6, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B' }}>🔥 {userData.streak}</Text>
                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Day Streak</Text>
              </Card>
              
              <Card style={{ flex: 1, marginLeft: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>📅 {userData.currentDay}</Text>
                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Current Day</Text>
              </Card>
            </View>

            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>Ritual Performance</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {userData.rituals && userData.rituals.map((ritual, index) => (
                <Card key={index} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', fontSize: 16, color: '#1F2937', marginBottom: 4 }}>
                        {ritual.name}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#6B7280', marginRight: 16 }}>
                          Streak: {ritual.streak} days
                        </Text>
                        {ritual.time && (
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>
                            ⏰ {ritual.time}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      backgroundColor: ritual.streak > 0 ? '#10B981' : '#E5E7EB',
                      borderRadius: 12,
                    }}>
                      <Text style={{ 
                        color: ritual.streak > 0 ? 'white' : '#6B7280', 
                        fontSize: 12, 
                        fontWeight: '600' 
                      }}>
                        {ritual.streak > 0 ? 'Active' : 'New'}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </ScrollView>
          </View>
        </GradientBackground>
      </Modal>
    );
  };

  // Add Ritual Modal Component
  const AddRitualModal = () => {
    const [localRitualName, setLocalRitualName] = useState("");
    const [localRitualTime, setLocalRitualTime] = useState("");

    useEffect(() => {
      if (showAddRitual) {
        setLocalRitualName(newRitualName);
        setLocalRitualTime(newRitualTime);
      }
    }, [showAddRitual]);

    const handleAdd = () => {
      setNewRitualName(localRitualName);
      setNewRitualTime(localRitualTime);
      
      setTimeout(() => {
        addNewRitual();
      }, 50);
    };

    const handleCancel = () => {
      setShowAddRitual(false);
      setNewRitualName("");
      setNewRitualTime("");
    };

    return (
      <Modal 
        visible={showAddRitual} 
        animationType="slide" 
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 24
        }}>
          <Card style={{ 
            width: '100%',
            maxWidth: 400,
          }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1F2937', textAlign: 'center' }}>
              Create New Ritual
            </Text>
            
            <TextInput
              style={{ 
                borderWidth: 2, 
                borderColor: '#F3F4F6', 
                padding: 16, 
                borderRadius: 12, 
                marginBottom: 16,
                fontSize: 16,
                backgroundColor: '#F8FAFC',
                color: '#1F2937',
              }}
              placeholder="Ritual name (e.g., Morning Meditation)"
              placeholderTextColor="#9CA3AF"
              value={localRitualName}
              onChangeText={setLocalRitualName}
              autoFocus={true}
            />
            
            <TextInput
              style={{ 
                borderWidth: 2, 
                borderColor: '#F3F4F6', 
                padding: 16, 
                borderRadius: 12, 
                marginBottom: 24,
                fontSize: 16,
                backgroundColor: '#F8FAFC',
                color: '#1F2937',
              }}
              placeholder="Reminder time - HH:MM (optional)"
              placeholderTextColor="#9CA3AF"
              value={localRitualTime}
              onChangeText={setLocalRitualTime}
            />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <BeautifulButton 
                title="Cancel" 
                variant="neutral"
                onPress={handleCancel}
                style={{ flex: 1, marginRight: 12 }}
              />
              
              <BeautifulButton 
                title="Create Ritual" 
                onPress={handleAdd}
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
          </Card>
        </View>
      </Modal>
    );
  };

  // Welcome Screen
  if (screen === "welcome") {
    return (
      <GradientBackground>
        <Animated.View 
          style={{ 
            flex: 1, 
            justifyContent: "center", 
            alignItems: "center", 
            padding: 40,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 60 }}>
            <Image 
              source={logo} 
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: 60, 
                marginBottom: 32,
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 8,
              }} 
            />
            <Text style={{ 
              fontSize: 42, 
              fontWeight: "bold", 
              color: "#1F2937", 
              marginBottom: 12,
              textAlign: 'center'
            }}>
              Ritvana
            </Text>
            <Text style={{ 
              fontSize: 18, 
              color: "#6B7280", 
              textAlign: "center",
              lineHeight: 28,
              maxWidth: 300
            }}>
              Transform your daily routine into meaningful rituals. Build habits that last.
            </Text>
          </View>
          
          <BeautifulButton
            onPress={() => setScreen("chat")}
            title="Begin Your Journey"
            style={{ width: '100%', maxWidth: 300 }}
          />
          
          <Text style={{ 
            fontSize: 14, 
            color: "#9CA3AF", 
            textAlign: "center",
            marginTop: 32
          }}>
            Join thousands building better habits daily
          </Text>
        </Animated.View>
      </GradientBackground>
    );
  }

  // Home Screen
  if (screen === "home" && userData) {
    const completedRituals = userData.rituals ? userData.rituals.filter(r => r.completed).length : 0;
    const totalRituals = userData.rituals ? userData.rituals.length : 0;
    const progress = totalRituals > 0 ? (completedRituals / totalRituals) * 100 : 0;

    return (
      <GradientBackground>
        <View style={{ flex: 1, padding: 24 }}>
          {/* Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#8B5CF6", marginBottom: 4 }}>WELCOME BACK</Text>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}>
                {userData.username} 👋
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#6B7280" }}>Day {userData.currentDay}</Text>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <View style={{ 
                  backgroundColor: "#8B5CF6", 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 12, 
                  marginRight: 8 
                }}>
                  <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>⭐ {userData.points}</Text>
                </View>
                <View style={{ 
                  backgroundColor: "#F59E0B", 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 12 
                }}>
                  <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>🔥 {userData.streak}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Progress Card */}
          <Card style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>Today's Progress</Text>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#8B5CF6" }}>
                {completedRituals}/{totalRituals}
              </Text>
            </View>
            <ProgressBar progress={progress} />
            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>
              {progress === 100 ? "Amazing! All rituals completed! 🎉" : "Keep going! You're doing great! 💫"}
            </Text>
          </Card>

          {/* Rituals Section */}
          <View style={{ flex: 1, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}>Your Rituals</Text>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>
                {totalRituals} total
              </Text>
            </View>
            
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {userData.rituals && userData.rituals.map((ritual, index) => (
                <RitualItem
                  key={index}
                  ritual={ritual}
                  onPress={markRitualComplete}
                  index={index}
                />
              ))}
              
              {(!userData.rituals || userData.rituals.length === 0) && (
                <Card style={{ alignItems: 'center', padding: 40 }}>
                  <Text style={{ fontSize: 48, marginBottom: 16 }}>🌱</Text>
                  <Text style={{ fontSize: 16, color: "#6B7280", textAlign: 'center' }}>
                    No rituals yet. Start by adding your first ritual!
                  </Text>
                </Card>
              )}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <BeautifulButton 
              title="Add Ritual" 
              onPress={() => setShowAddRitual(true)}
              style={{ flex: 1, marginRight: 8 }}
            />
            
            <BeautifulButton 
              title="History" 
              variant="secondary"
              onPress={() => setShowHistory(true)}
              style={{ flex: 1, marginHorizontal: 8 }}
            />
            
            <BeautifulButton 
              title="Logout" 
              variant="neutral"
              onPress={handleLogout}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>

          {/* Modals */}
          <HistoryScreen />
          <AddRitualModal />
        </View>
      </GradientBackground>
    );
  }

  // Chat Screen
  return (
    <GradientBackground>
      <View style={{ flex: 1, padding: 24, maxWidth: 500, alignSelf: "center", width: "100%" }}>
        {/* Points & Streaks in Corner */}
        {userData && (
          <View style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ 
                backgroundColor: "#8B5CF6", 
                paddingHorizontal: 12, 
                paddingVertical: 6, 
                borderRadius: 12, 
                marginRight: 8,
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>⭐ {userData.points}</Text>
              </View>
              <View style={{ 
                backgroundColor: "#F59E0B", 
                paddingHorizontal: 12, 
                paddingVertical: 6, 
                borderRadius: 12,
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>🔥 {userData.streak}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Image 
            source={logo} 
            style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 40,
              marginBottom: 16,
              shadowColor: '#8B5CF6',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 6,
            }} 
          />
          <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1F2937" }}>Ritvana</Text>
          <Text style={{ color: "#8B5CF6", marginTop: 4, fontWeight: '500' }}>Your AI Habit Companion</Text>
        </View>

        {/* Messages */}
        <ScrollView style={{ flex: 1, marginBottom: 16 }} showsVerticalScrollIndicator={false}>
          {messages.map((msg, i) => (
            <Card
              key={i}
              style={{
                alignSelf: msg.from === "bot" ? "flex-start" : "flex-end",
                backgroundColor: msg.from === "bot" ? "#F8FAFC" : "#8B5CF6",
                marginVertical: 8,
                maxWidth: "85%",
              }}
            >
              <Text style={{
                color: msg.from === "bot" ? "#1F2937" : "white",
                fontSize: 16,
                lineHeight: 24,
              }}>
                {msg.from === "bot" ? "🤖 " : "👤 "}{msg.text}
              </Text>
            </Card>
          ))}
          
          {/* Auth Choice Buttons */}
          {step === "auth_choice" && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24 }}>
              <BeautifulButton
                title="Create Account"
                onPress={() => handleAuthChoice("signup")}
                style={{ flex: 1, marginRight: 12 }}
              />
              <BeautifulButton
                title="Sign In"
                variant="secondary"
                onPress={() => handleAuthChoice("login")}
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
          )}

          {/* Predefined ritual buttons */}
          {setupStep === "select_ritual" && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 16, justifyContent: 'center' }}>
              {predefinedRituals.map((ritual, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRitualSelect(ritual)}
                  style={{
                    backgroundColor: "#8B5CF6",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    margin: 6,
                    shadowColor: '#8B5CF6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 14, fontWeight: '500' }}>{ritual}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        {(step === "signup" || step === "login" || step === "ritual_setup") && (
          <ChatInput
            step={step}
            tempUser={tempUser}
            isProcessing={isProcessing}
            input={input}
            setInput={setInput}
            onSend={handleSend}
          />
        )}
      </View>
    </GradientBackground>
  );
}