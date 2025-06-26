import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BookIcon } from './Icons/BookIcon';
import CompletionIcon from './Icons/CompletionIon';
import NotebookIcon from './Icons/NotebookIcon';

interface ObjectiveDisplayCardProps {
  objectiveTitle: string;
  objectiveSubtitle: string;
}

const { width } = Dimensions.get('window');

const ObjectiveDisplayCard: React.FC<ObjectiveDisplayCardProps> = ({
  objectiveTitle,
  objectiveSubtitle,
}) => {
  return (
    <View style={styles.objectiveCard}>
      <View style={styles.objectiveLeft}>
        <View style={styles.checkboxContainer}>
          <CompletionIcon/>
        </View>
        <NotebookIcon color='#000' size={18}/>
      </View>
      <View style={styles.objectiveContent}>
        <Text style={styles.objectiveTitle}>{objectiveTitle}</Text>
        <Text style={styles.objectiveSubtitle}>{objectiveSubtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  objectiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    elevation: 6,
    marginBottom: 16,
  },
  objectiveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  objectiveContent: {
    flex: 1,
  },
  objectiveTitle: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#000',
    marginBottom: 1,
  },
  objectiveSubtitle: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
  },
});

export default ObjectiveDisplayCard;