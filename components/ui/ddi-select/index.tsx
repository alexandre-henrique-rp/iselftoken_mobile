/**
 * Componente DDISelect - iSelfToken
 * Select funcional para escolher código do país (DDI)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';
import PublicApi from '@/api/public';
import { CountryApi } from '@/types/country';

interface DDISelectProps {
  value?: string;
  onSelect: (ddi: string) => void;
  style?: any;
  testID?: string;
}

export function DDISelect({ 
  value = '+55', 
  onSelect, 
  style, 
  testID 
}: DDISelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [COUNTRIES, setCOUNTRIES] = useState<CountryApi[]>([]);
  

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await PublicApi.countries();
        setCOUNTRIES(response.data); // ✅ Acessando .data do AxiosResponse
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);
  
  
  // Encontrar país selecionado atual
  const selectedCountry = COUNTRIES.find(country => country.phonecode === value.replace('+', '')) || {
    emoji: '🇧🇷',
    name: 'Brasil',
    phonecode: '55'
  };

  const handleSelect = (country: CountryApi) => {
    onSelect(`+${country.phonecode}`);
    setModalVisible(false);
  };

  const renderCountryItem = ({ item }: { item: CountryApi }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleSelect(item)}
      testID={`country-${item.phonecode}`}
    >
      <Text style={styles.countryEmoji}>{item.emoji}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryDdi}>+{item.phonecode}</Text>
      </View>
      {item.phonecode === value.replace('+', '') && (
        <Ionicons name="checkmark" size={20} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      {/* Trigger - Botão que abre o modal */}
      <TouchableOpacity
        style={[styles.selectButton, style]}
        onPress={() => setModalVisible(true)}
        testID={testID}
      >
        <Text style={styles.selectedEmoji}>{selectedCountry.emoji}</Text>
        <Text style={styles.selectedDdi}>+{selectedCountry.phonecode}</Text>
        <Ionicons name="chevron-down" size={16} color={Colors.text.muted} />
      </TouchableOpacity>

      {/* Modal com lista de países */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Selecionar País</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Lista de Países */}
          <FlatList
            data={COUNTRIES}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.countryList}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
    height: 62, // ✅ Mesma altura do input
  },
  selectedEmoji: {
    fontSize: 20,
  },
  selectedDdi: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  countryList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  countryEmoji: {
    fontSize: 20,
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  countryDdi: {
    fontSize: 14,
    color: Colors.text.muted,
  },
});
