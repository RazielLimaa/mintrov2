"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Header from "@/components/Header"
import { router } from "expo-router"

const { width } = Dimensions.get("window")

interface ObjectiveGridItemProps {
  label: string
  icon: string
  isSelected: boolean
  onPress: () => void
}

const ObjectiveGridItem: React.FC<ObjectiveGridItemProps> = ({ label, icon, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.objectiveGridItem, isSelected ? styles.objectiveGridItemSelected : null]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon as any} size={24} color={isSelected ? "white" : "#333"} />
      <Text style={[styles.objectiveLabel, isSelected ? styles.objectiveLabelSelected : null]}>{label}</Text>
    </TouchableOpacity>
  )
}

interface PeriodOptionProps {
  label: string
  isSelected: boolean
  onPress: () => void
}

const PeriodOption: React.FC<PeriodOptionProps> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity style={styles.periodOption} onPress={onPress}>
      <View style={styles.radioButton}>{isSelected && <View style={styles.radioButtonSelected} />}</View>
      <Text style={styles.periodLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

const CreateObjectiveScreen: React.FC = () => {
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  const objectives = [
    { id: "ler", label: "Ler", icon: "file-document-outline" },
    { id: "escrever", label: "Ler", icon: "file-document-outline" },
    { id: "meditar", label: "Ler", icon: "file-document-outline" },
    { id: "correr", label: "Ler", icon: "file-document-outline" },
    { id: "caminhar", label: "Ler", icon: "file-document-outline" },
    { id: "nadar", label: "Ler", icon: "file-document-outline" },
    { id: "estudar", label: "Ler", icon: "file-document-outline" },
    { id: "cozinhar", label: "Ler", icon: "file-document-outline" },
    { id: "dormir", label: "Ler", icon: "file-document-outline" },
    { id: "hidratar", label: "Ler", icon: "file-document-outline" },
    { id: "exercitar", label: "Ler", icon: "file-document-outline" },
    { id: "yoga", label: "Ler", icon: "file-document-outline" },
    { id: "alongar", label: "Ler", icon: "file-document-outline" },
    { id: "extra", label: "Ler", icon: "file-document-outline" },
  ]

  const handleSave = () => {
    console.log("Objetivo Selecionado:", selectedObjective)
    console.log("Período Selecionado:", selectedPeriod)
  }

  return (
    <><Header
      avatarChar="A" /><View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => router.push('/(tabs)/activity')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Criar Objetivo</Text>
            </View>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Objectives Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escolha um objetivo</Text>
            <View style={styles.objectiveGrid}>
              {objectives.map((obj) => (
                <ObjectiveGridItem
                  key={obj.id}
                  label={obj.label}
                  icon={obj.icon}
                  isSelected={selectedObjective === obj.id}
                  onPress={() => setSelectedObjective(obj.id)} />
              ))}
            </View>
          </View>

          {/* Period Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Período</Text>
            <View style={styles.periodCard}>
              <PeriodOption
                label="1 Semana"
                isSelected={selectedPeriod === "1 Semana"}
                onPress={() => setSelectedPeriod("1 Semana")} />
              <View style={styles.periodSeparator} />
              <PeriodOption
                label="2 Semanas"
                isSelected={selectedPeriod === "2 Semanas"}
                onPress={() => setSelectedPeriod("2 Semanas")} />
              <View style={styles.periodSeparator} />
              <PeriodOption
                label="3 Semanas"
                isSelected={selectedPeriod === "3 Semanas"}
                onPress={() => setSelectedPeriod("3 Semanas")} />
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View></>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
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
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  objectiveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },
  objectiveGridItem: {
    width: (width - 48) / 5,
    height: (width - 48) / 5,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  objectiveGridItemSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  objectiveLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
  objectiveLabelSelected: {
    color: "white",
  },
  periodCard: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  periodLabel: {
    fontSize: 16,
    color: "#333",
  },
  periodSeparator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: -16,
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
    color: "#4A90E2",
    fontWeight: "600",
    marginTop: 4,
  },
})

export default CreateObjectiveScreen
