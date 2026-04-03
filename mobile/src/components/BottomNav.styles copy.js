import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  contentHolder: {
    flexDirection: 'row',
    width: width,
    height: 60,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 4,
  },

  activeCircle: {
    position: 'absolute',
    top: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16A34A', // ✅ green color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },

  label: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginTop: 35,
  },

  inactiveLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});