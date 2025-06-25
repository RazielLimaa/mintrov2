"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import Header from "@/components/Header"

const { width, height } = Dimensions.get("window")

interface MoodOption {
  id: string
  label: string
  imageSource: any
  isSelected: boolean
}

interface ActivityOption {
  id: string
  label: string
  isSelected: boolean
}

const NewDiaryScreen: React.FC = () => {
  const [title, setTitle] = useState("")
  const [selectedDate, setSelectedDate] = useState("Ontem, 18 de junho")
  const [selectedTime, setSelectedTime] = useState("11:16")
  const [annotation, setAnnotation] = useState("")

  const [moods, setMoods] = useState<MoodOption[]>([
    { id: "excelente", label: "Excelente", imageSource: require("@/assets/images/mood-excellent.png"), isSelected: false },
    { id: "bem", label: "Bem", imageSource: require("@/assets/images/mood-excellent.png"), isSelected: false },
    { id: "neutro", label: "Neutro", imageSource: require("@/assets/images/mood-neutral.png"), isSelected: false },
    { id: "mal", label: "Mal", imageSource: require("@/assets/images/mood-sad.png"), isSelected: false },
    { id: "horrivel", label: "Horrível", imageSource: require("@/assets/images/mood-cry.png"), isSelected: false },
  ])

  const [activities, setActivities] = useState<ActivityOption[]>([
    { id: "ler1", label: "Ler", isSelected: false },
    { id: "ler2", label: "Ler", isSelected: false },
    { id: "ler3", label: "Ler", isSelected: false },
    { id: "ler4", label: "Ler", isSelected: false },
    { id: "ler5", label: "Ler", isSelected: false },
    { id: "ler6", label: "Ler", isSelected: false },
    { id: "ler7", label: "Ler", isSelected: false },
    { id: "ler8", label: "Ler", isSelected: false },
    { id: "ler9", label: "Ler", isSelected: false },
    { id: "ler10", label: "Ler", isSelected: false },
    { id: "ler11", label: "Ler", isSelected: false },
    { id: "ler12", label: "Ler", isSelected: false },
    { id: "ler13", label: "Ler", isSelected: false },
    { id: "ler14", label: "Ler", isSelected: false },
  ])

  const handleBack = () => {
    router.back()
  }

  const handleSave = () => {
    console.log("Saving diary entry:", {
      title,
      selectedDate,
      selectedTime,
      selectedMoods: moods.filter((m) => m.isSelected),
      selectedActivities: activities.filter((a) => a.isSelected),
      annotation,
    })
    router.back()
  }

  const handleMoodSelect = (moodId: string) => {
    setMoods(moods.map((mood) => (mood.id === moodId ? { ...mood, isSelected: !mood.isSelected } : mood)))
  }

  const handleActivitySelect = (activityId: string) => {
    setActivities(
      activities.map((activity) =>
        activity.id === activityId ? { ...activity, isSelected: !activity.isSelected } : activity,
      ),
    )
  }

  const handleChoosePhoto = () => {
    console.log("Choose photo pressed")
  }

  const MoodIcon: React.FC<{ mood: MoodOption }> = ({ mood }) => {
    return (
      <TouchableOpacity
        style={[styles.moodOption, mood.isSelected && styles.moodOptionSelected]}
        onPress={() => handleMoodSelect(mood.id)}
      >
        <View style={styles.moodIconContainer}>
          <Image source={mood.imageSource} style={styles.moodImage} resizeMode="contain" />
        </View>
        <Text style={[styles.moodLabel, mood.isSelected && styles.moodLabelSelected]}>{mood.label}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

     <Header avatarChar="A" />

      {/* White Header Section */}
      <View style={styles.whiteHeader}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Novo Diário</Text>
          </View>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.section}>
          <TextInput
            style={styles.titleInput}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
        </View>

        {/* Date and Time Selectors */}
        <View style={styles.dateTimeSection}>
          <TouchableOpacity style={styles.dateTimeButton}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            <Text style={styles.dateTimeText}>{selectedDate}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateTimeButton}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
            <Text style={styles.dateTimeText}>{selectedTime}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Mood Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <MoodIcon key={mood.id} mood={mood} />
            ))}
          </View>
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que você tem feito?</Text>
          <View style={styles.activityGrid}>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[styles.activityItem, activity.isSelected && styles.activityItemSelected]}
                onPress={() => handleActivitySelect(activity.id)}
              >
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={24}
                  color={activity.isSelected ? "white" : "#333"}
                />
                <Text style={[styles.activityLabel, activity.isSelected && styles.activityLabelSelected]}>
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Objectives Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivos</Text>
          <View style={styles.objectiveItem}>
            <MaterialCommunityIcons name="check" size={20} color="#4CAF50" />
            <MaterialCommunityIcons name="file-document-outline" size={20} color="#333" style={styles.objectiveIcon} />
            <View style={styles.objectiveText}>
              <Text style={styles.objectiveTitle}>Ler</Text>
              <Text style={styles.objectiveSubtitle}>Sequencia de 2 dias</Text>
            </View>
          </View>
        </View>

        {/* Annotation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anotação</Text>
          <TextInput
            style={styles.annotationInput}
            placeholder="Coloque uma quantidade personalizada"
            value={annotation}
            onChangeText={setAnnotation}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />
        </View>

        {/* Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto</Text>
          <TouchableOpacity style={styles.photoSection} onPress={handleChoosePhoto}>
            <MaterialCommunityIcons name="image-outline" size={48} color="#CCC" />
            <Text style={styles.choosePhotoText}>Escolher Foto</Text>
            <Text style={styles.photoSubtext}>Clique para adicionar uma foto</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  greenHeader: {
    backgroundColor: "#8BC34A",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  mintrLogo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  whiteHeader: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  titleInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateTimeSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 8,
  },
  dateTimeText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  moodGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  moodOption: {
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  moodOptionSelected: {
    // Add selected styling if needed
  },
  moodIconContainer: {
    marginBottom: 8,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  moodImage: {
    width: 50,
    height: 50,
  },
  moodLabel: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  moodLabelSelected: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  activityItem: {
    width: (width - 48) / 5,
    height: (width - 48) / 5,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 8,
  },
  activityItemSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  activityLabel: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 4,
  },
  activityLabelSelected: {
    color: "white",
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  objectiveIcon: {
    marginLeft: 8,
    marginRight: 12,
  },
  objectiveText: {
    flex: 1,
  },
  objectiveTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  objectiveSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  annotationInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 100,
    textAlignVertical: "top",
  },
  photoSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  choosePhotoText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 12,
  },
  photoSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 20,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  navLabelSelected: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 4,
  },
})

export default NewDiaryScreen
