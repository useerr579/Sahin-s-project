import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

type Props = {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  children: React.ReactNode;
};

export default function ModalComponent({ isModalVisible, setModalVisible, children }: Props) {
  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { width: '100%', justifyContent: 'flex-end' },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 4, backgroundColor: '#d4d4d8', marginBottom: 8 },
});
