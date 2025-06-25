import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ViewStyle,
  TouchableOpacity,
} from 'react-native'
import { TextInput, Menu, Button, ActivityIndicator } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import Header from '@/components/Header'
import FormHeader from '@/components/FormHeader'
import { registerExerciseLog } from '@/services/exercise/registerExerciseLog'
import { getExerciseList } from '@/services/exercise/listExercise'
import { Exercise } from '@/types/health/exercise'

const RegisterExerciseScreen: React.FC = () => {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([])
  const [exerciseId, setExerciseId] = useState<number | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)

  const [duration, setDuration] = useState<string>('30')
  const [distance, setDistance] = useState<string>('') // opcional
  const [description, setDescription] = useState<string>('Corrida matinal')
  const [datetime, setDatetime] = useState<Date>(new Date())

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [loadingExercises, setLoadingExercises] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)

  useEffect(() => {
    const fetchExercises = async () => {
      setLoadingExercises(true)
      try {
        const data = await getExerciseList()
        setExerciseList(data)
        if (data.length > 0) setExerciseId(data[0].id)
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Não foi possível carregar exercícios.')
      } finally {
        setLoadingExercises(false)
      }
    }
    fetchExercises()
  }, [])

  function formatDatetimeToISO(date: Date): string {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
  }

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      const newDate = new Date(datetime)
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      setDatetime(newDate)
    }
  }

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios')
    if (selectedTime) {
      const newDate = new Date(datetime)
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())
      setDatetime(newDate)
    }
  }

  const handleSave = async () => {
    if (!exerciseId) {
      Alert.alert('Erro', 'Selecione um exercício.')
      return
    }

    setLoadingSave(true)
    const data = {
      exercise: exerciseId,
      duration: parseInt(duration, 10),
      distance: distance ? parseFloat(distance) : undefined,
      description: description,
      datetime: formatDatetimeToISO(datetime),
    }

    try {
      await registerExerciseLog(data)
      Alert.alert('Sucesso', 'Exercício registrado com sucesso!')
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível registrar o exercício.')
    } finally {
      setLoadingSave(false)
    }
  }

  return (
    <View style={styles.container}>
      <Header avatarChar="A" />
      <FormHeader title="Registrar Exercício" onSavePress={handleSave} />

      <View style={styles.formContent}>
        {/* Exercício select */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Exercício</Text>
          {loadingExercises ? (
            <ActivityIndicator animating size="small" />
          ) : (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.menuButton}
                  contentStyle={{ justifyContent: 'space-between' }}
                >
                  {exerciseId
                    ? exerciseList.find((ex) => ex.id === exerciseId)?.name || 'Selecione'
                    : 'Selecione'}
                </Button>
              }
            >
              {exerciseList.map((exercise) => (
                <Menu.Item
                  key={exercise.id}
                  onPress={() => {
                    setExerciseId(exercise.id)
                    setMenuVisible(false)
                  }}
                  title={exercise.name}
                />
              ))}
            </Menu>
          )}
        </View>

        {/* Data */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Data</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.textInput, styles.pickerButton]}>
            <Text>{datetime.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={datetime} mode="date" display="default" onChange={onChangeDate} />
          )}
        </View>

        {/* Hora */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Hora</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[styles.textInput, styles.pickerButton]}>
            <Text>{datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker value={datetime} mode="time" display="default" onChange={onChangeTime} />
          )}
        </View>

        {/* Descrição */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <TextInput
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            style={styles.textInput}
            outlineStyle={styles.textInputOutline as ViewStyle}
          />
        </View>

        {/* Duração */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Duração (minutos)</Text>
          <TextInput
            mode="outlined"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={styles.textInput}
            outlineStyle={styles.textInputOutline as ViewStyle}
          />
        </View>

        {/* Distância */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Distância (km)</Text>
          <TextInput
            mode="outlined"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
            placeholder="Opcional"
            style={styles.textInput}
            outlineStyle={styles.textInputOutline as ViewStyle}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  formContent: { padding: 16 },
  inputSection: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  textInputOutline: { borderRadius: 8, borderColor: '#e0e0e0' } as ViewStyle,
  pickerButton: { justifyContent: 'center' },
  menuButton: { justifyContent: 'space-between' },
})

export default RegisterExerciseScreen
