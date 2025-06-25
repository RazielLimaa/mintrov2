import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  value: number | string; // O valor numérico ou texto da estatística
  label: string; // O texto da label (ex: 'Diários registrados')
  cardWidth: number; // Largura pré-calculada para responsividade
  style?: ViewStyle; // Para estilos adicionais no card (como margins)
}

const StatCard: React.FC<StatCardProps> = ({ iconName, value, label, cardWidth, style }) => {
  return (
    <View style={[styles.card, { width: cardWidth }, style]}>
      <View style={styles.iconBackground}>
        <MaterialCommunityIcons name={iconName} size={28} color="#7F8C8D" />
      </View>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Um pouco menos arredondado que o FormCardCommon
    padding: 15, // Preenchimento interno
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 10, // Espaçamento entre as linhas de cards
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular
    backgroundColor: '#F3F4F6', // Fundo cinza claro do ícone
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Espaçamento entre o ícone e o valor
  },
  valueText: {
    fontSize: 26, // Tamanho maior para o número
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4, // Espaçamento entre o valor e o label
  },
  labelText: {
    fontSize: 14, // Tamanho para o label
    textAlign: 'center', // Centraliza o texto
    color: '#7F8C8D',
    lineHeight: 18, // Garante quebra de linha com espaçamento
  },
});

export default StatCard;