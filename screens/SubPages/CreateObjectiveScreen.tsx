"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Header from "@/components/Header"
import { router } from "expo-router"
import { Activity } from "@/types/mental/diary"
import { getActivities } from "@/services/diary/listActivities"
import FormHeader from "@/components/FormHeader"
import { registerObjectiveLog } from "@/services/objectives/createObjective"
import { ObjectiveWrite } from "@/types/mental/objectives"

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
  const [objectives, setObjectives] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const data = await getActivities()
        setObjectives(data)
      } catch (error) {
        console.error("Erro ao buscar atividades:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchObjectives()
  }, [])

  const handleSave = async () => {
  if (!selectedObjective || !selectedPeriod) {
    alert("Selecione um objetivo e um período antes de salvar.")
    return
  }

  const data: ObjectiveWrite = {
    activity: parseInt(selectedObjective),
    period: selectedPeriod as '1w' | '2w' | '3w',
  }

  try {
    await registerObjectiveLog(data)
    alert("Objetivo registrado com sucesso!")
    router.back()
  } catch (error: any) {
    console.error("Erro ao registrar objetivo:", error)
    alert(error.message || "Erro ao registrar objetivo.")
  }
}

  return (
    <>
      <Header avatarChar="A" />
      <FormHeader title="Criar Objetivo" onSavePress={handleSave}/>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Objectives Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escolha um objetivo</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#4CAF50" style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.objectiveGrid}>
                {objectives.map((obj) => (
                  <ObjectiveGridItem
                    key={obj.id}
                    label={obj.name}
                    icon={"file-document-outline"}
                    isSelected={selectedObjective === obj.id.toString()}
                    onPress={() => setSelectedObjective(obj.id.toString())}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Período</Text>
            <View style={styles.periodCard}>
              <PeriodOption
                label="1 Semana"
                isSelected={selectedPeriod === "1w"}
                onPress={() => setSelectedPeriod("1w")}
              />
              <View style={styles.periodSeparator} />
              <PeriodOption
                label="2 Semanas"
                isSelected={selectedPeriod === "2w"}
                onPress={() => setSelectedPeriod("2w")}
              />
              <View style={styles.periodSeparator} />
              <PeriodOption
                label="3 Semanas"
                isSelected={selectedPeriod === "3w"}
                onPress={() => setSelectedPeriod("3w")}
              />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
    </>
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
})

export default CreateObjectiveScreen
